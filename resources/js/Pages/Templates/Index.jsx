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

    /*
     * Delete handler — identical behavior to the original inline handler,
     * extracted for readability only.
     */
    const handleDelete = (id) => {
        if (
            window.confirm('Delete this template? This cannot be undone.')
        ) {
            destroy(route('organization.templates.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50">
                {/* ============ Page header ============ */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                    <IconGrid className="h-4 w-4" />
                                    Template library
                                </p>
                                <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
                                    Certificate templates
                                </h1>
                                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                                    Design, version, and issue verifiable certificates for
                                    your organization.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={openAiModal}
                                    className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    <IconSparkle className="h-4 w-4" />
                                    Generate with AI
                                </button>

                                <Link
                                    href={route('organization.templates.upload')}
                                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    <IconUpload className="h-4 w-4" />
                                    Upload
                                </Link>

                                <Link
                                    href={route('organization.templates.create')}
                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    <IconPlus className="h-4 w-4" />
                                    New template
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ============ Workspace ============ */}
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {templates.length === 0 ? (
                        <EmptyState
                            onCreate={route('organization.templates.create')}
                            onUpload={route('organization.templates.upload')}
                            onGenerate={openAiModal}
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {templates.map((t) => (
                                <TemplateCard
                                    key={t.id}
                                    template={t}
                                    deleting={deleting}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* ================================
                AI GENERATOR MODAL
            ================================= */}
            {showAiModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ai-modal-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-[2px]"
                >
                    <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                        {/* Modal header */}
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-8">
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                        <IconSparkle className="h-4 w-4" />
                                    </span>
                                    <h3
                                        id="ai-modal-title"
                                        className="text-lg font-semibold text-slate-900"
                                    >
                                        Generate a certificate with AI
                                    </h3>
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    Describe the design you want. Review the preview before
                                    it becomes a template.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeAiModal}
                                disabled={generating || creatingFromAi}
                                aria-label="Close dialog"
                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                <IconClose className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="flex-1 overflow-y-auto">
                            {!aiPreview ? (
                                /* =============== PROMPT STATE =============== */
                                <form
                                    onSubmit={generateWithAi}
                                    className="space-y-5 px-6 py-6 sm:px-8"
                                >
                                    <div>
                                        <label
                                            htmlFor="ai-prompt"
                                            className="block text-sm font-medium text-slate-900"
                                        >
                                            Describe your certificate design
                                        </label>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Mention layout, colors, and the fields it should
                                            include.
                                        </p>

                                        <textarea
                                            id="ai-prompt"
                                            rows={6}
                                            value={data.prompt}
                                            onChange={(e) =>
                                                setData('prompt', e.target.value)
                                            }
                                            disabled={generating}
                                            placeholder="Example: A premium landscape certificate for a Blockchain Basics course. Dark navy and gold styling, with a prominent recipient name. Include course name, issue date, certificate number, verification URL and QR code."
                                            className="mt-3 block w-full resize-none rounded-md border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                                        />

                                        {errors.prompt && (
                                            <p className="mt-2 text-sm font-medium text-red-600">
                                                {errors.prompt}
                                            </p>
                                        )}
                                    </div>

                                    {aiError && <ErrorBanner message={aiError} />}

                                    <div className="flex gap-3 rounded-md border border-blue-100 bg-blue-50 p-4">
                                        <IconInfo className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                                        <p className="text-sm leading-relaxed text-blue-900">
                                            The AI creates a preview only — nothing is saved
                                            until you approve it. You can regenerate as many
                                            times as you like first.
                                        </p>
                                    </div>

                                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                                        <button
                                            type="button"
                                            onClick={closeAiModal}
                                            disabled={generating}
                                            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                generating || data.prompt.trim().length < 10
                                            }
                                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {generating ? (
                                                <>
                                                    <Spinner />
                                                    Generating…
                                                </>
                                            ) : (
                                                <>
                                                    <IconSparkle className="h-4 w-4" />
                                                    Generate template
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* =============== PREVIEW STATE =============== */
                                <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:px-8 lg:grid-cols-5">
                                    {/* Preview canvas */}
                                    <div className="lg:col-span-3">
                                        <p className="text-sm font-medium text-slate-900">
                                            Preview
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            This is how the certificate will look.
                                        </p>

                                        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
                                            <div className="mx-auto max-w-xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                                                <CertificateCanvas
                                                    canvasWidth={aiPreview.canvas_width}
                                                    canvasHeight={aiPreview.canvas_height}
                                                    elements={aiPreview.elements}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Metadata + actions panel */}
                                    <div className="flex flex-col gap-5 lg:col-span-2">
                                        <div className="space-y-3">
                                            <MetaRow
                                                label="Template name"
                                                value={aiPreview.name}
                                            />
                                            <MetaRow
                                                label="Canvas size"
                                                value={`${aiPreview.canvas_width} × ${aiPreview.canvas_height}`}
                                            />
                                            <MetaRow
                                                label="Elements"
                                                value={aiPreview.elements?.length || 0}
                                            />
                                        </div>

                                        {aiPreview.description && (
                                            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                                                <p className="text-xs font-medium text-slate-500">
                                                    Design notes
                                                </p>
                                                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                                                    {aiPreview.description}
                                                </p>
                                            </div>
                                        )}

                                        {aiError && <ErrorBanner message={aiError} />}

                                        <div className="mt-auto flex flex-col gap-2.5 border-t border-slate-200 pt-5">
                                            <button
                                                type="button"
                                                onClick={useAiTemplate}
                                                disabled={creatingFromAi || generating}
                                                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {creatingFromAi ? (
                                                    <>
                                                        <Spinner />
                                                        Creating…
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconCheck className="h-4 w-4" />
                                                        Use this template
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={regenerateAiTemplate}
                                                disabled={generating || creatingFromAi}
                                                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                                            >
                                                {generating ? (
                                                    <>
                                                        <Spinner dark />
                                                        Regenerating…
                                                    </>
                                                ) : (
                                                    <>
                                                        <IconRefresh className="h-4 w-4" />
                                                        Regenerate
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={backToPrompt}
                                                disabled={generating || creatingFromAi}
                                                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 disabled:opacity-50"
                                            >
                                                <IconArrowLeft className="h-4 w-4" />
                                                Back to prompt
                                            </button>
                                        </div>
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

/* =========================================================
   Local presentational components
   ========================================================= */

/*
 * Renders a template's design (canvas_width/canvas_height/elements) as a
 * proportionally scaled preview. Interprets element.position, element.size,
 * element.styles, element.config and element.type exactly as the AI preview
 * always has — values are expressed as percentages of the canvas instead of
 * a fixed pixel scale, so the same design renders correctly at any size
 * (a small card, a wide modal) without changing what the data means.
 */
function CertificateCanvas({
    canvasWidth,
    canvasHeight,
    elements,
    fill = false,
    minFontPx = 7,
}) {
    if (!canvasWidth || !canvasHeight || !elements?.length) {
        return null;
    }

    return (
        <div
            style={{
                position: fill ? 'absolute' : 'relative',
                inset: fill ? 0 : undefined,
                width: fill ? undefined : '100%',
                aspectRatio: fill ? undefined : `${canvasWidth} / ${canvasHeight}`,
                overflow: 'hidden',
                containerType: 'inline-size',
            }}
        >
            {elements.map((element) => {
                const position = element.position || { x: 0, y: 0 };
                const size = element.size || { width: 100, height: 40 };
                const styles = element.styles || {};
                const config = element.config || {};
                const alignment =
                    styles.align === 'right'
                        ? 'flex-end'
                        : styles.align === 'center'
                            ? 'center'
                            : 'flex-start';
                const fontCqw = ((styles.font_size || 16) / canvasWidth) * 100;

                return (
                    <div
                        key={element.sort_order}
                        style={{
                            position: 'absolute',
                            left: `${(position.x / canvasWidth) * 100}%`,
                            top: `${(position.y / canvasHeight) * 100}%`,
                            width: `${(size.width / canvasWidth) * 100}%`,
                            height: `${(size.height / canvasHeight) * 100}%`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: alignment,
                            color: styles.color || '#111827',
                            fontSize: `max(${minFontPx}px, ${fontCqw}cqw)`,
                            overflow: 'hidden',
                            textAlign: styles.align || 'left',
                            padding: '2px',
                        }}
                    >
                        {element.type === 'TEXT' && (
                            <span className="truncate">{config.text || ''}</span>
                        )}
                        {element.type === 'DYNAMIC_FIELD' && (
                            <span className="font-semibold">{`{{${element.data_key}}}`}</span>
                        )}
                        {element.type === 'CERTIFICATE_NUMBER' && (
                            <span className="font-medium">CERTIFICATE NUMBER</span>
                        )}
                        {element.type === 'VERIFICATION_URL' && (
                            <span className="truncate">verification.pramaan</span>
                        )}
                        {element.type === 'QR_CODE' && (
                            <div className="flex h-full w-full items-center justify-center">
                                <div className="flex h-[80%] w-[80%] items-center justify-center border-4 border-slate-800 bg-slate-50 text-[10px] font-bold text-slate-500">
                                    QR
                                </div>
                            </div>
                        )}
                        {element.type === 'IMAGE' && (
                            <div className="flex h-full w-full items-center justify-center border border-dashed border-slate-300 text-xs text-slate-400">
                                IMAGE
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function TemplateCard({ template: t, onDelete, deleting }) {
    const initials = (t.name || '?')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    const hasDesign =
        t.canvas_width && t.canvas_height && (t.elements?.length ?? 0) > 0;

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_32px_-18px_rgba(15,23,42,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-16px_rgba(15,23,42,0.2)]">
            {/* Certificate preview */}
            <div
                className="relative overflow-hidden rounded-xl bg-slate-50"
                style={{
                    aspectRatio: hasDesign
                        ? `${t.canvas_width} / ${t.canvas_height}`
                        : '3 / 2',
                }}
            >
                {hasDesign ? (
                    <CertificateCanvas
                        canvasWidth={t.canvas_width}
                        canvasHeight={t.canvas_height}
                        elements={t.elements}
                        fill
                        minFontPx={4}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="select-none text-5xl font-semibold tracking-tight text-slate-200">
                            {initials}
                        </span>
                    </div>
                )}

                <div className="absolute top-3 right-3 drop-shadow-sm">
                    <StatusBadge status={t.status} />
                </div>
            </div>

            {/* Identity + metadata */}
            <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span className="truncate font-mono">{t.slug}</span>
                    <span className="flex-shrink-0">
                        {t.versions_count} version{t.versions_count !== 1 ? 's' : ''}
                    </span>
                </div>

                <h3 className="mt-2 truncate text-lg font-semibold leading-snug text-slate-900">
                    {t.name}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <IconCheckCircle
                        className={`h-4 w-4 flex-shrink-0 ${
                            t.active_version ? 'text-emerald-500' : 'text-slate-300'
                        }`}
                    />
                    v{t.active_version || '—'} active
                </p>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1">
                        <Link
                            href={route('organization.templates.show', t.id)}
                            aria-label={`View details for ${t.name}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            <IconEye className="h-4 w-4" />
                        </Link>

                        <button
                            type="button"
                            onClick={() => onDelete(t.id)}
                            disabled={deleting}
                            aria-label={`Delete ${t.name}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                            <IconTrash className="h-4 w-4" />
                        </button>
                    </div>

                    <Link
                        href={route('organization.templates.editor', t.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                    >
                        Edit
                        <IconArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ onCreate, onUpload, onGenerate }) {
    return (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <IconGrid className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Your template library is empty
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                Build a template from scratch, upload an existing design, or
                describe one and let AI draft the first version.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                <button
                    type="button"
                    onClick={onGenerate}
                    className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                    <IconSparkle className="h-4 w-4" />
                    Generate with AI
                </button>
                <Link
                    href={onUpload}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                    <IconUpload className="h-4 w-4" />
                    Upload
                </Link>
                <Link
                    href={onCreate}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <IconPlus className="h-4 w-4" />
                    New template
                </Link>
            </div>
        </div>
    );
}

function MetaRow({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-900">{value}</span>
        </div>
    );
}

function ErrorBanner({ message }) {
    return (
        <div className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-4">
            <IconAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
            <div>
                <p className="text-sm font-medium text-red-900">Something went wrong</p>
                <p className="mt-0.5 text-sm text-red-700">{message}</p>
            </div>
        </div>
    );
}

function Spinner({ dark }) {
    return (
        <span
            className={`h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent ${
                dark ? 'border-slate-500' : 'border-white'
            }`}
        />
    );
}

/* =========================================================
   Icons — minimal, single-weight outline set
   ========================================================= */

function IconPlus({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconUpload({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconSparkle({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12 3l1.6 4.9L18.5 9.5 13.6 11.1 12 16l-1.6-4.9L5.5 9.5l4.9-1.6L12 3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M19 15l.7 2.1 2.1.7-2.1.7L19 20.6l-.7-2.1-2.1-.7 2.1-.7L19 15z" fill="currentColor" />
        </svg>
    );
}

function IconArrowRight({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M5 12h14m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconEye({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function IconTrash({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M4 7h16M9.5 7V4.8c0-.4.4-.8.9-.8h3.2c.5 0 .9.4.9.8V7m-8 0l.8 12.1a2 2 0 002 1.9h5.4a2 2 0 002-1.9L18.5 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconCheckCircle({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 12.2l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconGrid({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function IconClose({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function IconRefresh({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M4 4v5h.6M20 20v-5h-.6M4.6 9A8 8 0 0119.4 9M19.4 15a8 8 0 01-14.8 0"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconArrowLeft({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconCheck({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconInfo({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 11v5.5M12 8v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function IconAlert({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12 3.5l9.5 16.5H2.5L12 3.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M12 10v4.5M12 17v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}