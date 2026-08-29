<?php

namespace App\Http\Controllers;

use App\Enums\TemplateElementType;
use App\Http\Requests\StoreTemplateRequest;
use App\Models\DocumentTemplate;
use App\Models\TemplateElement;
use App\Services\PdfService;
use App\Services\TemplateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TemplateController extends Controller
{
    public function __construct(
        private TemplateService $service,
        private PdfService $pdf,
    ) {}

    private function owned(Request $request, DocumentTemplate $template): DocumentTemplate
    {
        abort_unless($template->organization_id === $request->user()?->currentOrganization()?->id, 403, 'Forbidden.');

        return $template;
    }

    public function index(Request $request)
    {
        $templates = $request->user()->currentOrganization()->templates()
            ->withCount(['versions'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'status' => $t->status->value,
                'versions_count' => $t->versions_count,
                'active_version' => $t->activeVersion()?->version,
                'updated_at' => $t->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('Templates/Index', ['templates' => $templates]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Templates/Create', [
            'element_types' => array_map(fn ($e) => ['value' => $e->value, 'label' => $e->label()], TemplateElementType::cases()),
        ]);
    }

    public function store(StoreTemplateRequest $request)
    {
        $org = $request->user()->currentOrganization();
        $template = $this->service->create($org, $request->validated());

        return redirect()->route('organization.templates.editor', $template)->with('success', 'Template created.');
    }

    public function show(Request $request, DocumentTemplate $template)
    {
        $this->owned($request, $template);

        return Inertia::render('Templates/Show', [
            'template' => $template->load('elements', 'versions'),
            'has_been_used' => $this->service->hasBeenUsed($template),
        ]);
    }

    public function editor(Request $request, DocumentTemplate $template)
    {
        $this->owned($request, $template);

        return Inertia::render('Templates/Editor', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'canvas_width' => $template->canvas_width,
                'canvas_height' => $template->canvas_height,
                'orientation' => $template->orientation,
                'elements' => $template->elements->map(fn ($e) => $this->elementShape($e)),
            ],
            'element_types' => array_map(fn ($e) => ['value' => $e->value, 'label' => $e->label()], TemplateElementType::cases()),
            'has_been_used' => $this->service->hasBeenUsed($template),
        ]);
    }

    public function update(Request $request, DocumentTemplate $template)
    {
        $this->owned($request, $template);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        $this->service->update($template, $data);

        return back()->with('success', 'Template updated.');
    }

    public function destroy(Request $request, DocumentTemplate $template)
    {
        $this->owned($request, $template);
        $this->service->delete($template);

        return redirect()->route('organization.templates.index')->with('success', 'Template deleted.');
    }

    public function storeElement(Request $request, DocumentTemplate $template)
    {
        $this->owned($request, $template);

        $data = $request->validate([
            'type' => ['required', 'in:TEXT,DYNAMIC_FIELD,IMAGE,CERTIFICATE_NUMBER,VERIFICATION_URL,QR_CODE'],
            'name' => ['required', 'string', 'max:255'],
            'data_key' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'array'],
            'size' => ['nullable', 'array'],
            'styles' => ['nullable', 'array'],
            'config' => ['nullable', 'array'],
        ]);

        $element = $this->service->addElement($template, $data);

        return back()->with(['element' => $this->elementShape($element)]);
    }

    public function updateElement(Request $request, DocumentTemplate $template, TemplateElement $element)
    {
        $this->owned($request, $template);
        abort_unless($element->document_template_id === $template->id, 403);

        $element = $this->service->updateElement($element, $request->all());

        return back()->with(['element' => $this->elementShape($element)]);
    }

    public function destroyElement(Request $request, DocumentTemplate $template, TemplateElement $element)
    {
        $this->owned($request, $template);
        abort_unless($element->document_template_id === $template->id, 403);

        $this->service->removeElement($element);

        return back();
    }

    public function saveLayout(Request $request, DocumentTemplate $template)
    {
        $this->owned($request, $template);

        $elements = $request->input('elements', []);
        $this->service->replaceElements($template, $elements);

        $version = $this->service->saveLayout($template);

        return back()->with('success', "Layout saved as version {$version->version}.");
    }

    public function preview(Request $request, DocumentTemplate $template): StreamedResponse
    {
        $this->owned($request, $template);
        $version = $template->activeVersion() ?? abort(422, 'Template has no active version.');

        // A throwaway certificate for preview rendering.
        $dummy = new \App\Models\Certificate([
            'certificate_number' => 'PRM-PREVIEW-0000000000',
            'verification_token' => str_repeat('0', 48),
            'recipient_data' => ['recipient_name' => 'Sample Recipient'],
        ]);

        $pdf = $this->pdf->generate($version, $dummy);

        return response()->streamDownload(fn () => print($pdf), 'preview.pdf', ['Content-Type' => 'application/pdf']);
    }

    private function elementShape(TemplateElement $e): array
    {
        return [
            'id' => $e->id,
            'type' => $e->type->value,
            'name' => $e->name,
            'data_key' => $e->data_key,
            'config' => $e->config,
            'position' => $e->position,
            'size' => $e->size,
            'styles' => $e->styles,
            'sort_order' => $e->sort_order,
        ];
    }
}
