import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';

export default function AdminDashboard({ stats }) {
    const cards = [
        ['Organizations', stats.organizations, route('admin.organizations')],
        ['Batches', stats.batches, route('admin.batches')],
        ['Certificates', stats.certificates, route('admin.certificates')],
        ['Payments', stats.payments, route('admin.payments')],
        ['Anchors (total)', stats.anchors, route('admin.dashboard')],
        ['Confirmed Anchors', stats.confirmed_anchors, route('admin.dashboard')],
    ];
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Admin Monitor</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {cards.map(([label, value, href]) => (
                            <Link key={label} href={href} className="bg-white rounded-xl shadow p-6 border border-slate-100">
                                <div className="text-3xl font-extrabold text-slate-900">{value}</div>
                                <div className="text-sm text-slate-500 mt-1">{label}</div>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-6 bg-white rounded-xl shadow p-5 text-sm text-slate-600">
                        Failed anchors: <span className="font-semibold text-red-600">{stats.failed_anchors}</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
