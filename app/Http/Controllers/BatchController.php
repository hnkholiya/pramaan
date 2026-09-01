<?php

namespace App\Http\Controllers;

use App\Http\Requests\MapBatchFieldsRequest;
use App\Http\Requests\StoreBatchRequest;
use App\Jobs\AnchorBatchJob;
use App\Jobs\GenerateBatchCertificatesJob;
use App\Models\CertificateBatch;
use App\Models\DocumentTemplate;
use App\Services\CertificateService;
use App\Services\CsvService;
use App\Services\FieldMappingService;
use App\Services\Payment\PaymentService;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ZipService;
use App\Services\OrganizationAccessService;

class BatchController extends Controller
{
    public function __construct(
        private CsvService $csv,
        private FieldMappingService $mapping,
        private PricingService $pricing,
        private PaymentService $payment,
        private CertificateService $certificates,
        private ZipService $zip,
        private OrganizationAccessService $organizationAccess,
    ) {}

    private function owned(Request $request, CertificateBatch $batch): CertificateBatch
    {
        abort_unless($batch->organization_id === $request->user()?->currentOrganization()?->id, 403, 'Forbidden.');

        return $batch;
    }

    public function index(Request $request)
    {
        $batches = $request->user()->currentOrganization()->batches()
            ->with(['template', 'quote', 'merkleAnchor'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'template' => $b->template?->name,
                'status' => $b->status->value,
                'total' => $b->total_records,
                'valid' => $b->valid_records,
                'invalid' => $b->invalid_records,
                'quote_total' => $b->quote?->total,
                'anchor_status' => $b->merkleAnchor?->status->value,
                'created_at' => $b->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Batches/Index', ['batches' => $batches]);
    }

    public function create(Request $request)
    {
        $templates = $request->user()->currentOrganization()->templates()->orderByDesc('updated_at')->get()
            ->map(fn($t) => ['id' => $t->id, 'name' => $t->name]);

        return Inertia::render('Batches/Create', ['templates' => $templates]);
    }

    public function store(StoreBatchRequest $request)
    {
        $org = $request->user()->currentOrganization();

        if (! $org) {
            return redirect()->route('organization.create');
        }

        $this->organizationAccess->assertActive($org);

        $template = DocumentTemplate::findOrFail(
            $request->validated()['template_id']
        );
        abort_unless($template->organization_id === $org->id, 403);

        $contents = file_get_contents($request->file('csv')->getRealPath());

        $batch = $this->csv->createBatch($org, $template, $request->file('csv')->getClientOriginalName(), $contents);

        return redirect()->route('organization.batches.show', $batch)->with('success', 'Batch created. Review the data below.');
    }

    public function show(Request $request, CertificateBatch $batch)
    {
        $this->owned($request, $batch);
        $batch->load(['records', 'fieldMapping', 'quote', 'template', 'merkleAnchor']);

        $dynamicFields = $batch->template->elements()
            ->where('type', 'DYNAMIC_FIELD')
            ->get()
            ->map(fn($e) => ['data_key' => $e->data_key, 'name' => $e->name])
            ->values();

        return Inertia::render('Batches/Show', [
            'batch' => [
                'id' => $batch->id,
                'status' => $batch->status->value,
                'headers' => $batch->original_headers,
                'total' => $batch->total_records,
                'valid' => $batch->valid_records,
                'invalid' => $batch->invalid_records,
                'template' => $batch->template?->name,
                'template_version' => $batch->templateVersion?->version,
                'mapping' => $batch->fieldMapping?->mapping,
                'quote' => $batch->quote,
                'anchor_status' => $batch->merkleAnchor?->status->value,
                'anchor_root' => $batch->merkleAnchor?->merkle_root,
                'transaction_hash' => $batch->merkleAnchor?->transaction_hash,
            ],
            'records' => $batch->records->map(fn($r) => [
                'id' => $r->id,
                'row' => $r->row_number,
                'data' => $r->source_data,
                'status' => $r->status->value,
                'errors' => $r->validation_errors,
                'certificate' => $r->certificate ? [
                    'number' => $r->certificate->certificate_number,
                    'token' => $r->certificate->verification_token,
                ] : null,
            ]),
            'dynamic_fields' => $dynamicFields,
            'payment_mode' => config('payments.provider'),
        ]);
    }


    /**
     * Download all issued certificates in a batch as a ZIP archive.
     */
    public function downloadZip(
        Request $request,
        CertificateBatch $batch
    ) {
        $this->owned($request, $batch);

        $result = $this->zip->createBatchZip($batch);

        return response()
            ->download(
                $result['path'],
                $result['filename'],
                [
                    'Content-Type' =>
                    'application/zip',
                    'Content-Disposition' =>
                    'attachment; filename="' . $result['filename'] . '"',
                ]
            )
            ->deleteFileAfterSend(true);
    }

    public function validate(Request $request, CertificateBatch $batch)
    {
        $this->owned($request, $batch);

        $this->organizationAccess->assertActive(
            $request->user()->currentOrganization()
                ?? abort(403, 'Organization not found.')
        );

        $headers = $batch->original_headers ?? [];
        $rules = [];
        foreach ($headers as $h) {
            if (str_contains(strtolower($h), 'email')) {
                $rules[$h] = 'email';
            }
            if (str_contains(strtolower($h), 'date')) {
                $rules[$h] = 'date';
            }
        }

        $summary = $this->csv->validateRecords($batch, $headers, $rules);

        return redirect()->route('organization.batches.show', $batch)->with('success', "Validated: {$summary['valid']} valid, {$summary['invalid']} invalid.");
    }

    public function map(MapBatchFieldsRequest $request, CertificateBatch $batch)
    {
        $this->owned($request, $batch);

        $this->organizationAccess->assertActive(
            $request->user()->currentOrganization()
                ?? abort(403, 'Organization not found.')
        );

        $this->mapping->saveMapping(
            $batch,
            $request->validated()['mapping'],
            $request->user()->id
        );

        // Assert coverage of template dynamic fields.
        $required = $batch->template->elements()
            ->where('type', 'DYNAMIC_FIELD')
            ->whereNotNull('data_key')
            ->pluck('data_key')
            ->all();

        $this->mapping->assertCoverage($batch, $required);

        return redirect()->route('organization.batches.show', $batch)->with('success', 'Field mapping saved.');
    }

    public function quote(Request $request, CertificateBatch $batch)
    {
        $this->owned($request, $batch);

        $this->organizationAccess->assertActive(
            $request->user()->currentOrganization()
                ?? abort(403, 'Organization not found.')
        );

        $this->pricing->buildQuote($batch);

        return redirect()->route('organization.batches.show', $batch)->with('success', 'Quote generated.');
    }

    public function pay(Request $request, CertificateBatch $batch)
    {
        $this->owned($request, $batch);

        $this->organizationAccess->assertActive(
            $request->user()->currentOrganization()
                ?? abort(403, 'Organization not found.')
        );

        $quote = $batch->quote
            ?? abort(422, 'Generate a quote first.');

        if (config('payments.provider') === 'razorpay') {
            $payment = $this->payment->createOrderForQuote($quote);

            return Inertia::render('Batches/Checkout', [
                'batch_id' => $batch->id,
                'payment' => [
                    'id' => $payment->id,
                    'order_id' => $payment->provider_order_id,
                    'amount' => $payment->amount,
                    'currency' => $payment->currency,
                ],
                'razorpay_key' => config('payments.razorpay.key_id'),
            ]);
        }

        // Mock mode: create order + simulate server-side capture.
        $payment = $this->payment->createOrderForQuote($quote);
        $this->payment->verifyAndCapture($payment, [
            'razorpay_order_id' => $payment->provider_order_id,
            'razorpay_payment_id' => 'pay_' . random_int(1000, 9999),
            'razorpay_signature' => 'mock_paid_signature',
        ]);

        return redirect()->route('organization.batches.show', $batch)->with('success', 'Payment captured (mock). Batch is ready.');
    }

    public function generate(Request $request, CertificateBatch $batch)
    {
        $this->owned($request, $batch);

        $this->organizationAccess->assertActive(
            $request->user()->currentOrganization()
                ?? abort(403, 'Organization not found.')
        );

        if (config('queue.default') === 'sync') {
            $this->certificates->generateBatchCertificates($batch);
        } else {
            GenerateBatchCertificatesJob::dispatch($batch);
        }

        return redirect()->route('organization.batches.show', $batch)->with('success', 'Certificate generation started.');
    }

    public function anchor(Request $request, CertificateBatch $batch)
    {
        $this->owned($request, $batch);

        $this->organizationAccess->assertActive(
            $request->user()->currentOrganization()
                ?? abort(403, 'Organization not found.')
        );

        if (config('queue.default') === 'sync') {
            $anchor = $this->certificates->anchorBatch($batch);
        } else {
            AnchorBatchJob::dispatch($batch);
            $anchor = $batch->merkleAnchor;
        }

        return redirect()->route('organization.batches.show', $batch)->with('success', 'Batch anchored to blockchain.');
    }
}
