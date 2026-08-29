import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

export default function Dashboard({ organization, stats, recent_batches }) {
    const cards = [
        { label: 'Templates', value: stats.templates, href: route('organization.templates.index') },
        { label: 'Batches', value: stats.batches, href: route('organization.batches.index') },
        { label: 'Certificates', value: stats.certificates, href: route('organization.certificates.index') },
        { label: 'Pending Payments', value: stats.pending_payments, href: route('organization.payments.index') },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{organization.name}</h2>}>
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((c) => (
                            <Link key={c.label} href={c.href} className="bg-white rounded-xl shadow p-5 border border-slate-100 hover:border-indigo-200">
                                <div className="text-3xl font-extrabold text-slate-900">{c.value}</div>
                                <div className="text-sm text-slate-500 mt-1">{c.label}</div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800">Recent Batches</h3>
                            <Link href={route('organization.batches.create')} className="text-sm text-indigo-600 hover:text-indigo-700">New Batch +</Link>
                        </div>
                        {recent_batches.length === 0 ? (
                            <div className="px-6 py-10 text-center text-sm text-slate-400">
                                No batches yet. <Link href={route('organization.templates.create')} className="text-indigo-600">Create a template</Link> to get started.
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-3">Template</th>
                                        <th className="px-6 py-3">Valid</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Anchor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recent_batches.map((b) => (
                                        <tr key={b.id}>
                                            <td className="px-6 py-3 font-medium text-slate-800">{b.template}</td>
                                            <td className="px-6 py-3 text-slate-600">{b.valid}</td>
                                            <td className="px-6 py-3"><StatusBadge status={b.status} /></td>
                                            <td className="px-6 py-3">{b.anchor ? <StatusBadge status={b.anchor} /> : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
