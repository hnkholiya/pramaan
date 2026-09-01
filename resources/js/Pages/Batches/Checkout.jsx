import { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

function ShieldLockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
            <path
                d="M12 3.5c2.28 1.4 4.4 2 6.75 2v6.1c0 4.53-2.86 7.53-6.75 8.9-3.89-1.37-6.75-4.37-6.75-8.9V5.5c2.35 0 4.47-.6 6.75-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect x="9.25" y="11.25" width="5.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.25 11.25V9.75a1.75 1.75 0 0 1 3.5 0v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function ReceiptIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
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

function TagIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path
                d="M11.5 3.5H6a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 .44 1.06l8 8a1.5 1.5 0 0 0 2.12 0l5.5-5.5a1.5 1.5 0 0 0 0-2.12l-8-8a1.5 1.5 0 0 0-1.06-.44Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="8.75" cy="8.75" r="1.15" fill="currentColor" />
        </svg>
    );
}

function CreditCardIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <rect x="2.75" y="5.5" width="18.5" height="13" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2.75 9.75h18.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function CheckCircleIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="m8.25 12.25 2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AlertTriangleIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0">
            <path
                d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M12 9v4.5M12 16.5h.008" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SpinnerIcon({ className = 'h-4 w-4' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className + ' animate-spin'}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
            <rect x="4.5" y="10.5" width="15" height="9.75" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 10.5V7.75a4 4 0 1 1 8 0v2.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function formatAmount(currency, amount) {
    const value = Number(amount);
    const display = Number.isFinite(value)
        ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : amount;
    return { display, currency };
}

export default function Checkout({ batch_id, payment, razorpay_key }) {
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const checkoutOpened = useRef(false);

    useEffect(() => {
        loadRazorpay();
    }, []);

    const loadRazorpay = () => {
        if (typeof window.Razorpay !== 'undefined') {
            openCheckout();
            return;
        }

        const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

        if (existingScript) {
            existingScript.addEventListener('load', openCheckout, { once: true });
            return;
        }

        const script = document.createElement('script');

        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = openCheckout;

        script.onerror = () => {
            setError('Unable to load Razorpay Checkout.');
        };

        document.body.appendChild(script);
    };

    const openCheckout = () => {
        if (checkoutOpened.current || typeof window.Razorpay === 'undefined') {
            return;
        }

        checkoutOpened.current = true;

        const options = {
            key: razorpay_key,

            amount: Math.round(Number(payment.amount) * 100),

            currency: payment.currency,

            name: 'Pramaan',

            description: 'Certificate issuance',

            order_id: payment.order_id,

            handler: (response) => {
                /*
                 * Razorpay returns:
                 *
                 * razorpay_payment_id
                 * razorpay_order_id
                 * razorpay_signature
                 *
                 * Send these values explicitly to Laravel.
                 */
                setProcessing(true);
                setError('');

                router.post(
                    route('organization.payments.callback', payment.id),
                    {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    },
                    {
                        preserveScroll: true,

                        onError: (errors) => {
                            setProcessing(false);

                            setError(
                                errors?.message || errors?.error || 'Payment verification failed.'
                            );
                        },

                        onFinish: () => {
                            setProcessing(false);
                        },
                    }
                );
            },

            modal: {
                ondismiss: () => {
                    checkoutOpened.current = false;

                    window.location.href = route('organization.batches.show', batch_id);
                },
            },

            theme: {
                color: '#4f46e5',
            },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on('payment.failed', (response) => {
            console.error('Razorpay payment failed:', response?.error);

            setProcessing(false);

            setError(response?.error?.description || 'Payment failed. Please try again.');
        });

        razorpay.open();
    };

    const amount = formatAmount(payment.currency, payment.amount);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <img src="/pramaan.svg" alt="Pramaan" className="h-7 w-7 shrink-0" />
                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
                        Payment
                    </h2>
                </div>
            }
        >
            <Head title="Payment" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50/60 px-4 py-12 font-sans antialiased sm:py-16">
                <div className="w-full max-w-md">
                    {/* Brand mark */}
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 shadow-sm">
                            <img src="/pramaan.svg" alt="" className="h-6 w-6 brightness-0 invert" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-500">
                            Secure checkout by Pramaan
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        {/* Status header */}
                        <div className="border-b border-gray-100 px-6 py-6 text-center sm:px-8">
                            <div
                                className={
                                    'mx-auto flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200 ' +
                                    (processing
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : error
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-gray-900/5 text-gray-700')
                                }
                            >
                                {processing ? <SpinnerIcon className="h-5 w-5" /> : <ShieldLockIcon />}
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-gray-900">
                                {processing ? 'Verifying payment' : 'Complete your payment'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {processing
                                    ? 'Please wait while we confirm this transaction.'
                                    : 'Review your order summary below before proceeding.'}
                            </p>
                        </div>

                        {/* Order summary */}
                        <div className="space-y-4 px-6 py-6 sm:px-8">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                <ReceiptIcon />
                                Order Summary
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <TagIcon />
                                        Razorpay Order
                                    </span>
                                    <span className="max-w-[55%] truncate font-mono text-xs text-gray-600">
                                        {payment.order_id}
                                    </span>
                                </div>

                                <div className="my-3 h-px bg-gray-100" />

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <CreditCardIcon />
                                        Amount Due
                                    </span>
                                    <span className="text-lg font-semibold tracking-tight text-gray-900">
                                        {amount.currency} {amount.display}
                                    </span>
                                </div>
                            </div>

                            {/* Processing state */}
                            {processing && (
                                <div className="flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3.5">
                                    <span className="mt-0.5 shrink-0 text-indigo-500">
                                        <SpinnerIcon className="h-4 w-4" />
                                    </span>
                                    <p className="text-sm leading-relaxed text-indigo-700">
                                        Payment successful. Verifying with Pramaan…
                                    </p>
                                </div>
                            )}

                            {/* Error state */}
                            {error && (
                                <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5">
                                    <span className="mt-0.5 text-red-500">
                                        <AlertTriangleIcon />
                                    </span>
                                    <p className="text-sm leading-relaxed text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Action */}
                            {!processing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        checkoutOpened.current = false;
                                        openCheckout();
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-gray-800"
                                >
                                    <ShieldLockIcon />
                                    <span className="h-5 w-5 hidden" />
                                    Open Checkout
                                </button>
                            )}
                        </div>

                        {/* Trust footer */}
                        <div className="flex items-center justify-center gap-1.5 border-t border-gray-100 bg-gray-50/60 px-6 py-4 text-xs text-gray-400 sm:px-8">
                            <LockIcon />
                            Payments are processed securely via Razorpay
                        </div>
                    </div>

                    {!processing && (
                        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                            You'll be redirected back automatically after payment
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}