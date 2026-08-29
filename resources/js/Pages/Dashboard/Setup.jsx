import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage } from '@inertiajs/react';

export default function Setup() {
    const user = usePage().props.auth.user;
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Welcome, {user.name}</h2>}>
            <div className="py-12">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Set up your organization</h1>
                    <p className="mt-3 text-slate-500">
                        Before you can create templates and issue certificates, you need to register your organization.
                    </p>
                    <Link href={route('organization.create')} className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700">
                        Create Organization
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
