
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

const STEPS = [
    { key: 'uploaded', label: 'Upload', icon: 'upload' },
    { key: 'validated', label: 'Validate', icon: 'check' },
    { key: 'mapped', label: 'Map Fields', icon: 'map' },
    { key: 'quoted', label: 'Quote', icon: 'quote' },
    { key: 'paid', label: 'Payment', icon: 'card' },
    { key: 'generated', label: 'Generate', icon: 'certificate' },
    { key: 'anchored', label: 'Blockchain Anchor', icon: 'link' },
];

/*
 * These are frontend workflow positions only.
 * They do not change or replace backend status values.
 */
const STEP_INDEX = {
    uploaded: 0,
    validated: 1,
    mapped: 2,
    quoted: 3,
    paid: 4,
    generated: 5,
    anchored: 6,
};

function normalizeStatus(status) {
    return String(status || '').trim().toLowerCase();
}

function isGenerationProcessing(status) {
    const s = normalizeStatus(status);
    return s === 'processing' || s === 'generating';
}

function isGenerationCompleted(status) {
    return normalizeStatus(status) === 'completed';
}

/*
 * Only explicitly recognizable successful anchor states are treated
 * as confirmed. An unknown/non-empty status is never assumed to be
 * successful.
 */
function getAnchorState(anchorStatus, transactionHash) {
    const status = normalizeStatus(anchorStatus);

    const confirmed =
        Boolean(transactionHash) &&
        (
            status === 'success' ||
            status === 'successful' ||
            status === 'confirmed' ||
            status === 'complete' ||
            status === 'completed' ||
            status === 'anchored'
        );

    if (confirmed) return 'confirmed';

    if (
        status === 'processing' ||
        status === 'process' ||
        status === 'pending' ||
        status === 'in_progress' ||
        status === 'in-progress'
    ) {
        return 'processing';
    }

    if (
        status === 'failed' ||
        status === 'failure' ||
        status === 'error' ||
        status === 'failed_anchor' ||
        status === 'anchor_failed'
    ) {
        return 'failed';
    }

    return 'pending';
}

/* ----------------------------- Icon set ----------------------------- */
/* Hand-drawn, single-weight line icons kept consistent at 1.75 stroke */

