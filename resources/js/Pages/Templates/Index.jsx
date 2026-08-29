import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

export default function Index({ templates }) {
    const { delete: destroy, processing } = useForm();

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Certificate Templates</h2>}>
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-slate-500">Design reusable certificate layouts with versioning.</p>
                        <Link href={route('organization.templates.create')} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">+ New Template</Link>
                    </div>

                    {templates.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-10 text-center text-slate-400 text-sm">
                            No templates yet. Create your first certificate template.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {templates.map((t) => (
                                <div key={t.id} className="bg-white rounded-xl shadow p-5 border border-slate-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{t.name}</h3>
                                            <p className="text-xs text-slate-400">{t.slug}</p>
                                        </div>
                                        <StatusBadge status={t.status} />
                                    </div>
                                    <div className="mt-3 text-sm text-slate-500">
                                        {t.versions_count} version(s) · active v{t.active_version || '—'}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Link href={route('organization.templates.editor', t.id)} className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700">Edit</Link>
                                        <Link href={route('organization.templates.show', t.id)} className="text-sm border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50">Details</Link>
                                        <button
                                            onClick={() => confirm('Delete this template?') && destroy(route('organization.templates.destroy', t.id))}
                                            disabled={processing}
                                            className="text-sm text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
