import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';

export default function AdminPayments({ payments }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Payments</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                    <th className="px-5 py-3">Order</th>
                                    <th className="px-5 py-3">Organization</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3">Provider</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments.data.map((p) => (
                                    <tr key={p.id}>
                                        <td className="px-5 py-3 font-mono text-xs text-slate-700">{p.order_id}</td>
                                        <td className="px-5 py-3 text-slate-700">{p.organization}</td>
                                        <td className="px-5 py-3 font-medium text-slate-800">{p.currency} {p.amount}</td>
                                        <td className="px-5 py-3 text-slate-500">{p.provider}</td>
                                        <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
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
