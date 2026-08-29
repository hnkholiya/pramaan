import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';

export default function Organizations({ organizations }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Organizations</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Owner</th>
                                    <th className="px-5 py-3">Templates</th>
                                    <th className="px-5 py-3">Batches</th>
                                    <th className="px-5 py-3">Certs</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {organizations.data.map((o) => (
                                    <tr key={o.id}>
                                        <td className="px-5 py-3 font-medium text-slate-800">{o.name}</td>
                                        <td className="px-5 py-3 text-slate-500">{o.owner || '-'}</td>
                                        <td className="px-5 py-3">{o.templates}</td>
                                        <td className="px-5 py-3">{o.batches}</td>
                                        <td className="px-5 py-3">{o.certificates}</td>
                                        <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
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
