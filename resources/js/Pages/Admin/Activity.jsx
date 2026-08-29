import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Activity({ logs }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Activity Log</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                    <th className="px-5 py-3">Action</th>
                                    <th className="px-5 py-3">Organization</th>
                                    <th className="px-5 py-3">User</th>
                                    <th className="px-5 py-3">When</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.data.map((l) => (
                                    <tr key={l.id}>
                                        <td className="px-5 py-2 font-mono text-xs text-slate-700">{l.action}</td>
                                        <td className="px-5 py-2 text-slate-600">{l.organization || '-'}</td>
                                        <td className="px-5 py-2 text-slate-500">{l.user || '-'}</td>
                                        <td className="px-5 py-2 text-slate-500 text-xs">{l.created_at ? new Date(l.created_at).toLocaleString() : '-'}</td>
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
