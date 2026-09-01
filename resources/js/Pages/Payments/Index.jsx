import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

function CreditCardIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <rect x="2.75" y="5.5" width="18.5" height="13" rx="2.25" stroke="currentColor" strokeWidth="1.6" />
            <path d="M2.75 9.75h18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M6 14.25h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function ReceiptIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path
                d="M6 3.5h12v17l-2.25-1.5L13.5 20.5l-2.25-1.5L9 20.5l-2.25-1.5L4.5 20.5v-15A2 2 0 0 1 6 3.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M8 8h8M8 11.5h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function LayersIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
            <path
                d="m12 3.5 8.25 4.5L12 12.5 3.75 8 12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="m3.75 12 8.25 4.5L20.25 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m3.75 16 8.25 4.5L20.25 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ProviderIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 13.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function InboxIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
            <path
                d="M4.5 13.5 6.8 5.9a1.5 1.5 0 0 1 1.44-1.07h7.52a1.5 1.5 0 0 1 1.44 1.07l2.3 7.6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.5 13.5h4.4a1 1 0 0 1 .93.63l.5 1.24a1 1 0 0 0 .93.63h3.48a1 1 0 0 0 .93-.63l.5-1.24a1 1 0 0 1 .93-.63h4.4V18a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 4.5 18v-4.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowUpRightIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
            <path d="M7 17 17 7M8.5 7H17v8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function formatAmount(currency, amount) {
    const value = Number(amount);
    const display = Number.isFinite(value) ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : amount;
    return `${currency} ${display}`;
}

export default function Index({ payments }) {
    const list = payments || [];
    const total = list.length;
    
    const totalsByStatus = list.reduce((acc, p) => {
        const key = (p.status || 'unknown').toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const successCount =
        (totalsByStatus.captured || 0) +
        (totalsByStatus.success || 0) +
        (totalsByStatus.paid || 0) +
        (totalsByStatus.completed || 0);

    const pendingCount =
        (totalsByStatus.pending || 0) +
        (totalsByStatus.created || 0) +
        (totalsByStatus.authorized || 0);

    const failedCount =
        (totalsByStatus.failed || 0) +
        (totalsByStatus.declined || 0) +
        (totalsByStatus.cancelled || 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <img src="/pramaan.svg" alt="Pramaan" className="h-7 w-7 shrink-0" />
                    <div>
                        <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
                            Payments
                        </h2>
                        <p className="hidden text-sm text-gray-500 sm:block">
                            Track transaction status across every batch and provider.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Payments" />

            <div className="min-h-screen bg-gray-50/60 py-8 font-sans antialiased sm:py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Summary strip */}
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center gap-2 text-gray-400">
                                <CreditCardIcon />
                                <span className="text-xs font-medium uppercase tracking-wide">Total</span>
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">{total}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center gap-2 text-emerald-500">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Success</span>
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                {successCount}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center gap-2 text-amber-500">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Pending</span>
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                {pendingCount}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5">
                            <div className="flex items-center gap-2 text-red-500">
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Failed</span>
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                {failedCount}
                            </p>
                        </div>
                    </div>

                    {/* Payments panel */}
                    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
                                <ReceiptIcon />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Transaction History</h3>
                                <p className="mt-0.5 text-sm text-gray-500">
                                    {total} {total === 1 ? 'transaction' : 'transactions'} recorded
                                </p>
                            </div>
                        </div>

                        {total === 0 ? (
                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
                                    <InboxIcon />
                                </div>
                                <p className="mt-4 text-sm font-medium text-gray-900">No payments yet</p>
                                <p className="mt-1 max-w-xs text-sm text-gray-500">
                                    Transactions will appear here as soon as a payment is processed.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop / tablet table */}
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                                                <th className="px-5 py-3 font-medium lg:px-8">Order</th>
                                                <th className="px-5 py-3 font-medium">Payment</th>
                                                <th className="px-5 py-3 font-medium">Provider</th>
                                                <th className="px-5 py-3 font-medium">Amount</th>
                                                <th className="px-5 py-3 font-medium">Status</th>
                                                <th className="px-5 py-3 font-medium lg:px-8">Batch</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {list.map((p) => (
                                                <tr
                                                    key={p.id}
                                                    className="group transition-colors duration-150 hover:bg-gray-50/70"
                                                >
                                                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-gray-700 lg:px-8">
                                                        {p.order_id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-gray-500">
                                                        {p.payment_id || (
                                                            <span className="text-gray-300">—</span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4">
                                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                                                            <ProviderIcon />
                                                            {p.provider}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                                                        {formatAmount(p.currency, p.amount)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4">
                                                        <StatusBadge status={p.status} />
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 lg:px-8">
                                                        <Link
                                                            href={route('organization.batches.show', p.batch_id)}
                                                            className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900"
                                                        >
                                                            <LayersIcon />
                                                            Batch #{p.batch_id}
                                                            <ArrowUpRightIcon />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile card list */}
                                <div className="divide-y divide-gray-50 md:hidden">
                                    {list.map((p) => (
                                        <div key={p.id} className="px-5 py-4 transition-colors duration-150 active:bg-gray-50">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-mono text-xs text-gray-500">
                                                        Order {p.order_id}
                                                    </p>
                                                    <p className="mt-1 text-base font-semibold text-gray-900">
                                                        {formatAmount(p.currency, p.amount)}
                                                    </p>
                                                </div>
                                                <StatusBadge status={p.status} />
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <ProviderIcon />
                                                    {p.provider}
                                                </span>
                                                {p.payment_id ? (
                                                    <span className="font-mono text-gray-400">{p.payment_id}</span>
                                                ) : null}
                                            </div>

                                            <Link
                                                href={route('organization.batches.show', p.batch_id)}
                                                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900"
                                            >
                                                <LayersIcon />
                                                Batch #{p.batch_id}
                                                <ArrowUpRightIcon />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}