import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import { useState } from 'react';

export default function Index({ templates }) {
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiPreview, setAiPreview] = useState(null);
    const [aiError, setAiError] = useState('');
    const [generating, setGenerating] = useState(false);
    const [creatingFromAi, setCreatingFromAi] = useState(false);

    /*
     * Existing template actions still use Inertia.
     */
    const {
        delete: destroy,
        processing: deleting,
    } = useForm();

    /*
     * AI prompt state.
     */
    const {
        data,
        setData,
        errors,
        reset,
    } = useForm({
        prompt: '',
    });

    const openAiModal = () => {
        setAiError('');
        setAiPreview(null);
        reset();
        setShowAiModal(true);
    };

    const closeAiModal = () => {
        if (generating || creatingFromAi) {
            return;
        }

        setAiError('');
        setAiPreview(null);
        reset();
        setShowAiModal(false);
    };

    /*
     * Generate a new AI template preview.
     * IMPORTANT: this does NOT create a database template.
     */
    const generateWithAi = async (e) => {
        e.preventDefault();

        const prompt = data.prompt.trim();

        if (prompt.length < 10) {
            setAiError(
                'Please describe the certificate design in at least 10 characters.'
            );
            return;
        }

        setGenerating(true);
        setAiError('');
        setAiPreview(null);

        try {
            const response = await fetch(
                route('organization.templates.generate-ai'),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        prompt,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Unable to generate the template.'
                );
            }

            if (!result.template) {
                throw new Error(
                    'The AI response did not contain a template.'
                );
            }

            setAiPreview(result.template);
        } catch (error) {
            setAiError(
                error?.message ||
                'AI template generation failed.'
            );
        } finally {
            setGenerating(false);
        }
    };

    /*
     * Regenerate the preview using the same prompt.
     */
    const regenerateAiTemplate = async () => {
        if (generating || creatingFromAi) {
            return;
        }

        const prompt = data.prompt.trim();

        if (prompt.length < 10) {
            setAiError(
                'Please provide a valid certificate description.'
            );
            return;
        }

        setGenerating(true);
        setAiError('');
        setAiPreview(null);

        try {
            const response = await fetch(
                route('organization.templates.generate-ai'),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        prompt,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Unable to regenerate the template.'
                );
            }

            if (!result.template) {
                throw new Error(
                    'The AI response did not contain a template.'
                );
            }

            setAiPreview(result.template);
        } catch (error) {
            setAiError(
                error?.message ||
                'AI template regeneration failed.'
            );
        } finally {
            setGenerating(false);
        }
    };

    /*
     * Approve the preview and create the real database template.
     */
    const useAiTemplate = async () => {
        if (!aiPreview || creatingFromAi || generating) {
            return;
        }

        setCreatingFromAi(true);
        setAiError('');

        try {
            const response = await fetch(
                route('organization.templates.create-from-ai'),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        template: aiPreview,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Unable to create the template.'
                );
            }

            if (!result.redirect_url) {
                throw new Error(
                    'Template created, but no editor URL was returned.'
                );
            }

            window.location.href = result.redirect_url;
        } catch (error) {
            setAiError(
                error?.message ||
                'Unable to create the template.'
            );
        } finally {
            setCreatingFromAi(false);
        }
    };

    const backToPrompt = () => {
        if (generating || creatingFromAi) {
            return;
        }

        setAiPreview(null);
        setAiError('');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Certificate Templates
                </h2>
            }
        >
            <div className="py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                    {/* Page Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            Design reusable certificate layouts with versioning.
                        </p>

                        <div className="flex flex-wrap gap-2">

                            <button
                                type="button"
                                onClick={openAiModal}
                                className="inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                            >
                                ✨ Generate with AI
                            </button>

                            <Link
                                href={route('organization.templates.create')}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                + New Template
                            </Link>

                            <Link
                                href={route('organization.templates.upload')}
                                className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Upload Template
                            </Link>
                        </div>
                    </div>

                    {/* Template List */}
                    {templates.length === 0 ? (
                        <div className="rounded-xl bg-white p-10 text-center text-sm text-slate-400 shadow">
                            No templates yet. Create your first certificate template.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {templates.map((t) => (
                                <div
                                    key={t.id}
                                    className="rounded-xl border border-slate-100 bg-white p-5 shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {t.name}
                                            </h3>

                                            <p className="text-xs text-slate-400">
                                                {t.slug}
                                            </p>
                                        </div>

                                        <StatusBadge status={t.status} />
                                    </div>

                                    <div className="mt-3 text-sm text-slate-500">
                                        {t.versions_count} version(s)
                                        {' · '}
                                        active v{t.active_version || '—'}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Link
                                            href={route(
                                                'organization.templates.editor',
                                                t.id
                                            )}
                                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                                        >
                                            Edit
                                        </Link>

                                        <Link
                                            href={route(
                                                'organization.templates.show',
                                                t.id
                                            )}
                                            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            Details
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.confirm(
                                                    'Delete this template?'
                                                ) &&
                                                destroy(
                                                    route(
                                                        'organization.templates.destroy',
                                                        t.id
                                                    )
                                                )
                                            }
                                            disabled={deleting}
                                            className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================================
                AI GENERATOR MODAL
            ================================= */}
            {showAiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

                    <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    ✨ Generate Certificate with AI
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Describe the certificate design you want.
                                    Gemini will generate a preview first.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeAiModal}
                                disabled={
                                    generating ||
                                    creatingFromAi
                                }
                                className="text-2xl leading-none text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto">

                            {!aiPreview ? (
                                /* =================================
                                   PROMPT STATE
                                ================================== */
                                <form
                                    onSubmit={generateWithAi}
                                    className="px-6 py-6"
                                >
                                    <label
                                        htmlFor="ai-prompt"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Describe your certificate
                                    </label>

                                    <textarea
                                        id="ai-prompt"
                                        rows={7}
                                        value={data.prompt}
                                        onChange={(e) =>
                                            setData(
                                                'prompt',
                                                e.target.value
                                            )
                                        }
                                        disabled={generating}
                                        placeholder="Example: Create a premium landscape certificate for a Blockchain Basics course. Use a dark navy and gold style. Make the recipient name prominent. Include course, issue date, certificate number, verification URL and QR code."
                                        className="mt-2 block w-full rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 disabled:bg-slate-100"
                                    />

                                    {errors.prompt && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.prompt}
                                        </p>
                                    )}

                                    {aiError && (
                                        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                            {aiError}
                                        </div>
                                    )}

                                    <div className="mt-4 rounded-lg bg-violet-50 p-4 text-sm text-violet-900">
                                        <p className="font-medium">
                                            What AI will do
                                        </p>

                                        <p className="mt-1">
                                            Gemini will generate a structured
                                            certificate layout using your
                                            organization's existing template
                                            system. The template will not be
                                            saved until you approve it.
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={closeAiModal}
                                            disabled={generating}
                                            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                generating ||
                                                data.prompt.trim().length < 10
                                            }
                                            className="inline-flex items-center rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {generating ? (
                                                <>
                                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Generating...
                                                </>
                                            ) : (
                                                '✨ Generate Template'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* =================================
                                   PREVIEW STATE
                                ================================== */
                                <div className="space-y-6 px-6 py-6">

                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900">
                                            AI Template Preview
                                        </h4>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Review the generated design before
                                            creating the actual template.
                                        </p>
                                    </div>

                                    {/* Template Meta */}
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                                            <p className="text-xs text-slate-400">
                                                Template
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {aiPreview.name}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                                            <p className="text-xs text-slate-400">
                                                Canvas
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {aiPreview.canvas_width}
                                                {' × '}
                                                {aiPreview.canvas_height}
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                                            <p className="text-xs text-slate-400">
                                                Elements
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {aiPreview.elements?.length || 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Preview Canvas */}
                                    <div className="rounded-xl border border-slate-200 bg-slate-100 p-5">
                                        <div
                                            className="relative mx-auto overflow-hidden rounded-lg bg-white shadow-lg"
                                            style={{
                                                aspectRatio:
                                                    `${aiPreview.canvas_width} / ${aiPreview.canvas_height}`,
                                                width: '100%',
                                                maxWidth: '760px',
                                            }}
                                        >
                                            {aiPreview.elements.map(
                                                (element) => {
                                                    const position =
                                                        element.position || {
                                                            x: 0,
                                                            y: 0,
                                                        };

                                                    const size =
                                                        element.size || {
                                                            width: 100,
                                                            height: 40,
                                                        };

                                                    const styles =
                                                        element.styles || {};

                                                    const config =
                                                        element.config || {};

                                                    /*
                                                     * The canvas is rendered
                                                     * proportionally at max 760px.
                                                     */
                                                    const scale =
                                                        760 /
                                                        aiPreview.canvas_width;

                                                    const alignment =
                                                        styles.align === 'right'
                                                            ? 'flex-end'
                                                            : styles.align === 'center'
                                                                ? 'center'
                                                                : 'flex-start';

                                                    return (
                                                        <div
                                                            key={
                                                                element.sort_order
                                                            }
                                                            className="absolute"
                                                            style={{
                                                                left:
                                                                    `${position.x * scale}px`,
                                                                top:
                                                                    `${position.y * scale}px`,
                                                                width:
                                                                    `${size.width * scale}px`,
                                                                height:
                                                                    `${size.height * scale}px`,
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                justifyContent:
                                                                    alignment,
                                                                color:
                                                                    styles.color ||
                                                                    '#111827',
                                                                fontSize:
                                                                    `${Math.max(
                                                                        7,
                                                                        (styles.font_size || 16) *
                                                                        scale
                                                                    )}px`,
                                                                overflow:
                                                                    'hidden',
                                                                textAlign:
                                                                    styles.align ||
                                                                    'left',
                                                                padding: '2px',
                                                            }}
                                                        >
                                                            {element.type ===
                                                                'TEXT' && (
                                                                    <span className="truncate">
                                                                        {config.text ||
                                                                            ''}
                                                                    </span>
                                                                )}

                                                            {element.type ===
                                                                'DYNAMIC_FIELD' && (
                                                                    <span className="font-semibold">
                                                                        {`{{${element.data_key}}}`}
                                                                    </span>
                                                                )}

                                                            {element.type ===
                                                                'CERTIFICATE_NUMBER' && (
                                                                    <span className="font-medium">
                                                                        CERTIFICATE
                                                                        NUMBER
                                                                    </span>
                                                                )}

                                                            {element.type ===
                                                                'VERIFICATION_URL' && (
                                                                    <span className="truncate">
                                                                        verification.pramaan
                                                                    </span>
                                                                )}

                                                            {element.type ===
                                                                'QR_CODE' && (
                                                                    <div className="flex h-full w-full items-center justify-center">
                                                                        <div className="flex h-[80%] w-[80%] items-center justify-center border-4 border-slate-800 bg-slate-50 text-[10px] font-bold text-slate-500">
                                                                            QR
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {element.type ===
                                                                'IMAGE' && (
                                                                    <div className="flex h-full w-full items-center justify-center border border-dashed border-slate-300 text-xs text-slate-400">
                                                                        IMAGE
                                                                    </div>
                                                                )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {aiPreview.description && (
                                        <div className="rounded-lg bg-slate-50 p-4">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Design Description
                                            </p>

                                            <p className="mt-1 text-sm text-slate-600">
                                                {aiPreview.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {aiError && (
                                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                            {aiError}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">

                                        <button
                                            type="button"
                                            onClick={backToPrompt}
                                            disabled={
                                                generating ||
                                                creatingFromAi
                                            }
                                            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="button"
                                            onClick={regenerateAiTemplate}
                                            disabled={
                                                generating ||
                                                creatingFromAi
                                            }
                                            className="inline-flex items-center rounded-md border border-violet-300 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50 disabled:opacity-50"
                                        >
                                            {generating ? (
                                                <>
                                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
                                                    Regenerating...
                                                </>
                                            ) : (
                                                '↻ Regenerate'
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={useAiTemplate}
                                            disabled={
                                                creatingFromAi ||
                                                generating
                                            }
                                            className="inline-flex items-center rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {creatingFromAi ? (
                                                <>
                                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Creating...
                                                </>
                                            ) : (
                                                '✓ Use This Template'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}