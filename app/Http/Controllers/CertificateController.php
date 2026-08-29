<?php

namespace App\Http\Controllers;

use App\Enums\ActivityAction;
use App\Models\Certificate;
use App\Services\ActivityLogService;
use App\Services\StorageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateController extends Controller
{
    public function __construct(
        private StorageService $storage,
        private ActivityLogService $activityLog,
    ) {}

    public function index(Request $request)
    {
        $org = $request->user()->currentOrganization();

        $certificates = $org->certificates()
            ->with(['batch', 'template', 'blockchainRecord.merkleAnchor'])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(fn (Certificate $c) => [
                'id' => $c->id,
                'certificate_number' => $c->certificate_number,
                'recipient' => $c->recipient_data,
                'template' => $c->template?->name,
                'status' => $c->status->value,
                'verification_url' => $c->verification_url,
                'merkle_status' => $c->blockchainRecord?->merkleAnchor?->status->value,
                'issued_at' => $c->issued_at?->toIso8601String(),
            ]);

        return Inertia::render('Certificates/Index', ['certificates' => $certificates]);
    }

    public function download(Request $request, Certificate $certificate)
    {
        abort_unless($certificate->organization_id === $request->user()?->currentOrganization()?->id, 403, 'Forbidden.');

        $contents = $this->storage->get($certificate->pdf_path ?? '');
        abort_unless($contents !== null, 404, 'Certificate PDF not found.');

        $this->activityLog->log(ActivityAction::CertificateDownloaded, $certificate->organization_id, subject: $certificate, metadata: [
            'certificate_number' => $certificate->certificate_number,
        ]);

        return response()->streamDownload(
            fn () => print($contents),
            $certificate->certificate_number.'.pdf',
            ['Content-Type' => 'application/pdf'],
        );
    }
}
