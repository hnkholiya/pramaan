import { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

export default function Checkout({
    batch_id,
    payment,
    razorpay_key,
}) {
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
            existingScript.addEventListener(
                'load',
                openCheckout,
                { once: true }
            );

            return;
        }

        const script = document.createElement('script');

        script.src =
            'https://checkout.razorpay.com/v1/checkout.js';

        script.async = true;

        script.onload = openCheckout;

        script.onerror = () => {
            setError(
                'Unable to load Razorpay Checkout.'
            );
        };

        document.body.appendChild(script);
    };

    const openCheckout = () => {
        if (
            checkoutOpened.current ||
            typeof window.Razorpay === 'undefined'
        ) {
            return;
        }

        checkoutOpened.current = true;

        const options = {
            key: razorpay_key,

            amount: Math.round(
                Number(payment.amount) * 100
            ),

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
                    route(
                        'organization.payments.callback',
                        payment.id
                    ),
                    {
                        razorpay_payment_id:
                            response.razorpay_payment_id,

                        razorpay_order_id:
                            response.razorpay_order_id,

                        razorpay_signature:
                            response.razorpay_signature,
                    },
                    {
                        preserveScroll: true,

                        onError: (errors) => {
                            setProcessing(false);

                            setError(
                                errors?.message ||
                                errors?.error ||
                                'Payment verification failed.'
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

                    window.location.href =
                        route(
                            'organization.batches.show',
                            batch_id
                        );
                },
            },

            theme: {
                color: '#4f46e5',
            },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on('payment.failed', (response) => {
            console.error(
                'Razorpay payment failed:',
                response?.error
            );

            setProcessing(false);

            setError(
                response?.error?.description ||
                'Payment failed. Please try again.'
            );
        });

        razorpay.open();
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Payment
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow">

                    <h3 className="font-semibold text-slate-800">
                        {processing
                            ? 'Verifying payment'
                            : 'Complete payment'}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        {payment.currency}{' '}
                        {payment.amount}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Razorpay Order: {payment.order_id}
                    </p>

                    {processing && (
                        <p className="mt-4 text-sm text-indigo-600">
                            Payment successful. Verifying with Pramaan...
                        </p>
                    )}

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {!processing && (
                        <button
                            type="button"
                            onClick={() => {
                                checkoutOpened.current = false;
                                openCheckout();
                            }}
                            className="mt-6 rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Open Checkout
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}