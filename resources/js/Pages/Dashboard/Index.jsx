import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

// Icon Components
const TemplateIcon = () => (
    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const BatchIcon = () => (
    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
    </svg>
);

const CertificateIcon = () => (
    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PaymentIcon = () => (
    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h10m4 0a1 1 0 11-2 0 1 1 0 012 0zM7 6h.01M17 6h.01M6 9h12a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9a2 2 0 012-2z" />
    </svg>
);

export default function Dashboard({ organization, stats, recent_batches }) {
    const cards = [
        { 
            label: 'Templates', 
            value: stats.templates, 
            href: route('organization.templates.index'),
            icon: TemplateIcon,
            gradient: 'from-blue-500 to-blue-600',
            lightBg: 'bg-blue-50'
        },
        { 
            label: 'Batches', 
            value: stats.batches, 
            href: route('organization.batches.index'),
            icon: BatchIcon,
            gradient: 'from-purple-500 to-purple-600',
            lightBg: 'bg-purple-50'
        },
        { 
            label: 'Certificates', 
            value: stats.certificates, 
            href: route('organization.certificates.index'),
            icon: CertificateIcon,
            gradient: 'from-green-500 to-green-600',
            lightBg: 'bg-green-50'
        },
        { 
            label: 'Pending Payments', 
            value: stats.pending_payments, 
            href: route('organization.payments.index'),
            icon: PaymentIcon,
            gradient: 'from-orange-500 to-orange-600',
            lightBg: 'bg-orange-50'
        },
    ];

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Quick Stats Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Quick Overview
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {cards.map((c) => {
                                const IconComponent = c.icon;
                                return (
                                    <Link 
                                        key={c.label} 
                                        href={c.href} 
                                        className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                        <div className={`${c.lightBg} p-6 border border-gray-100 hover:border-indigo-200 transition-colors`}>
                                            <div className="flex items-start justify-between mb-4">
                                                <IconComponent />
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                            <div className="text-4xl font-bold text-gray-900 mb-2">
                                                {c.value}
                                            </div>
                                            <div className="text-sm font-medium text-gray-600">
                                                {c.label}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Batches Section */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900">Recent Batches</h3>
                            </div>
                            <Link 
                                href={route('organization.batches.create')} 
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Batch
                            </Link>
                        </div>

                        {recent_batches.length === 0 ? (
                            <div className="px-8 py-16 text-center">
                                <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-600 text-lg mb-6">
                                    No batches yet. Create your first batch to get started!
                                </p>
                                <Link 
                                    href={route('organization.templates.create')} 
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create a Template
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Template
                                                </div>
                                            </th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Valid
                                                </div>
                                            </th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Status
                                                </div>
                                            </th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                    Anchor
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recent_batches.map((b) => (
                                            <tr 
                                                key={b.id}
                                                className="hover:bg-indigo-50 transition-colors duration-150 cursor-pointer group"
                                            >
                                                <td className="px-8 py-4 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-600"></span>
                                                        {b.template}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                                        {b.valid}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="inline-block">
                                                        <StatusBadge status={b.status} />
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    {b.anchor ? (
                                                        <div className="inline-block">
                                                            <StatusBadge status={b.anchor} />
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 font-medium">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}