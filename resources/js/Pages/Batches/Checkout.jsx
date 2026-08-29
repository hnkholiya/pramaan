import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';

export default function Checkout({ batch_id, payment, razorpay_key }) {
    const { post, processing } = useForm({});

    useEffect(() => {
        if (typeof window.Razorpay === 'undefined') {
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = openCheckout;
            document.body.appendChild(s);
        } else {
            openCheckout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openCheckout = () => {
        const rzp = new window.Razorpay({
            key: razorpay_key,
            amount: payment.amount * 100,
            currency: payment.currency,
            name: 'Pramaan',
            description: 'Certificate issuance',
            order_id: payment.order_id,
            handler: (response) => {
                post(route('organization.payments.callback', payment.id), response);
            },
            modal: {
                ondismiss: () => { window.location.href = route('organization.batches.show', batch_id); },
            },
        });
        rzp.open();
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Payment</h2>}>
            <div className="py-12">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 text-center">
                    <h3 className="font-semibold text-slate-800">Processing payment</h3>
                    <p className="mt-2 text-sm text-slate-500">
                        {payment.currency} {payment.amount} — Razorpay order {payment.order_id}
                    </p>
                    <p className="mt-4 text-xs text-slate-400">The Razorpay checkout window will open automatically.</p>
                    {processing && <p className="mt-3 text-sm text-indigo-600">Verifying payment…</p>}
                    <button onClick={openCheckout} className="btn-primary mt-6">Open Checkout</button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
