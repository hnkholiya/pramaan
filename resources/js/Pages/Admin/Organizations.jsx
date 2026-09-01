import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';

export default function Organizations({
    organizations,
    filters = {},
    statuses = [],
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Organizations
                </h2>
            }
        >
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Organization Management
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage registered organizations and monitor their activity.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <form
                            method="GET"
                            action={route('admin.organizations.index')}
                            className="grid gap-4 md:grid-cols-3"
                        >
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="search"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Search
                                </label>

                                <input
                                    id="search"
                                    name="search"
                                    type="text"
                                    defaultValue={filters.search || ''}
                                    placeholder="Search organization, email, slug or owner..."
                                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={filters.status || ''}
                                    className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">
                                        All statuses
                                    </option>

                                    {statuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 md:col-span-3">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Apply Filters
                                </button>

                                <a
                                    href={route(
                                        'admin.organizations.index'
                                    )}
                                    className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Clear
                                </a>
                            </div>
                        </form>
                    </div>

                    {/* Organizations Table */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="px-5 py-4">
                                            Organization
                                        </th>

                                        <th className="px-5 py-4">
                                            Owner
                                        </th>

                                        <th className="px-5 py-4 text-center">
                                            Templates
                                        </th>

                                        <th className="px-5 py-4 text-center">
                                            Batches
                                        </th>

                                        <th className="px-5 py-4 text-center">
                                            Certificates
                                        </th>

                                        <th className="px-5 py-4">
                                            Status
                                        </th>

                                        <th className="px-5 py-4">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {organizations.data?.length > 0 ? (
                                        organizations.data.map((organization) => (
                                            <tr
                                                key={organization.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <div>
                                                        <div className="font-semibold text-slate-900">
                                                            {organization.name}
                                                        </div>

                                                        <div className="mt-1 text-xs text-slate-400">
                                                            {organization.slug}
                                                        </div>

                                                        {organization.email && (
                                                            <div className="mt-1 text-xs text-slate-500">
                                                                {organization.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div>
                                                        <div className="font-medium text-slate-700">
                                                            {organization.owner?.name ||
                                                                '—'}
                                                        </div>

                                                        <div className="mt-1 text-xs text-slate-400">
                                                            {organization.owner?.email ||
                                                                '—'}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-center font-medium text-slate-700">
                                                    {organization.templates ?? 0}
                                                </td>

                                                <td className="px-5 py-4 text-center font-medium text-slate-700">
                                                    {organization.batches ?? 0}
                                                </td>

                                                <td className="px-5 py-4 text-center font-medium text-slate-700">
                                                    {organization.certificates ?? 0}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <StatusBadge
                                                        status={
                                                            organization.status
                                                        }
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <a
                                                        href={route(
                                                            'admin.organizations.show',
                                                            organization.id
                                                        )}
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                                    >
                                                        View →
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-5 py-12 text-center text-sm text-slate-400"
                                            >
                                                No organizations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {organizations.links &&
                            organizations.links.length > 3 && (
                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                                    <div className="text-xs text-slate-500">
                                        Showing{' '}
                                        <span className="font-medium">
                                            {organizations.from ?? 0}
                                        </span>{' '}
                                        to{' '}
                                        <span className="font-medium">
                                            {organizations.to ?? 0}
                                        </span>{' '}
                                        of{' '}
                                        <span className="font-medium">
                                            {organizations.total ?? 0}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {organizations.links.map(
                                            (link, index) => (
                                                <span key={index}>
                                                    {link.url ? (
                                                        <a
                                                            href={link.url}
                                                            className={`inline-flex min-w-9 items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium ${
                                                                link.active
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="inline-flex min-w-9 items-center justify-center rounded-md px-3 py-1.5 text-xs text-slate-300"
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    )}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}