import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

export default function Index({ batches }) {
    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50">
                {/* ============ Page header ============ */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="flex items-center gap-2 text-sm font-medium text-blue-600">
                                    <IconLayers className="h-4 w-4" />
                                    Batch management
                                </p>
                                <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
                                    Certificate batches
                                </h1>
                                <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                                    Upload recipient data and issue certificates in bulk,
                                    then track validity and anchoring for each batch.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <Link
                                    href={route('organization.batches.create')}
                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                >
                                    <IconPlus className="h-4 w-4" />
                                    New batch
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ============ Content ============ */}
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {batches.length === 0 ? (
                        <EmptyState createHref={route('organization.batches.create')} />
                    ) : (
                        <>
                            {/* Table — sm and up */}
                            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:block">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-6 py-3.5 text-sm font-medium text-slate-500">
                                                Template
                                            </th>
                                            <th className="px-6 py-3.5 text-right text-sm font-medium text-slate-500">
                                                Total
                                            </th>
                                            <th className="px-6 py-3.5 text-right text-sm font-medium text-slate-500">
                                                Valid
                                            </th>
                                            <th className="px-6 py-3.5 text-sm font-medium text-slate-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3.5 text-sm font-medium text-slate-500">
                                                Anchor
                                            </th>
                                            <th className="px-6 py-3.5">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {batches.map((b) => (
                                            <tr
                                                key={b.id}
                                                className="group transition-colors hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                                            <IconDocument className="h-4 w-4" />
                                                        </span>
                                                        <span className="truncate text-sm font-semibold text-slate-900">
                                                            {b.template}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium tabular-nums text-slate-700">
                                                    {b.total}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium tabular-nums text-emerald-600">
                                                    {b.valid}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={b.status} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    {b.anchor_status ? (
                                                        <StatusBadge status={b.anchor_status} />
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                                                            <IconAnchorOff className="h-3.5 w-3.5" />
                                                            Not anchored
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'organization.batches.show',
                                                            b.id
                                                        )}
                                                        aria-label={`View batch for ${b.template}`}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                                    >
                                                        <IconChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Card list — mobile */}
                            <div className="flex flex-col gap-3 sm:hidden">
                                {batches.map((b) => (
                                    <Link
                                        key={b.id}
                                        href={route('organization.batches.show', b.id)}
                                        className="rounded-xl border border-slate-200 bg-white p-4 transition-colors active:bg-slate-50"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                                    <IconDocument className="h-4 w-4" />
                                                </span>
                                                <span className="truncate text-sm font-semibold text-slate-900">
                                                    {b.template}
                                                </span>
                                            </div>
                                            <IconChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" />
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <StatusBadge status={b.status} />
                                            {b.anchor_status ? (
                                                <StatusBadge status={b.anchor_status} />
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                                    <IconAnchorOff className="h-3.5 w-3.5" />
                                                    Not anchored
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                            <span>
                                                <span className="font-medium tabular-nums text-slate-900">
                                                    {b.total}
                                                </span>{' '}
                                                total
                                            </span>
                                            <span>
                                                <span className="font-medium tabular-nums text-emerald-600">
                                                    {b.valid}
                                                </span>{' '}
                                                valid
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </AuthenticatedLayout>
    );
}

/* =========================================================
   Local presentational components
   ========================================================= */

function EmptyState({ createHref }) {
    return (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                <IconLayers className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No batches yet
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                Create a batch to upload recipient data and start issuing
                certificates.
            </p>

            <div className="mt-7">
                <Link
                    href={createHref}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <IconPlus className="h-4 w-4" />
                    Create first batch
                </Link>
            </div>
        </div>
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

function IconChevronRight({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconAnchorOff({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path
                d="M12 7v14m-7-7a7 7 0 0014 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="2.5 2.5"
            />
        </svg>
    );
}