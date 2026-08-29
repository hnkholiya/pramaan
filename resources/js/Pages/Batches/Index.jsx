import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

export default function Index({ batches }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Batches</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-slate-500">Upload recipient data and manage certificate issuance.</p>
                        <Link href={route('organization.batches.create')} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">+ New Batch</Link>
                    </div>

                    {batches.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-10 text-center text-slate-400 text-sm">No batches yet.</div>
                    ) : (
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                        <th className="px-5 py-3">Template</th>
                                        <th className="px-5 py-3">Records</th>
                                        <th className="px-5 py-3">Valid</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Anchor</th>
                                        <th className="px-5 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {batches.map((b) => (
                                        <tr key={b.id}>
                                            <td className="px-5 py-3 font-medium text-slate-800">{b.template}</td>
                                            <td className="px-5 py-3 text-slate-600">{b.total}</td>
                                            <td className="px-5 py-3 text-emerald-600">{b.valid}</td>
                                            <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                                            <td className="px-5 py-3">{b.anchor_status ? <StatusBadge status={b.anchor_status} /> : '-'}</td>
                                            <td className="px-5 py-3 text-right">
                                                <Link href={route('organization.batches.show', b.id)} className="text-indigo-600 hover:text-indigo-700">Open →</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
