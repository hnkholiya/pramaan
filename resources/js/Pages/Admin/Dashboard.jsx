import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

function StatCard({
    label,
    value,
    href,
    description,
    icon,
    accent = 'indigo',
}) {
    const accentClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        blue: 'bg-blue-50 text-blue-600',
        violet: 'bg-violet-50 text-violet-600',
        red: 'bg-red-50 text-red-600',
    };

    const content = (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-slate-400">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        accentClasses[accent] || accentClasses.indigo
                    }`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );

    return href ? (
        <Link href={href} className="block">
            {content}
        </Link>
    ) : (
        content
    );
}

function SectionLink({ href, children }) {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
            {children} →
        </Link>
    );
}

export default function AdminDashboard({ stats }) {
    const confirmedPercentage =
        stats.anchors > 0
            ? Math.round(
                  (stats.confirmed_anchors / stats.anchors) * 100
              )
            : 0;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Admin Dashboard
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Monitor Pramaan platform activity and system health.
                    </p>
                </div>
            }
        >
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Page heading */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Platform Overview
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Global statistics across all Pramaan organizations.
                        </p>
                    </div>

                    {/* Primary statistics */}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            label="Organizations"
                            value={stats.organizations}
                            description="Registered organizations"
                            href={route('admin.organizations')}
                            accent="indigo"
                            icon={
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M3 21h18" />
                                    <path d="M5 21V6l7-3 7 3v15" />
                                    <path d="M9 9h1" />
                                    <path d="M14 9h1" />
                                    <path d="M9 13h1" />
                                    <path d="M14 13h1" />
                                    <path d="M10 21v-4h4v4" />
                                </svg>
                            }
                        />

                        <StatCard
                            label="Batches"
                            value={stats.batches}
                            description="Certificate issuance batches"
                            href={route('admin.batches')}
                            accent="blue"
                            icon={
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <path d="M8 8h8" />
                                    <path d="M8 12h8" />
                                    <path d="M8 16h5" />
                                </svg>
                            }
                        />

                        <StatCard
                            label="Certificates"
                            value={stats.certificates}
                            description="Issued certificate records"
                            href={route('admin.certificates')}
                            accent="violet"
                            icon={
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M6 3h9l3 3v15H6z" />
                                    <path d="M14 3v4h4" />
                                    <path d="M9 12h6" />
                                    <path d="M9 16h4" />
                                </svg>
                            }
                        />

                        <StatCard
                            label="Payments"
                            value={stats.payments}
                            description="Total payment records"
                            href={route('admin.payments')}
                            accent="emerald"
                            icon={
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <rect x="3" y="5" width="18" height="14" rx="2" />
                                    <path d="M3 10h18" />
                                    <path d="M7 15h3" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Blockchain section */}
                    <div className="mt-6 grid gap-4 md:grid-cols-3">

                        <StatCard
                            label="Blockchain Anchors"
                            value={stats.anchors}
                            description="Total Merkle anchors"
                            href={route('admin.batches')}
                            accent="amber"
                            icon={
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
                                    <path d="M12 12l8-4.5" />
                                    <path d="M12 12L4 7.5" />
                                    <path d="M12 12v9" />
                                </svg>
                            }
                        />

                        <StatCard
                            label="Confirmed Anchors"
                            value={stats.confirmed_anchors}
                            description={`${confirmedPercentage}% of all anchors confirmed`}
                            href={route('admin.batches')}
                            accent="emerald"
                            icon={
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="m8.5 12 2.3 2.3 4.7-5" />
                                </svg>
                            }
                        />

                        <StatCard
                            label="Failed Anchors"
                            value={stats.failed_anchors}
                            description="Blockchain anchors requiring attention"
                            href={route('admin.batches')}
                            accent="red"
                            icon={
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M9 9l6 6" />
                                    <path d="m15 9-6 6" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Blockchain health */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Blockchain Health
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Current status of Merkle anchor transactions.
                                </p>
                            </div>

                            <SectionLink href={route('admin.batches')}>
                                View Batches
                            </SectionLink>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Confirmation rate
                                </span>

                                <span className="font-semibold text-slate-800">
                                    {confirmedPercentage}%
                                </span>
                            </div>

                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-emerald-500 transition-all"
                                    style={{
                                        width: `${confirmedPercentage}%`,
                                    }}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                                <div>
                                    <p className="text-slate-400">
                                        Total
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-800">
                                        {stats.anchors}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400">
                                        Confirmed
                                    </p>
                                    <p className="mt-1 font-semibold text-emerald-600">
                                        {stats.confirmed_anchors}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-slate-400">
                                        Failed
                                    </p>
                                    <p className="mt-1 font-semibold text-red-600">
                                        {stats.failed_anchors}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-6 grid gap-4 md:grid-cols-3">

                        <Link
                            href={route('admin.organizations')}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <h3 className="font-semibold text-slate-900">
                                Manage Organizations
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Review organizations, owners and platform status.
                            </p>

                            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                                Open Organizations →
                            </span>
                        </Link>

                        <Link
                            href={route('admin.payments')}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <h3 className="font-semibold text-slate-900">
                                Payment Monitoring
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Review Razorpay payment records and statuses.
                            </p>

                            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                                Open Payments →
                            </span>
                        </Link>

                        <Link
                            href={route('admin.activity')}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <h3 className="font-semibold text-slate-900">
                                Activity & Audit
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Inspect recent platform and organization activity.
                            </p>

                            <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                                Open Activity →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}