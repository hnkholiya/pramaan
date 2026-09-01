import { Fragment, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

/* ----------------------------- Icon set ----------------------------- */
/* Hand-drawn, single-weight line icons — kept consistent with the rest */
/* of the Pramaan console (see Batches/Show.jsx).                       */

function Icon({ name, className = 'w-4 h-4', strokeWidth = 1.75 }) {
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
        case 'certificate':
            return (
                <svg {...common}>
                    <circle cx="12" cy="8.5" r="5" />
                    <path d="M9 12.8 8 20l4-2 4 2-1-7.2" />
                    <path d="M9.7 8.5 11.2 10l3-3" />
                </svg>
            );
        case 'user':
            return (
                <svg {...common}>
                    <circle cx="12" cy="8.2" r="3.4" />
                    <path d="M5.5 19.5c1-3.2 3.6-5 6.5-5s5.5 1.8 6.5 5" />
                </svg>
            );
        case 'template':
            return (
                <svg {...common}>
                    <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5z" />
                    <path d="M14 3.5V8h4" />
                    <path d="M9 12.5h6" />
                    <path d="M9 15.5h6" />
                </svg>
            );
        case 'shield':
            return (
                <svg {...common}>
                    <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6z" />
                    <path d="M9 12.2 11.2 14.4 15.4 10" />
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
        case 'external':
            return (
                <svg {...common}>
                    <path d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
                    <path d="M14 4h6v6" />
                    <path d="M20 4 11 13" />
                </svg>
            );
        case 'chevron-left':
            return (
                <svg {...common}>
                    <path d="M14.5 5.5 8 12l6.5 6.5" />
                </svg>
            );
        case 'chevron-right':
            return (
                <svg {...common}>
                    <path d="M9.5 5.5 16 12l-6.5 6.5" />
                </svg>
            );
        case 'chevron-down':
            return (
                <svg {...common}>
                    <path d="M5.5 9.5 12 16l6.5-6.5" />
                </svg>
            );
        case 'layers':
            return (
                <svg {...common}>
                    <path d="M12 3.5 4 8l8 4.5L20 8z" />
                    <path d="M4 12.5 12 17l8-4.5" />
                    <path d="M4 16.5 12 21l8-4.5" />
                </svg>
            );
        default:
            return null;
    }
}

/* --------------------------- Helper logic --------------------------- */

function initials(name) {
    if (!name) return '—';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function recipientName(c) {
    return c.recipient?.recipient_name || c.recipient?.name || '—';
}

/**
 * Reads batch info off a certificate using whatever shape the backend
 * already provides — either an eager-loaded `batch` relation or a bare
 * `batch_id`. Returns null when neither is present, so the UI can fall
 * back to today's flat list without inventing anything.
 */
function getBatchInfo(c) {
    if (c.batch && c.batch.id !== undefined && c.batch.id !== null) {
        const versioned = c.batch.template
            ? `${c.batch.template}${c.batch.template_version ? ` · v${c.batch.template_version}` : ''}`
            : `Batch #${c.batch.id}`;
        return { id: c.batch.id, label: versioned, status: c.batch.status };
    }
    if (c.batch_id !== undefined && c.batch_id !== null) {
        return { id: c.batch_id, label: `Batch #${c.batch_id}`, status: undefined };
    }
    return null;
}

function paginationRange(current, last) {
    const delta = 1;
    const range = [];
    const withDots = [];
    let l;

    for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }
    range.forEach((i) => {
        if (l) {
            if (i - l === 2) withDots.push(l + 1);
            else if (i - l > 2) withDots.push('…');
        }
        withDots.push(i);
        l = i;
    });
    return withDots;
}

const BATCH_GRID = 'grid-cols-[190px_150px_minmax(160px,1fr)_120px_120px_150px]';

/* ------------------------------ Component ------------------------------ */

export default function Index({ certificates }) {
    const rows = certificates.data;
    const isPaginated = certificates.last_page > 1;

    // Only present the batch column/interaction when the data we already
    // have actually carries batch info. Otherwise render exactly the
    // original flat list.
    const hasBatchData = useMemo(() => rows.some((c) => getBatchInfo(c)), [rows]);

    const certsByBatch = useMemo(() => {
        const map = new Map();
        rows.forEach((c) => {
            const b = getBatchInfo(c);
            if (!b) return;
            if (!map.has(b.id)) map.set(b.id, []);
            map.get(b.id).push(c);
        });
        return map;
    }, [rows]);

    const [expanded, setExpanded] = useState(() => new Set());
    const toggleBatch = (id) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2.5">
                    <img src="/pramaan.svg" alt="" className="h-5 w-5" />
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">Issued certificates</h2>
                </div>
            }
        >
            <div className="py-8" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* ----------------------------------------------------------- Header */}
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                <img src="/pramaan.svg" alt="Pramaan" className="h-3.5 w-3.5 opacity-70" />
                                Certificate library
                            </div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Issued certificates</h1>
                            <p className="text-sm text-slate-500">
                                {hasBatchData
                                    ? "View, verify, and download certificates, grouped by the batch they were issued from."
                                    : "View, verify, and download every certificate you've issued."}
                            </p>
                        </div>
                        {certificates.total !== undefined && (
                            <div className="text-sm text-slate-500">
                                <span className="font-semibold tabular-nums text-slate-800">{certificates.total}</span> total
                            </div>
                        )}
                    </div>

                    {/* ----------------------------------------------------------- Empty */}
                    {rows.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm shadow-slate-200/60">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                <Icon name="certificate" className="h-6 w-6" />
                            </span>
                            <h3 className="text-base font-semibold text-slate-800">No certificates yet</h3>
                            <p className="max-w-sm text-sm text-slate-500">
                                Certificates will appear here once a batch finishes processing and issuance completes.
                            </p>
                        </div>
                    ) : hasBatchData ? (
                        <BatchGroupedList rows={rows} certsByBatch={certsByBatch} expanded={expanded} onToggleBatch={toggleBatch} />
                    ) : (
                        <FlatList rows={rows} />
                    )}

                    {/* ------------------------------------------------------ Pagination */}
                    {isPaginated && (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm text-slate-500">
                                Page <span className="font-medium tabular-nums text-slate-700">{certificates.current_page}</span> of{' '}
                                <span className="font-medium tabular-nums text-slate-700">{certificates.last_page}</span>
                            </p>
                            <nav className="flex items-center gap-1">
                                <PageLink page={certificates.current_page - 1} disabled={certificates.current_page <= 1} aria-label="Previous page">
                                    <Icon name="chevron-left" className="h-4 w-4" />
                                </PageLink>

                                {paginationRange(certificates.current_page, certificates.last_page).map((p, i) =>
                                    p === '…' ? (
                                        <span key={`dots-${i}`} className="px-1.5 text-sm text-slate-300">
                                            …
                                        </span>
                                    ) : (
                                        <PageLink key={p} page={p} active={p === certificates.current_page}>
                                            {p}
                                        </PageLink>
                                    )
                                )}

                                <PageLink
                                    page={certificates.current_page + 1}
                                    disabled={certificates.current_page >= certificates.last_page}
                                    aria-label="Next page"
                                >
                                    <Icon name="chevron-right" className="h-4 w-4" />
                                </PageLink>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* ============================================================ */
/*  Batch-grouped presentation (used when batch data is present) */
/* ============================================================ */

function BatchGroupedList({ rows, certsByBatch, expanded, onToggleBatch }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
            {/* Desktop column header */}
            <div className={`hidden md:grid ${BATCH_GRID} gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-400`}>
                <span className="flex items-center gap-1.5">
                    <Icon name="layers" className="h-3.5 w-3.5" />
                    Batch
                </span>
                <span className="flex items-center gap-1.5">
                    <Icon name="certificate" className="h-3.5 w-3.5" />
                    Certificate no.
                </span>
                <span className="flex items-center gap-1.5">
                    <Icon name="user" className="h-3.5 w-3.5" />
                    Recipient
                </span>
                <span className="flex items-center gap-1.5">
                    <Icon name="shield" className="h-3.5 w-3.5" />
                    Status
                </span>
                <span className="flex items-center gap-1.5">
                    <Icon name="link" className="h-3.5 w-3.5" />
                    Anchor
                </span>
                <span className="text-right">Actions</span>
            </div>

            {/* Desktop rows */}
            <div className="hidden divide-y divide-slate-50 md:block">
                {renderWithPanels(rows, certsByBatch, expanded, onToggleBatch, 'desktop')}
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-50 md:hidden">
                {renderWithPanels(rows, certsByBatch, expanded, onToggleBatch, 'mobile')}
            </div>
        </div>
    );
}

/**
 * Walks the flat certificate list once, rendering each row and — right
 * after the first row belonging to a given batch — an expand/collapse
 * panel listing every recipient in that batch found on this page.
 * Avoids re-rendering the same panel for every row that shares a batch.
 */
function renderWithPanels(rows, certsByBatch, expanded, onToggleBatch, variant) {
    const seen = new Set();
    return rows.map((c) => {
        const batch = getBatchInfo(c);
        const isFirstOfBatch = batch && !seen.has(batch.id);
        if (batch) seen.add(batch.id);
        const isOpen = batch && expanded.has(batch.id);

        return (
            <Fragment key={c.id}>
                {variant === 'desktop' ? (
                    <BatchRowDesktop c={c} batch={batch} isOpen={isOpen} onToggleBatch={onToggleBatch} />
                ) : (
                    <BatchRowMobile c={c} batch={batch} isOpen={isOpen} onToggleBatch={onToggleBatch} />
                )}
                {isFirstOfBatch && <BatchPanel open={isOpen} batch={batch} certs={certsByBatch.get(batch.id) || []} />}
            </Fragment>
        );
    });
}

function BatchPill({ batch, isOpen, onToggleBatch }) {
    if (!batch) return <span className="text-sm text-slate-300">—</span>;
    return (
        <button
            type="button"
            onClick={() => onToggleBatch(batch.id)}
            aria-expanded={isOpen}
            className={[
                'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-150',
                isOpen ? 'border-slate-300 bg-slate-100 text-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
            ].join(' ')}
        >
            <Icon name="layers" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{batch.label}</span>
            <Icon name="chevron-down" className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
    );
}

function BatchRowDesktop({ c, batch, isOpen, onToggleBatch }) {
    const name = recipientName(c);
    return (
        <div className={`grid ${BATCH_GRID} items-center gap-3 px-6 py-3.5 text-sm transition-colors hover:bg-slate-50/60`}>
            <div className="min-w-0">
                <BatchPill batch={batch} isOpen={isOpen} onToggleBatch={onToggleBatch} />
            </div>
            <div>
                <code className="rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">{c.certificate_number}</code>
            </div>
            <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
                    {initials(name)}
                </span>
                <span className="truncate font-medium text-slate-800">{name}</span>
            </div>
            <div>
                <StatusBadge status={c.status} />
            </div>
            <div>{c.merkle_status ? <StatusBadge status={c.merkle_status} /> : <span className="text-sm text-slate-300">—</span>}</div>
            <div className="flex items-center justify-end gap-1.5">
                <CertActions c={c} />
            </div>
        </div>
    );
}

function BatchRowMobile({ c, batch, isOpen, onToggleBatch }) {
    const name = recipientName(c);
    return (
        <div className="space-y-3 px-5 py-4">
            <BatchPill batch={batch} isOpen={isOpen} onToggleBatch={onToggleBatch} />
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        {initials(name)}
                    </span>
                    <p className="text-sm font-medium text-slate-800">{name}</p>
                </div>
                <StatusBadge status={c.status} />
            </div>
            <code className="block w-fit rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">{c.certificate_number}</code>
            <div className="flex items-center justify-between gap-3 pt-1">
                <div>{c.merkle_status ? <StatusBadge status={c.merkle_status} /> : <span className="text-xs text-slate-300">Not anchored</span>}</div>
                <div className="flex items-center gap-1.5">
                    <CertActions c={c} />
                </div>
            </div>
        </div>
    );
}

function BatchPanel({ open, batch, certs }) {
    return (
        <div className={`grid transition-all duration-200 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
                <div className="border-y border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Icon name="user" className="h-3.5 w-3.5" />
                        {certs.length} recipient{certs.length === 1 ? '' : 's'} in {batch.label} on this page
                    </p>
                    <div className="space-y-1.5">
                        {certs.map((rc) => (
                            <div key={rc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-500">
                                        {initials(recipientName(rc))}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-slate-700">{recipientName(rc)}</p>
                                        <code className="font-mono text-[11px] text-slate-400">{rc.certificate_number}</code>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <StatusBadge status={rc.status} />
                                    <CertActions c={rc} compact />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================================================== */
/*  Flat presentation (used when no batch data exists) */
/* ================================================== */

function FlatList({ rows }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
            {/* Desktop / tablet table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                            <th className="px-6 py-3">
                                <span className="flex items-center gap-1.5">
                                    <Icon name="certificate" className="h-3.5 w-3.5" />
                                    Certificate no.
                                </span>
                            </th>
                            <th className="px-6 py-3">
                                <span className="flex items-center gap-1.5">
                                    <Icon name="user" className="h-3.5 w-3.5" />
                                    Recipient
                                </span>
                            </th>
                            <th className="px-6 py-3">
                                <span className="flex items-center gap-1.5">
                                    <Icon name="template" className="h-3.5 w-3.5" />
                                    Template
                                </span>
                            </th>
                            <th className="px-6 py-3">
                                <span className="flex items-center gap-1.5">
                                    <Icon name="shield" className="h-3.5 w-3.5" />
                                    Status
                                </span>
                            </th>
                            <th className="px-6 py-3">
                                <span className="flex items-center gap-1.5">
                                    <Icon name="link" className="h-3.5 w-3.5" />
                                    Anchor
                                </span>
                            </th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {rows.map((c) => (
                            <CertificateRow key={c.id} c={c} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile list */}
            <div className="divide-y divide-slate-50 md:hidden">
                {rows.map((c) => (
                    <CertificateCard key={c.id} c={c} />
                ))}
            </div>
        </div>
    );
}

function CertificateRow({ c }) {
    const name = recipientName(c);
    return (
        <tr className="transition-colors hover:bg-slate-50/60">
            <td className="px-6 py-3.5">
                <code className="rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">{c.certificate_number}</code>
            </td>
            <td className="px-6 py-3.5">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
                        {initials(name)}
                    </span>
                    <span className="font-medium text-slate-800">{name}</span>
                </div>
            </td>
            <td className="px-6 py-3.5 text-slate-600">{c.template}</td>
            <td className="px-6 py-3.5">
                <StatusBadge status={c.status} />
            </td>
            <td className="px-6 py-3.5">
                {c.merkle_status ? <StatusBadge status={c.merkle_status} /> : <span className="text-sm text-slate-300">—</span>}
            </td>
            <td className="px-6 py-3.5">
                <div className="flex items-center justify-end gap-1.5">
                    <CertActions c={c} />
                </div>
            </td>
        </tr>
    );
}

function CertificateCard({ c }) {
    const name = recipientName(c);
    return (
        <div className="space-y-3 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        {initials(name)}
                    </span>
                    <div>
                        <p className="text-sm font-medium text-slate-800">{name}</p>
                        <p className="text-xs text-slate-400">{c.template}</p>
                    </div>
                </div>
                <StatusBadge status={c.status} />
            </div>

            <code className="block w-fit rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">{c.certificate_number}</code>

            <div className="flex items-center justify-between gap-3 pt-1">
                <div>{c.merkle_status ? <StatusBadge status={c.merkle_status} /> : <span className="text-xs text-slate-300">Not anchored</span>}</div>
                <div className="flex items-center gap-1.5">
                    <CertActions c={c} />
                </div>
            </div>
        </div>
    );
}

/* ------------------------------ Shared bits ------------------------------ */

function CertActions({ c, compact = false }) {
    return (
        <>
            <a
                href={route('organization.certificates.download', c.id)}
                title="Download PDF"
                className={[
                    'inline-flex items-center gap-1.5 rounded-lg text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900',
                    compact ? 'p-1.5' : 'px-2.5 py-1.5',
                ].join(' ')}
            >
                <Icon name="download" className="h-3.5 w-3.5" />
                {!compact && 'PDF'}
            </a>
            <a
                href={c.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Verify certificate"
                className={[
                    'inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100',
                    compact ? 'p-1.5' : 'px-2.5 py-1.5',
                ].join(' ')}
            >
                <Icon name="external" className="h-3.5 w-3.5" />
                {!compact && 'Verify'}
            </a>
        </>
    );
}

function PageLink({ page, active, disabled, children, ...rest }) {
    if (disabled) {
        return <span className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium text-slate-300">{children}</span>;
    }
    return (
        <Link
            href={`/organization/certificates?page=${page}`}
            className={[
                'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors duration-150',
                active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
            ].join(' ')}
            {...rest}
        >
            {children}
        </Link>
    );
}