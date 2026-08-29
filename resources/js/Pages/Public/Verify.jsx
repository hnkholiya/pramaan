import { useState } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

function CheckRow({ label, valid }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-600">{label}</span>
            {valid ? (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">VALID</span>
            ) : (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">INVALID</span>
            )}
        </div>
    );
}

export default function Verify({ result }) {
    const [number, setNumber] = useState('');

    const lookup = (e) => {
    e.preventDefault();

    const value = number.trim();

    if (!value) {
        return;
    }

    router.visit(
        `${route('public.verify')}?number=${encodeURIComponent(value)}`
    );
};

    return (
        <PublicLayout>
            <div className="max-w-2xl mx-auto w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Certificate Verification</h1>
                    <p className="text-slate-500 mt-1">Verify authenticity, document integrity, Merkle proof and blockchain anchor.</p>
                </div>

                <form onSubmit={lookup} className="bg-white rounded-xl shadow p-5 flex gap-3">
                    <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter certificate number (e.g. PRM-...) or use the link from the QR code"
                        className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <button className="bg-indigo-600 text-white px-5 py-2 rounded-md font-medium hover:bg-indigo-700">Verify</button>
                </form>

                {!result && (
                    <div className="mt-8 text-center text-sm text-slate-400">
                        Scan the QR code on a certificate or paste a verification link / certificate number.
                    </div>
                )}

                {result && result.valid && (
                    <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                        <div className="flex items-center gap-2">
                            <span className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">✓</span>
                            <h2 className="text-xl font-bold text-emerald-800">Certificate Verified</h2>
                        </div>
                        <p className="mt-2 text-sm text-emerald-700">{result.message}</p>
                        <CertificateDetails data={result.data} />
                        <Checks checks={result.checks} />
                    </div>
                )}

                {result && !result.valid && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center gap-2">
                            <span className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">✕</span>
                            <h2 className="text-xl font-bold text-red-800">Certificate Could Not Be Verified</h2>
                        </div>
                        <p className="mt-2 text-sm text-red-700">{result.message}</p>
                        {result.data && <CertificateDetails data={result.data} />}
                        {result.checks && <Checks checks={result.checks} />}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

function CertificateDetails({ data }) {
    const recipient = data.recipient || {};
    const name = recipient.recipient_name || recipient.name || '';
    return (
        <div className="mt-5 bg-white rounded-lg border border-emerald-100 p-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-slate-400 block text-xs">Certificate</span><span className="font-medium text-slate-800">{data.certificate_number}</span></div>
            <div><span className="text-slate-400 block text-xs">Recipient</span><span className="font-medium text-slate-800">{name}</span></div>
            <div><span className="text-slate-400 block text-xs">Organization</span><span className="font-medium text-slate-800">{data.organization?.name}</span></div>
            <div><span className="text-slate-400 block text-xs">Issued</span><span className="font-medium text-slate-800">{data.issued_at ? new Date(data.issued_at).toLocaleDateString() : '-'}</span></div>
            {data.transaction_hash && (
                <div className="col-span-2"><span className="text-slate-400 block text-xs">Blockchain TX</span><span className="font-mono text-xs text-slate-700 break-all">{data.transaction_hash}</span></div>
            )}
        </div>
    );
}

function Checks({ checks }) {
    return (
        <div className="mt-5 bg-white rounded-lg border border-slate-100 p-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Integrity Checks</h4>
            <CheckRow label="Certificate status" valid={checks.status?.valid} />
            <CheckRow label="Document integrity (SHA-256)" valid={checks.document_integrity?.valid} />
            <CheckRow label="Merkle proof" valid={checks.merkle_proof?.valid} />
            <CheckRow label="Blockchain anchor" valid={checks.blockchain_anchor?.valid} />
        </div>
    );
}
