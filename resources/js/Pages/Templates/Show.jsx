import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

export default function Show({ template, has_been_used }) {
    const v = template.active_version ? template.versions.find((x) => x.id === template.active_version) : null;
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{template.name}</h2>}>
            <div className="py-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">{template.slug} · {template.canvas_width}×{template.canvas_height} · {template.orientation}</p>
                            <p className="mt-2 text-sm text-slate-600">{template.description || 'No description'}</p>
                        </div>
                        <StatusBadge status={template.status} />
                    </div>

                    {has_been_used && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                            This template has issued certificates. Editing it now creates a new immutable version; historical certificates keep their original layout.
                        </div>
                    )}

                    <div className="mt-6">
                        <h3 className="font-semibold text-slate-800 mb-2">Versions</h3>
                        <div className="space-y-2">
                            {template.versions.map((ver) => (
                                <div key={ver.id} className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-2">
                                    <span className="text-sm font-medium text-slate-700">Version {ver.version}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-400">{ver.snapshot?.elements?.length ?? 0} elements</span>
                                        {ver.is_active ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">ACTIVE</span> : <span className="text-xs text-slate-400">inactive</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Link href={route('organization.templates.editor', template.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">Open Editor</Link>
                        <a href={route('organization.templates.preview', template.id)} target="_blank" className="border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm hover:bg-slate-50">Preview PDF</a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
