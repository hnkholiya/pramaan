import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';

export default function AdminCertificates({ certificates }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Certificates</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                    <th className="px-5 py-3">Certificate</th>
                                    <th className="px-5 py-3">Organization</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Issued</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {certificates.data.map((c) => (
                                    <tr key={c.id}>
                                        <td className="px-5 py-3 font-mono text-xs text-slate-700">{c.certificate_number}</td>
                                        <td className="px-5 py-3 text-slate-700">{c.organization}</td>
                                        <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                                        <td className="px-5 py-3 text-slate-500">{c.issued_at ? new Date(c.issued_at).toLocaleString() : '-'}</td>
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
