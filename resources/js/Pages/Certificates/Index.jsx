import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

export default function Index({ certificates }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Certificates</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                    <th className="px-5 py-3">Certificate No.</th>
                                    <th className="px-5 py-3">Recipient</th>
                                    <th className="px-5 py-3">Template</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Anchor</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {certificates.data.map((c) => (
                                    <tr key={c.id}>
                                        <td className="px-5 py-3 font-mono text-xs text-slate-700">{c.certificate_number}</td>
                                        <td className="px-5 py-3 font-medium text-slate-800">
                                            {c.recipient?.recipient_name || c.recipient?.name || '-'}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600">{c.template}</td>
                                        <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                                        <td className="px-5 py-3">{c.merkle_status ? <StatusBadge status={c.merkle_status} /> : '-'}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-3">
                                                <a href={route('organization.certificates.download', c.id)} className="text-indigo-600 hover:underline text-xs">PDF</a>
                                                <a href={c.verification_url} target="_blank" className="text-emerald-600 hover:underline text-xs">Verify</a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {certificates.last_page > 1 && (
                        <div className="mt-4 flex gap-2">
                            {Array.from({ length: certificates.last_page }, (_, i) => i + 1).map((p) => (
                                <Link key={p} href={`/organization/certificates?page=${p}`} className={`px-3 py-1 rounded-md text-sm ${p === certificates.current_page ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{p}</Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
