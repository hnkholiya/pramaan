import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

/* -------------------------------------------------------------------------- */
/*  Icons — inline SVGs, stroke-width 2, matching the icon language used      */
/*  across the rest of Pramaan (marketing site, verify page, dashboard).      */
/* -------------------------------------------------------------------------- */

function BuildingIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 21V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15" />
            <path d="M14 10h5a1 1 0 0 1 1 1v10" />
            <path d="M9 9h.01M9 13h.01M9 17h.01" />
            <path d="M4 21h16" />
        </svg>
    );
}

function TagIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12.5 3.5 7 7a1.5 1.5 0 0 1 0 2.12l-6.38 6.38a1.5 1.5 0 0 1-2.12 0l-7-7A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5h6a1.5 1.5 0 0 1 1.5 0Z" />
            <path d="M8 8h.01" />
        </svg>
    );
}

function MailIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 6 8.5 7 8.5-7" />
        </svg>
    );
}

function PhoneIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.22c1.1.4 2.3.62 3.5.62a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.4a1 1 0 0 1 1 1c0 1.2.22 2.4.62 3.5a1 1 0 0 1-.22 1.1L6.6 10.8Z" />
        </svg>
    );
}

function GlobeIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9Z" />
        </svg>
    );
}

function MapPinIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function ShieldCheckIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3.5 19 6.2v5.2c0 4.2-2.7 7.6-7 9.1-4.3-1.5-7-4.9-7-9.1V6.2L12 3.5Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function ArrowLeftIcon({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
        </svg>
    );
}

function ExternalLinkIcon({ className = 'h-3.5 w-3.5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" />
        </svg>
    );
}

/* Icon lookup keyed by the exact field label, plus a status badge color map. */
/* Both are purely presentational — they don't change what data is shown.     */
const FIELD_ICON = {
    Name: BuildingIcon,
    Slug: TagIcon,
    Email: MailIcon,
    Phone: PhoneIcon,
    Website: GlobeIcon,
    Address: MapPinIcon,
    Status: ShieldCheckIcon,
};

const STATUS_STYLES = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    suspended: 'bg-red-50 text-red-700 border-red-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

function statusStyle(value) {
    const key = String(value || '').toLowerCase();
    return STATUS_STYLES[key] || 'bg-slate-100 text-slate-600 border-slate-200';
}

function initials(name) {
    if (!name) return 'PR';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
}

export default function Show({ organization }) {
    const fields = [
        ['Name', organization.name],
        ['Slug', organization.slug],
        ['Email', organization.email || '-'],
        ['Phone', organization.phone || '-'],
        ['Website', organization.website || '-'],
        ['Address', organization.address || '-'],
        ['Status', organization.status?.label || organization.status],
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <img src="/pramaan.svg" alt="" className="h-6 w-6 object-contain" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            Organization
                        </p>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {organization.name}
                        </h2>
                    </div>
                </div>
            }
        >
            <div
                className="min-h-[calc(100vh-4rem)] bg-slate-50/60 py-8"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

                    {/* Identity card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="relative bg-slate-950 px-6 py-8 sm:px-8">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                                    backgroundSize: '32px 32px',
                                }}
                            />
                            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-lg font-bold text-white shadow-sm backdrop-blur-sm">
                                    {initials(organization.name)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                                        {organization.name}
                                    </h1>
                                    <p className="mt-1 font-mono text-xs text-slate-400">
                                        /{organization.slug}
                                    </p>
                                </div>
                                {(organization.status?.label || organization.status) && (
                                    <span
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                                    >
                                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                                        {organization.status?.label || organization.status}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Field grid */}
                        <div className="px-6 py-2 sm:px-8">
                            <dl className="divide-y divide-slate-100">
                                {fields.map(([k, v]) => {
                                    const Icon = FIELD_ICON[k] || BuildingIcon;
                                    const isEmpty = v === '-' || v === null || v === undefined || v === '';

                                    let valueNode = <span className="text-slate-800">{v}</span>;

                                    if (isEmpty) {
                                        valueNode = <span className="text-slate-300">Not provided</span>;
                                    } else if (k === 'Email') {
                                        valueNode = (
                                            <a href={`mailto:${v}`} className="text-indigo-600 hover:text-indigo-700 hover:underline">
                                                {v}
                                            </a>
                                        );
                                    } else if (k === 'Phone') {
                                        valueNode = (
                                            <a href={`tel:${v}`} className="text-indigo-600 hover:text-indigo-700 hover:underline">
                                                {v}
                                            </a>
                                        );
                                    } else if (k === 'Website') {
                                        const href = /^https?:\/\//i.test(v) ? v : `https://${v}`;
                                        valueNode = (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:underline"
                                            >
                                                {v}
                                                <ExternalLinkIcon className="h-3 w-3" />
                                            </a>
                                        );
                                    } else if (k === 'Slug') {
                                        valueNode = <span className="font-mono text-xs text-slate-600">{v}</span>;
                                    } else if (k === 'Status') {
                                        valueNode = (
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${statusStyle(v)}`}>
                                                {v}
                                            </span>
                                        );
                                    }

                                    return (
                                        <div key={k} className="flex items-center justify-between gap-4 py-4">
                                            <dt className="flex items-center gap-2.5 text-sm text-slate-500">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                                    <Icon className="h-3.5 w-3.5" />
                                                </span>
                                                {k}
                                            </dt>
                                            <dd className="text-right text-sm font-medium">{valueNode}</dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:px-8">
                            <p className="text-[11px] text-slate-400">
                                This information is managed by your organization's administrators.
                            </p>
                            <Link
                                href={route('dashboard')}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/60 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                <ArrowLeftIcon className="h-3.5 w-3.5" />
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}