function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.75 }) {
    const common = {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
    };

    switch (name) {
        case 'upload':
            return (
                <svg {...common}>
                    <path d="M12 15V4" />
                    <path d="M7.5 8.5 12 4l4.5 4.5" />
                    <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
                </svg>
            );

        case 'check':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M8.5 12.2 11 14.7l4.5-5.4" />
                </svg>
            );

        case 'map':
            return (
                <svg {...common}>
                    <rect x="3.5" y="4.5" width="6" height="15" rx="1.5" />
                    <rect x="14.5" y="4.5" width="6" height="15" rx="1.5" />
                    <path d="M9.5 9.5h5" />
                    <path d="M9.5 14.5h5" />
                    <path d="M13 7.7 15.3 9.5 13 11.3" />
                </svg>
            );

        case 'quote':
            return (
                <svg {...common}>
                    <path d="M6 3.5h12v16l-3-2-3 2-3-2-3 2z" />
                    <path d="M8.5 8h7" />
                    <path d="M8.5 11.5h7" />
                    <path d="M8.5 15h4" />
                </svg>
            );

        case 'card':
            return (
                <svg {...common}>
                    <rect x="3" y="5.5" width="18" height="13" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M7 14.5h4" />
                </svg>
            );

        case 'certificate':
            return (
                <svg {...common}>
                    <circle cx="12" cy="8.5" r="5" />
                    <path d="M9 12.8 8 20l4-2 4 2-1-7.2" />
                    <path d="M9.7 8.5 11.2 10l3-3" />
                </svg>
            );

        case 'link':
            return (
                <svg {...common}>
                    <path d="M9.5 14.5 14.5 9.5" />
                    <path d="M8 16 5.6 13.6a3.6 3.6 0 0 1 0-5.1L8 6a3.6 3.6 0 0 1 5.1 0" />
                    <path d="M16 8l2.4 2.4a3.6 3.6 0 0 1 0 5.1L16 18a3.6 3.6 0 0 1-5.1 0" />
                </svg>
            );

        case 'download':
            return (
                <svg {...common}>
                    <path d="M12 4v11" />
                    <path d="M7.5 11.5 12 16l4.5-4.5" />
                    <path d="M4.5 16.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
                </svg>
            );

        case 'alert':
            return (
                <svg {...common}>
                    <path d="M10.6 4.3a1.6 1.6 0 0 1 2.8 0l8 14.3a1.6 1.6 0 0 1-1.4 2.4H4a1.6 1.6 0 0 1-1.4-2.4z" />
                    <path d="M12 9.5v4.2" />
                    <circle cx="12" cy="17" r="0.15" fill="currentColor" />
                </svg>
            );

        case 'x-circle':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M9.3 9.3l5.4 5.4" />
                    <path d="M14.7 9.3l-5.4 5.4" />
                </svg>
            );

        case 'clock':
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7.5V12l3 2" />
                </svg>
            );

        case 'external':
            return (
                <svg {...common}>
                    <path d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
                    <path d="M14 4h6v6" />
                    <path d="M20 4 11 13" />
                </svg>
            );

        case 'copy':
            return (
                <svg {...common}>
                    <rect x="8.5" y="8.5" width="11" height="11" rx="1.8" />
                    <path d="M5.5 15V6a1.8 1.8 0 0 1 1.8-1.8H15" />
                </svg>
            );

        case 'shield':
            return (
                <svg {...common}>
                    <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6z" />
                    <path d="M9 12.2 11.2 14.4 15.4 10" />
                </svg>
            );

        case 'file':
            return (
                <svg {...common}>
                    <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5z" />
                    <path d="M14 3.5V8h4" />
                    <path d="M9 12.5h6" />
                    <path d="M9 15.5h6" />
                </svg>
            );

        default:
            return null;
    }
}

/* --------------------------- Button styles --------------------------- */

const btnPrimary =
    'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';

const btnEmerald =
    'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-700 active:scale-[0.98]';

/* ------------------------------ Component ----------------------------- */

