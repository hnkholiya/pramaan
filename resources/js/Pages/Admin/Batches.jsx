import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';

export default function AdminBatches({ batches }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Batches</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                    <th className="px-5 py-3">ID</th>
                                    <th className="px-5 py-3">Organization</th>
                                    <th className="px-5 py-3">Template</th>
                                    <th className="px-5 py-3">Valid</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Anchor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {batches.data.map((b) => (
                                    <tr key={b.id}>
                                        <td className="px-5 py-3 text-slate-400">#{b.id}</td>
                                        <td className="px-5 py-3 text-slate-700">{b.organization}</td>
                                        <td className="px-5 py-3 text-slate-600">{b.template}</td>
                                        <td className="px-5 py-3 text-emerald-600">{b.valid}</td>
                                        <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                                        <td className="px-5 py-3">{b.anchor ? <StatusBadge status={b.anchor} /> : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
