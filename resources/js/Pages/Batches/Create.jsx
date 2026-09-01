import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ templates }) {
    const { data, setData, post, processing, errors } = useForm({
        template_id: templates[0]?.id || '',
        csv: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('organization.batches.store'));
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50">
                {/* ============ Page header ============ */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-start gap-4">
                            <Link
                                href={route('organization.batches.index')}
                                aria-label="Back to batches"
                                className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                <IconArrowLeft className="h-4.5 w-4.5" />
                            </Link>

                            <div>
                                <p className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                    <IconLayers className="h-4 w-4" />
                                    New batch
                                </p>
                                <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
                                    Upload certificate batch
                                </h1>
                                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                                    Choose a template and upload your recipient data to
                                    issue certificates in bulk.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ============ Content ============ */}
                <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                    {templates.length === 0 ? (
                        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                <IconDocument className="h-5 w-5" />
                            </span>
                            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                No templates available
                            </h3>
                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                                You need a certificate template before you can upload a
                                batch.
                            </p>
                            <div className="mt-7">
                                <Link
                                    href={route('organization.templates.create')}
                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                                >
                                    <IconPlus className="h-4 w-4" />
                                    Create a template
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <form onSubmit={submit}>
                                {/* Step 1 — Template */}
                                <section className="flex gap-4 px-6 py-7 sm:px-8">
                                    <StepMarker index={1} />
                                    <div className="min-w-0 flex-1">
                                        <InputLabel
                                            value="Certificate template"
                                            className="text-base font-semibold text-slate-900"
                                        />
                                        <p className="mt-1 text-sm text-slate-500">
                                            Select which template to use for this batch.
                                        </p>

                                        <div className="relative mt-4">
                                            <select
                                                value={data.template_id}
                                                onChange={(e) =>
                                                    setData('template_id', e.target.value)
                                                }
                                                className="w-full appearance-none rounded-md border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="">Select a template…</option>
                                                {templates.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <IconChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                        <InputError message={errors.template_id} className="mt-2" />
                                    </div>
                                </section>

                                {/* Step 2 — CSV upload */}
                                <section className="flex gap-4 border-t border-slate-100 px-6 py-7 sm:px-8">
                                    <StepMarker index={2} />
                                    <div className="min-w-0 flex-1">
                                        <InputLabel
                                            value="Recipient data"
                                            className="text-base font-semibold text-slate-900"
                                        />
                                        <p className="mt-1 text-sm text-slate-500">
                                            Upload a CSV file. The first row should contain
                                            column headers.
                                        </p>

                                        <div className="relative mt-4">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={(e) =>
                                                    setData('csv', e.target.files[0])
                                                }
                                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                            <div
                                                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                                                    data.csv
                                                        ? 'border-emerald-300 bg-emerald-50/40'
                                                        : 'border-slate-300 hover:border-blue-300 hover:bg-blue-50/40'
                                                }`}
                                            >
                                                {data.csv ? (
                                                    <div className="flex items-center justify-center gap-3">
                                                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                                                            <IconCheck className="h-4.5 w-4.5" />
                                                        </span>
                                                        <div className="text-left">
                                                            <p className="truncate text-sm font-medium text-slate-900">
                                                                {data.csv.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                Click to replace
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setData('csv', null);
                                                            }}
                                                            aria-label="Remove file"
                                                            className="relative z-10 ml-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white hover:text-red-600"
                                                        >
                                                            <IconClose className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                                                            <IconUpload className="h-5 w-5" />
                                                        </span>
                                                        <p className="mt-3 text-sm font-medium text-slate-900">
                                                            Click to upload or drag and drop
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-slate-500">
                                                            CSV files only
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <InputError message={errors.csv} className="mt-2" />

                                        <div className="mt-4 flex gap-2.5 rounded-md border border-blue-100 bg-blue-50 p-4">
                                            <IconInfo className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                                            <div className="text-sm leading-relaxed text-blue-900">
                                                <p className="font-medium">CSV format tips</p>
                                                <ul className="mt-1.5 space-y-1 text-blue-800">
                                                    <li>First row must contain column headers</li>
                                                    <li>Columns map to template fields during review</li>
                                                    <li>Common columns: name, email, date</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
                                    <Link
                                        href={route('organization.batches.index')}
                                        className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton
                                        disabled={processing || !data.csv}
                                        className="inline-flex items-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner />
                                                Uploading…
                                            </>
                                        ) : (
                                            <>
                                                <IconUpload className="h-4 w-4" />
                                                Upload &amp; create batch
                                            </>
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

/* =========================================================
   Local presentational components
   ========================================================= */

function StepMarker({ index }) {
    return (
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
            {index}
        </span>
    );
}

function Spinner() {
    return (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
    );
}

/* =========================================================
   Icons — minimal, single-weight outline set
   ========================================================= */

function IconArrowLeft({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconPlus({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconLayers({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M12 3l8.5 4.5L12 12 3.5 7.5 12 3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconDocument({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M7 3.5h7l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1v-16a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M14 3.5V8h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9 12.5h6M9 15.5h6M9 9.5h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

function IconChevronDown({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconUpload({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
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

function IconClose({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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