export default function Show({ batch, records, dynamic_fields, payment_mode }) {
    const [mapping, setMapping] = useState(batch.mapping || {});
    const [copied, setCopied] = useState('');
    const mapForm = useForm({ mapping });
    const { post: postAction, processing } = useForm({});

    const batchStatus = normalizeStatus(batch.status);
    const generationProcessing = isGenerationProcessing(batch.status);
    const generationCompleted = isGenerationCompleted(batch.status);

    const anchorState = getAnchorState(
        batch.anchor_status,
        batch.transaction_hash
    );

    /*
     * The anchor can only be considered completed when BOTH:
     * 1. the backend anchor status explicitly represents a confirmed state
     * 2. a transaction hash exists
     *
     * Generate and Anchor remain independent.
     */
    const anchorCompleted = anchorState === 'confirmed';

    const go = (url, opts = {}) =>
        postAction(url, { ...opts, preserveScroll: true });

    const saveMapping = () => {
        mapForm.data.mapping = mapping;
        mapForm.post(route('organization.batches.map', batch.id), {
            preserveScroll: true,
        });
    };

    const copyToClipboard = (label, value) => {
        if (
            !value ||
            typeof navigator === 'undefined' ||
            !navigator.clipboard
        ) {
            return;
        }

        navigator.clipboard.writeText(value).then(() => {
            setCopied(label);
            setTimeout(() => setCopied(''), 1500);
        });
    };

    /*
     * Determine the visual state of each workflow step from existing
     * backend-provided data. No timers or simulated states are used.
     */
    const getStepState = (key) => {
        switch (key) {
            case 'uploaded':
                if (batchStatus === 'draft') return 'pending';
                return 'completed';

            case 'validated':
                if (
                    ['draft', 'uploaded'].includes(batchStatus)
                ) {
                    return batchStatus === 'uploaded'
                        ? 'current'
                        : 'pending';
                }

                if (
                    ['validated', 'mapped', 'quoted', 'payment_pending', 'paid', 'processing', 'completed'].includes(
                        batchStatus
                    )
                ) {
                    return 'completed';
                }

                return 'pending';

            case 'mapped':
                if (batchStatus === 'validated') return 'current';

                if (
                    ['mapped', 'quoted', 'payment_pending', 'paid', 'processing', 'completed'].includes(
                        batchStatus
                    )
                ) {
                    return 'completed';
                }

                return 'pending';

            case 'quoted':
                if (batchStatus === 'mapped') return 'current';

                if (
                    ['quoted', 'payment_pending', 'paid', 'processing', 'completed'].includes(
                        batchStatus
                    )
                ) {
                    return 'completed';
                }

                return 'pending';

            case 'paid':
                if (
                    batchStatus === 'quoted' ||
                    batchStatus === 'payment_pending'
                ) {
                    return 'current';
                }

                if (
                    ['paid', 'processing', 'completed'].includes(batchStatus)
                ) {
                    return 'completed';
                }

                return 'pending';

            case 'generated':
                if (generationProcessing) return 'current';

                if (generationCompleted) return 'completed';

                return 'pending';

            case 'anchored':
                if (anchorCompleted) return 'completed';

                if (anchorState === 'processing') return 'current';

                if (anchorState === 'failed') return 'failed';

                return 'pending';

            default:
                return 'pending';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2.5">
                    <img src="/pramaan.svg" alt="" className="h-5 w-5" />
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                        Batch #{batch.id}
                    </h2>
                </div>
            }
        >
            <div
                className="py-8"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, sans-serif",
                }}
            >
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* ---------------------------------------------------------- Header */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
                        <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    <img
                                        src="/pramaan.svg"
                                        alt="Pramaan"
                                        className="h-3.5 w-3.5 opacity-70"
                                    />
                                    Certificate batch
                                </div>

                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <span className="text-xl font-semibold tracking-tight text-slate-900">
                                        {batch.template}
                                    </span>
                                    <span className="text-sm text-slate-400">
                                        v{batch.template_version}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-sm">
                                    <span className="text-slate-500">
                                        <span className="font-semibold tabular-nums text-slate-800">
                                            {batch.total}
                                        </span>{' '}
                                        records
                                    </span>

                                    <span className="flex items-center gap-1.5 text-emerald-600">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        {batch.valid} valid
                                    </span>

                                    {batch.invalid > 0 && (
                                        <span className="flex items-center gap-1.5 text-red-500">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                            {batch.invalid} invalid
                                        </span>
                                    )}
                                </div>
                            </div>

                            <StatusBadge status={batch.status} />
                        </div>

                        {batch.invalid > 0 &&
                            !['paid', 'processing', 'completed'].includes(
                                batchStatus
                            ) && (
                                <div className="flex items-start gap-2.5 border-t border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-800 sm:px-6">
                                    <Icon
                                        name="alert"
                                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                                    />
                                    <p>
                                        {batch.invalid} record
                                        {batch.invalid === 1 ? '' : 's'} failed
                                        validation and will be excluded from
                                        issuance. Review the records list below.
                                    </p>
                                </div>
                            )}
                    </div>

                    {/* ------------------------------------------------------- Stepper */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
                        <div className="flex min-w-0 items-start overflow-x-auto pb-1">
                            {STEPS.map((s, i) => {
                                const state = getStepState(s.key);
                                const last = i === STEPS.length - 1;

                                const circleClass = {
                                    completed:
                                        'border-emerald-500 bg-emerald-500 text-white',
                                    current:
                                        'border-slate-900 bg-slate-900 text-white',
                                    pending:
                                        'border-slate-200 bg-white text-slate-300',
                                    failed:
                                        'border-red-500 bg-red-50 text-red-500',
                                }[state];

                                const labelClass = {
                                    completed: 'text-emerald-600',
                                    current: 'text-slate-900',
                                    pending: 'text-slate-400',
                                    failed: 'text-red-600',
                                }[state];

                                /*
                                 * A connector is complete only when the step
                                 * on its left is completed. A current/failed
                                 * operation never paints the connector as
                                 * completed.
                                 */
                                const connectorClass =
                                    state === 'completed'
                                        ? 'bg-emerald-400'
                                        : 'bg-slate-200';

                                return (
                                    <div
                                        key={s.key}
                                        className={`flex items-center ${
                                            last
                                                ? ''
                                                : 'min-w-[100px] flex-1'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-2 px-1">
                                            <div
                                                className={[
                                                    'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
                                                    circleClass,
                                                ].join(' ')}
                                            >
                                                {state === 'completed' && (
                                                    <Icon
                                                        name="check"
                                                        className="h-4 w-4"
                                                    />
                                                )}

                                                {state === 'current' && (
                                                    <>
                                                        <span className="absolute inset-[-3px] animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
                                                        <Icon
                                                            name={s.icon}
                                                            className="h-4 w-4"
                                                        />
                                                    </>
                                                )}

                                                {state === 'pending' && (
                                                    <Icon
                                                        name={s.icon}
                                                        className="h-4 w-4"
                                                    />
                                                )}

                                                {state === 'failed' && (
                                                    <Icon
                                                        name="x-circle"
                                                        className="h-4 w-4"
                                                    />
                                                )}
                                            </div>

                                            <span
                                                className={[
                                                    'whitespace-nowrap text-xs font-medium',
                                                    labelClass,
                                                ].join(' ')}
                                            >
                                                {s.label}
                                            </span>

                                            {state === 'current' && (
                                                <span className="sr-only">
                                                    Currently in progress
                                                </span>
                                            )}

                                            {state === 'failed' && (
                                                <span className="sr-only">
                                                    Failed
                                                </span>
                                            )}
                                        </div>

                                        {!last && (
                                            <div
                                                className={`mx-1 mt-[-18px] h-px flex-1 transition-colors duration-200 ${connectorClass}`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* -------------------------------------------------- Workflow */}
                        <div className="space-y-4 lg:col-span-1">
                            {/* Validate */}
                            {batchStatus === 'uploaded' && (
                                <ActionCard
                                    icon="check"
                                    title="Validate records"
                                    desc="Check every row for missing required values and invalid emails or dates."
                                >
                                    <button
                                        onClick={() =>
                                            go(
                                                route(
                                                    'organization.batches.validate',
                                                    batch.id
                                                )
                                            )
                                        }
                                        disabled={processing}
                                        className={btnPrimary}
                                    >
                                        Run validation
                                    </button>
                                </ActionCard>
                            )}

                            {/* Map */}
                            {(batchStatus === 'validated' ||
                                batchStatus === 'mapped') && (
                                <ActionCard
                                    icon="map"
                                    title="Field mapping"
                                    desc="Map CSV columns to template fields."
                                >
                                    {dynamic_fields.length > 0 ? (
                                        <div className="space-y-3">
                                            {dynamic_fields.map((f) => (
                                                <div
                                                    key={f.data_key}
                                                    className="space-y-1"
                                                >
                                                    <label className="text-xs font-medium text-slate-500">
                                                        {f.name}
                                                    </label>

                                                    <select
                                                        value={
                                                            mapping[
                                                                f.data_key
                                                            ] || ''
                                                        }
                                                        onChange={(e) =>
                                                            setMapping({
                                                                ...mapping,
                                                                [f.data_key]:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full rounded-lg border-slate-200 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:ring-slate-400"
                                                    >
                                                        <option value="">
                                                            Select CSV column
                                                        </option>

                                                        {batch.headers.map(
                                                            (h) => (
                                                                <option
                                                                    key={h}
                                                                    value={h}
                                                                >
                                                                    {h}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            ))}

                                            <button
                                                onClick={saveMapping}
                                                disabled={
                                                    mapForm.processing
                                                }
                                                className={`${btnPrimary} mt-1`}
                                            >
                                                Save mapping
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            This template has no dynamic fields
                                            to map.
                                        </p>
                                    )}
                                </ActionCard>
                            )}

                            {/* Quote */}
                            {(batchStatus === 'mapped' ||
                                batchStatus === 'quoted') && (
                                <ActionCard
                                    icon="quote"
                                    title="Price quote"
                                >
                                    {batch.quote ? (
                                        <div className="space-y-2 text-sm">
                                            <Row
                                                k="Certificates"
                                                v={
                                                    batch.quote
                                                        .certificate_count
                                                }
                                            />

                                            <Row
                                                k="Price / certificate"
                                                v={`${batch.quote.currency} ${batch.quote.price_per_certificate}`}
                                            />

                                            <Row
                                                k="Subtotal"
                                                v={`${batch.quote.currency} ${batch.quote.subtotal}`}
                                            />

                                            <Row
                                                k={`Tax (${batch.quote.tax_rate}%)`}
                                                v={`${batch.quote.currency} ${batch.quote.tax}`}
                                            />

                                            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                                                <span className="text-sm font-medium text-slate-800">
                                                    Total
                                                </span>

                                                <span className="text-base font-semibold tabular-nums text-slate-900">
                                                    {batch.quote.currency}{' '}
                                                    {batch.quote.total}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                go(
                                                    route(
                                                        'organization.batches.quote',
                                                        batch.id
                                                    )
                                                )
                                            }
                                            disabled={processing}
                                            className={btnPrimary}
                                        >
                                            Generate quote
                                        </button>
                                    )}
                                </ActionCard>
                            )}

                            {/* Pay */}
                            {(batchStatus === 'quoted' ||
                                batchStatus === 'payment_pending') && (
                                <ActionCard icon="card" title="Payment">
                                    <p className="mb-3 flex items-start gap-2 text-xs text-slate-500">
                                        <Icon
                                            name="alert"
                                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400"
                                        />

                                        {payment_mode === 'mock'
                                            ? 'Mock payment provider active — payment will be simulated.'
                                            : 'You will be redirected to Razorpay checkout.'}
                                    </p>

                                    <button
                                        onClick={() =>
                                            go(
                                                route(
                                                    'organization.batches.pay',
                                                    batch.id
                                                )
                                            )
                                        }
                                        disabled={processing}
                                        className={btnPrimary}
                                    >
                                        Pay{' '}
                                        {batch.quote
                                            ? `${batch.quote.currency} ${batch.quote.total}`
                                            : ''}
                                    </button>
                                </ActionCard>
                            )}

                            {/* Generate */}
                            {batchStatus === 'paid' && (
                                <ActionCard
                                    icon="certificate"
                                    title="Generate certificates"
                                >
                                    <button
                                        onClick={() =>
                                            go(
                                                route(
                                                    'organization.batches.generate',
                                                    batch.id
                                                )
                                            )
                                        }
                                        disabled={processing}
                                        className={btnPrimary}
                                    >
                                        Generate PDF certificates
                                    </button>
                                </ActionCard>
                            )}

                            {/* Processing */}
                            {generationProcessing && (
                                <ActionCard
                                    icon="clock"
                                    title="Generating certificates"
                                >
                                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3.5 py-3">
                                        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />

                                        <p className="text-sm text-slate-500">
                                            This can take a few minutes for
                                            larger batches.
                                        </p>
                                    </div>
                                </ActionCard>
                            )}

                            {/* Anchor */}
                            {generationCompleted &&
                                !batch.anchor_status && (
                                    <ActionCard
                                        icon="link"
                                        title="Blockchain anchor"
                                        desc="Seal this batch's certificate records with an immutable, verifiable anchor."
                                    >
                                        <button
                                            onClick={() =>
                                                go(
                                                    route(
                                                        'organization.batches.anchor',
                                                        batch.id
                                                    )
                                                )
                                            }
                                            disabled={processing}
                                            className={btnPrimary}
                                        >
                                            Anchor to blockchain
                                        </button>
                                    </ActionCard>
                                )}

                            {/* Anchor result */}
                            {batch.anchor_status && (
                                <ActionCard
                                    icon="link"
                                    title="Blockchain anchor"
                                >
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {anchorState === 'confirmed' && (
                                                <Icon
                                                    name="shield"
                                                    className="h-4 w-4 text-emerald-500"
                                                />
                                            )}

                                            {anchorState === 'processing' && (
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
                                            )}

                                            {anchorState === 'failed' && (
                                                <Icon
                                                    name="x-circle"
                                                    className="h-4 w-4 text-red-500"
                                                />
                                            )}

                                            {anchorState === 'pending' && (
                                                <Icon
                                                    name="clock"
                                                    className="h-4 w-4 text-slate-400"
                                                />
                                            )}

                                            <StatusBadge
                                                status={batch.anchor_status}
                                            />

                                            {anchorState === 'processing' && (
                                                <span className="text-xs font-medium text-amber-600">
                                                    Anchoring in progress
                                                </span>
                                            )}

                                            {anchorState === 'failed' && (
                                                <span className="text-xs font-medium text-red-600">
                                                    Anchoring failed
                                                </span>
                                            )}

                                            {anchorState === 'confirmed' && (
                                                <span className="text-xs font-medium text-emerald-600">
                                                    Anchor confirmed
                                                </span>
                                            )}
                                        </div>

                                        {batch.anchor_root && (
                                            <HashRow
                                                label="Root"
                                                value={batch.anchor_root}
                                                copied={copied === 'root'}
                                                onCopy={() =>
                                                    copyToClipboard(
                                                        'root',
                                                        batch.anchor_root
                                                    )
                                                }
                                            />
                                        )}

                                        {batch.transaction_hash && (
                                            <HashRow
                                                label="Transaction"
                                                value={batch.transaction_hash}
                                                copied={copied === 'tx'}
                                                onCopy={() =>
                                                    copyToClipboard(
                                                        'tx',
                                                        batch.transaction_hash
                                                    )
                                                }
                                                action={
                                                    anchorState ===
                                                    'confirmed' ? (
                                                       <a
    href={`https://sepolia.arbiscan.io/tx/${encodeURIComponent(
        batch.transaction_hash
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/40 hover:text-slate-950 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2"
>
    <Icon
        name="external"
        className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600"
    />
    <span>View on Arbiscan</span>
</a>
                                                    ) : null
                                                }
                                            />
                                        )}

                                        {anchorState === 'processing' &&
                                            !batch.transaction_hash && (
                                                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                                                    <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
                                                    <span>
                                                        Waiting for blockchain
                                                        confirmation.
                                                    </span>
                                                </div>
                                            )}

                                        {anchorState === 'failed' && (
                                            <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700">
                                                <Icon
                                                    name="alert"
                                                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                                />
                                                <span>
                                                    The blockchain anchor did
                                                    not complete successfully.
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </ActionCard>
                            )}

                            {/* Download all certificates */}
                            {generationCompleted && batch.valid > 0 && (
                                <ActionCard
                                    icon="download"
                                    title="Download certificates"
                                    desc={`Download all ${batch.valid} issued certificates as a single ZIP file.`}
                                >
                                    <a
                                        href={route(
                                            'organization.batches.download-zip',
                                            batch.id
                                        )}
                                        className={btnEmerald}
                                    >
                                        <Icon
                                            name="download"
                                            className="h-4 w-4"
                                        />
                                        Download all ({batch.valid})
                                    </a>
                                </ActionCard>
                            )}

                            {generationCompleted &&
                                anchorCompleted && (
                                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                        <Icon
                                            name="shield"
                                            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                                        />

                                        <div>
                                            <p className="text-sm font-medium text-emerald-900">
                                                Batch issued and anchored
                                            </p>

                                            <p className="mt-0.5 text-xs text-emerald-700">
                                                Every certificate is verifiable
                                                via its QR code and the anchored
                                                root hash.
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* --------------------------------------------------- Records */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 lg:col-span-2">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                                    <Icon
                                        name="file"
                                        className="h-4 w-4 text-slate-400"
                                    />

                                    Records

                                    <span className="font-normal text-slate-400">
                                        ({records.length})
                                    </span>
                                </h3>
                            </div>

                            {/* Desktop / tablet table */}
                            <div className="hidden overflow-x-auto sm:block">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                                            <th className="w-12 px-5 py-2.5">
                                                #
                                            </th>
                                            <th className="px-5 py-2.5">
                                                Recipient
                                            </th>
                                            <th className="px-5 py-2.5">
                                                Status
                                            </th>
                                            <th className="px-5 py-2.5">
                                                Certificate
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-50">
                                        {records.map((r) => (
                                            <RecordRow
                                                key={r.id}
                                                record={r}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile list */}
                            <div className="divide-y divide-slate-50 sm:hidden">
                                {records.map((r) => {
                                    const first = Object.entries(
                                        r.data || {}
                                    )[0];

                                    return (
                                        <div
                                            key={r.id}
                                            className="space-y-2 px-5 py-3.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400">
                                                    Row {r.row}
                                                </span>

                                                <StatusBadge
                                                    status={r.status}
                                                />
                                            </div>

                                            <p className="text-sm font-medium text-slate-800">
                                                {first ? first[1] : '—'}
                                            </p>

                                            {r.errors &&
                                                r.errors.length > 0 && (
                                                    <p className="flex items-start gap-1.5 text-xs text-red-600">
                                                        <Icon
                                                            name="alert"
                                                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                                        />
                                                        {r.errors
                                                            .slice(0, 2)
                                                            .join(' · ')}
                                                    </p>
                                                )}

                                            {r.certificate && (
                                                <a
                                                    href={`/verify/${r.certificate.token}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
                                                >
                                                    {r.certificate.number}
                                                    <Icon
                                                        name="external"
                                                        className="h-3 w-3"
                                                    />
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {records.length === 0 && (
                                <div className="px-5 py-10 text-center text-sm text-slate-400">
                                    No records in this batch.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* ------------------------------ Subcomponents ------------------------------ */

function ActionCard({ icon, title, desc, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
            <div className="mb-1 flex items-center gap-2.5">
                {icon && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                        <Icon name={icon} className="h-4 w-4" />
                    </span>
                )}

                <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>

            {desc && (
                <p className="text-xs leading-relaxed text-slate-500">
                    {desc}
                </p>
            )}

            <div className="mt-3.5">{children}</div>
        </div>
    );
}

function Row({ k, v }) {
    return (
        <div className="flex justify-between">
            <span className="text-slate-500">{k}</span>
            <span className="font-medium tabular-nums text-slate-700">
                {v}
            </span>
        </div>
    );
}

function RecordRow({ record: r }) {
    const first = Object.entries(r.data || {})[0];

    return (
        <tr className="transition-colors hover:bg-slate-50/60">
            <td className="px-5 py-3 text-slate-400 tabular-nums">
                {r.row}
            </td>

            <td className="px-5 py-3">
                <span className="font-medium text-slate-700">
                    {first ? first[1] : '—'}
                </span>

                {r.errors && r.errors.length > 0 && (
                    <div className="mt-0.5 flex items-start gap-1.5 text-xs text-red-600">
                        <Icon
                            name="alert"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        />
                        {r.errors.slice(0, 2).join(' · ')}
                    </div>
                )}
            </td>

            <td className="px-5 py-3">
                <StatusBadge status={r.status} />
            </td>

            <td className="px-5 py-3">
                {r.certificate ? (
                    <a
                        href={`/verify/${r.certificate.token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                    >
                        {r.certificate.number}

                        <Icon
                            name="external"
                            className="h-3 w-3"
                        />
                    </a>
                ) : (
                    <span className="text-xs text-slate-300">—</span>
                )}
            </td>
        </tr>
    );
}

function HashRow({ label, value, onCopy, copied, action }) {
    return (
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="space-y-2">
                <span className="block text-xs font-medium text-slate-400">
                    {label}
                </span>

                <p className="break-all font-mono text-xs leading-relaxed text-slate-600">
                    {value}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {action}

                    <button
                        onClick={onCopy}
                        className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1"
                    >
                        <Icon
                            name="copy"
                            className="h-3.5 w-3.5 shrink-0"
                        />
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
}
