import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">
                {value ?? 0}
            </div>
            <div className="mt-1 text-sm text-slate-500">
                {label}
            </div>
        </div>
    );
}

export default function OrganizationShow({
    organization,
    recent_batches = [],
    recent_payments = [],
    recent_activity = [],
}) {
    const updateStatus = async (status) => {
        const confirmed = window.confirm(
            `Are you sure you want to ${status === 'suspended' ? 'suspend' : 'activate'} this organization?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch(
                route(
                    'admin.organizations.update-status',
                    organization.id
                ),
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        ...(token
                            ? {
                                  'X-CSRF-TOKEN': token,
                              }
                            : {}),
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Unable to update organization status.'
                );
            }

            window.location.reload();
        } catch (error) {
            window.alert(
                error?.message ||
                    'Something went wrong while updating the organization.'
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {organization.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Organization details and platform activity.
                    </p>
                </div>
            }
        >
            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* Back */}
                    <div>
                        <a
                            href={route(
                                'admin.organizations.index'
                            )}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            ← Back to Organizations
                        </a>
                    </div>

                    {/* Organization header */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {organization.name}
                                    </h1>

                                    <StatusBadge
                                        status={
                                            organization.status
                                        }
                                    />
                                </div>

                                <p className="mt-2 text-sm text-slate-500">
                                    {organization.slug}
                                </p>

                                {organization.email && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        {organization.email}
                                    </p>
                                )}

                                {organization.phone && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        {organization.phone}
                                    </p>
                                )}

                                {organization.website && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        {organization.website}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {organization.status ===
                                    'active' && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateStatus(
                                                'suspended'
                                            )
                                        }
                                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                    >
                                        Suspend Organization
                                    </button>
                                )}

                                {organization.status ===
                                    'suspended' && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateStatus(
                                                'active'
                                            )
                                        }
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                                    >
                                        Activate Organization
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Owner + stats */}
                    <div className="grid gap-4 lg:grid-cols-4">

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                            <h3 className="font-semibold text-slate-900">
                                Owner
                            </h3>

                            <div className="mt-4">
                                <p className="font-medium text-slate-800">
                                    {organization.owner?.name ||
                                        '—'}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {organization.owner?.email ||
                                        '—'}
                                </p>

                                {organization.owner?.id && (
                                    <p className="mt-3 text-xs text-slate-400">
                                        User ID:{' '}
                                        {organization.owner.id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:col-span-3 xl:grid-cols-4">
                            <StatCard
                                label="Templates"
                                value={
                                    organization.counts
                                        ?.templates
                                }
                            />

                            <StatCard
                                label="Batches"
                                value={
                                    organization.counts
                                        ?.batches
                                }
                            />

                            <StatCard
                                label="Certificates"
                                value={
                                    organization.counts
                                        ?.certificates
                                }
                            />

                            <StatCard
                                label="Payments"
                                value={
                                    organization.counts
                                        ?.payments
                                }
                            />
                        </div>
                    </div>

                    {/* Organization information */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Organization Information
                        </h3>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Email
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {organization.email ||
                                        'Not provided'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Phone
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {organization.phone ||
                                        'Not provided'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Website
                                </p>

                                <p className="mt-1 break-all text-sm text-slate-700">
                                    {organization.website ||
                                        'Not provided'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Created
                                </p>

                                <p className="mt-1 text-sm text-slate-700">
                                    {organization.created_at
                                        ? new Date(
                                              organization.created_at
                                          ).toLocaleString()
                                        : '—'}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Address
                                </p>

                                <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
                                    {organization.address ||
                                        'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recent batches */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="font-semibold text-slate-900">
                                Recent Batches
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="px-6 py-3">
                                            Batch
                                        </th>

                                        <th className="px-6 py-3">
                                            Records
                                        </th>

                                        <th className="px-6 py-3">
                                            Status
                                        </th>

                                        <th className="px-6 py-3">
                                            Blockchain
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {recent_batches.length > 0 ? (
                                        recent_batches.map(
                                            (batch) => (
                                                <tr
                                                    key={
                                                        batch.id
                                                    }
                                                    className="hover:bg-slate-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-800">
                                                            Batch #
                                                            {
                                                                batch.id
                                                            }
                                                        </div>

                                                        <div className="mt-1 text-xs text-slate-400">
                                                            {batch.source_file_name ||
                                                                '—'}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="text-slate-700">
                                                            {
                                                                batch.valid_records
                                                            }{' '}
                                                            valid
                                                        </div>

                                                        <div className="text-xs text-slate-400">
                                                            {
                                                                batch.total_records
                                                            }{' '}
                                                            total
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <StatusBadge
                                                            status={
                                                                batch.status
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="text-xs">
                                                            <StatusBadge
                                                                status={
                                                                    batch.anchor_status ||
                                                                    'pending'
                                                                }
                                                            />
                                                        </div>

                                                        {batch.transaction_hash && (
                                                            <div className="mt-2 max-w-xs truncate font-mono text-[11px] text-slate-400">
                                                                {
                                                                    batch.transaction_hash
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-10 text-center text-sm text-slate-400"
                                            >
                                                No batches found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent payments */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="font-semibold text-slate-900">
                                Recent Payments
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="px-6 py-3">
                                            Payment
                                        </th>

                                        <th className="px-6 py-3">
                                            Amount
                                        </th>

                                        <th className="px-6 py-3">
                                            Status
                                        </th>

                                        <th className="px-6 py-3">
                                            Order ID
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {recent_payments.length > 0 ? (
                                        recent_payments.map(
                                            (payment) => (
                                                <tr
                                                    key={
                                                        payment.id
                                                    }
                                                    className="hover:bg-slate-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-800">
                                                            Payment #
                                                            {
                                                                payment.id
                                                            }
                                                        </div>

                                                        <div className="mt-1 text-xs text-slate-400">
                                                            {
                                                                payment.provider
                                                            }
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 font-medium text-slate-700">
                                                        {
                                                            payment.currency
                                                        }{' '}
                                                        {
                                                            payment.amount
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <StatusBadge
                                                            status={
                                                                payment.status
                                                            }
                                                        />
                                                    </td>

                                                    <td className="max-w-xs truncate px-6 py-4 font-mono text-xs text-slate-500">
                                                        {
                                                            payment.order_id ||
                                                            '—'
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-10 text-center text-sm text-slate-400"
                                            >
                                                No payments found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="font-semibold text-slate-900">
                                Recent Activity
                            </h3>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {recent_activity.length > 0 ? (
                                recent_activity.map(
                                    (activity) => (
                                        <div
                                            key={
                                                activity.id
                                            }
                                            className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <div className="font-medium text-slate-800">
                                                    {activity.action}
                                                </div>

                                                <div className="mt-1 text-xs text-slate-400">
                                                    {activity.user
                                                        ?.email ||
                                                        'System'}
                                                </div>
                                            </div>

                                            <div className="text-xs text-slate-400">
                                                {activity.created_at
                                                    ? new Date(
                                                          activity.created_at
                                                      ).toLocaleString()
                                                    : '—'}
                                            </div>
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="px-6 py-10 text-center text-sm text-slate-400">
                                    No recent activity.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}