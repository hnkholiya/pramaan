import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function Show({ organization }) {
    const fields = [
        ['Name', organization.name],
        ['Slug', organization.slug],
        ['Email', organization.email || '-'],
        ['Phone', organization.phone || '-'],
        ['Website', organization.website || '-'],
        ['Address', organization.address || '-'],
        ['Status', organization.status?.label || organization.status],
    ];

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Organization</h2>}>
            <div className="py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
                    <dl className="divide-y divide-slate-100">
                        {fields.map(([k, v]) => (
                            <div key={k} className="flex justify-between py-3">
                                <dt className="text-sm text-slate-500">{k}</dt>
                                <dd className="text-sm font-medium text-slate-800">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    <div className="mt-6 flex justify-end">
                        <Link href={route('dashboard')} className="text-sm text-indigo-600">Back to Dashboard →</Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
