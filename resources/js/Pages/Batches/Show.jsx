import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, router, Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

const STEPS = [
    { key: 'uploaded', label: 'Upload' },
    { key: 'validated', label: 'Validate' },
    { key: 'mapped', label: 'Map Fields' },
    { key: 'quoted', label: 'Quote' },
    { key: 'paid', label: 'Payment' },
    { key: 'completed', label: 'Generate' },
];

const STEP_ORDER = ['draft', 'uploaded', 'validated', 'mapped', 'quoted', 'payment_pending', 'paid', 'processing', 'completed'];

function stepIndex(status) {
    const i = STEP_ORDER.indexOf(status);
    return i === -1 ? 0 : i;
}

export default function Show({ batch, records, dynamic_fields, payment_mode }) {
    const [mapping, setMapping] = useState(batch.mapping || {});
    const current = stepIndex(batch.status);
    const mapForm = useForm({ mapping });
    const { post: postAction, processing } = useForm({});

    const isAtOrPast = (key) => current >= STEP_ORDER.indexOf(key);

    const go = (url, opts = {}) => postAction(url, { ...opts, preserveScroll: true });

    const saveMapping = () => {
        mapForm.data.mapping = mapping;
        mapForm.post(route('organization.batches.map', batch.id), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Batch #{batch.id}</h2>}>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white rounded-xl shadow p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-sm space-y-1">
                            <div><span className="text-slate-400">Template:</span> <span className="font-medium text-slate-800">{batch.template} <span className="text-slate-400">(v{batch.template_version})</span></span></div>
                            <div><span className="text-slate-400">Records:</span> <span className="font-medium">{batch.total}</span> · <span className="text-emerald-600">{batch.valid} valid</span> · <span className="text-red-500">{batch.invalid} invalid</span></div>
                        </div>
                        <StatusBadge status={batch.status} />
                    </div>

                    {/* Stepper */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {STEPS.map((s, i) => {
                            const done = current > STEP_ORDER.indexOf(s.key);
                            const active = STEP_ORDER.indexOf(s.key) === current;
                            return (
                                <div key={s.key} className={`text-xs px-3 py-1.5 rounded-full border ${done ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    {i + 1}. {s.label}
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left: Workflow actions */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* Validate */}
                            {isAtOrPast('uploaded') && !isAtOrPast('validated') && (
                                <ActionCard title="Validate Records" desc="Check every row for missing required values and invalid emails/dates.">
                                    <button onClick={() => go(route('organization.batches.validate', batch.id))} className="btn-primary">Run Validation</button>
                                </ActionCard>
                            )}

                            {/* Map */}
                            {(isAtOrPast('validated') || batch.status === 'mapped') && !isAtOrPast('paid') && (
                                <ActionCard title="Field Mapping" desc="Map CSV columns to template fields.">
                                    {dynamic_fields.length > 0 ? (
                                        <div className="space-y-2">
                                            {dynamic_fields.map((f) => (
                                                <div key={f.data_key} className="flex items-center gap-2 text-sm">
                                                    <span className="w-32 text-slate-600 truncate">{f.name}</span>
                                                    <select
                                                        value={mapping[f.data_key] || ''}
                                                        onChange={(e) => setMapping({ ...mapping, [f.data_key]: e.target.value })}
                                                        className="flex-1 rounded-md border-slate-300 text-sm"
                                                    >
                                                        <option value="">— select CSV column —</option>
                                                        {batch.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                </div>
                                            ))}
                                            <button onClick={saveMapping} disabled={mapForm.processing} className="btn-primary w-full mt-2">Save Mapping</button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400">Template has no dynamic fields.</p>
                                    )}
                                </ActionCard>
                            )}

                            {/* Quote */}
                            {(isAtOrPast('mapped') || batch.status === 'quoted') && !isAtOrPast('paid') && (
                                <ActionCard title="Price Quote">
                                    {batch.quote ? (
                                        <div className="text-sm space-y-1">
                                            <Row k="Certificates" v={batch.quote.certificate_count} />
                                            <Row k="Price / cert" v={batch.quote.currency + ' ' + batch.quote.price_per_certificate} />
                                            <Row k="Subtotal" v={batch.quote.currency + ' ' + batch.quote.subtotal} />
                                            <Row k={`Tax (${batch.quote.tax_rate}%)`} v={batch.quote.currency + ' ' + batch.quote.tax} />
                                            <div className="border-t border-slate-100 pt-1 font-semibold"><Row k="Total" v={batch.quote.currency + ' ' + batch.quote.total} /></div>
                                        </div>
                                    ) : (
                                        <button onClick={() => go(route('organization.batches.quote', batch.id))} className="btn-primary">Generate Quote</button>
                                    )}
                                </ActionCard>
                            )}

                            {/* Pay */}
                            {(isAtOrPast('quoted') || batch.status === 'payment_pending') && !isAtOrPast('paid') && (
                                <ActionCard title="Payment">
                                    <p className="text-xs text-slate-500 mb-3">
                                        {payment_mode === 'mock'
                                            ? 'Mock payment provider active — payment will be simulated.'
                                            : 'You will be redirected to Razorpay checkout.'}
                                    </p>
                                    <button onClick={() => go(route('organization.batches.pay', batch.id))} className="btn-primary">
                                        Pay {batch.quote ? batch.quote.currency + ' ' + batch.quote.total : ''}
                                    </button>
                                </ActionCard>
                            )}

                            {/* Generate */}
                            {isAtOrPast('paid') && batch.status !== 'processing' && batch.status !== 'completed' && (
                                <ActionCard title="Generate Certificates">
                                    <button onClick={() => go(route('organization.batches.generate', batch.id))} className="btn-primary">Generate PDF Certificates</button>
                                </ActionCard>
                            )}

                            {/* Anchor */}
                            {batch.status === 'completed' && !batch.anchor_status && (
                                <ActionCard title="Blockchain Anchor">
                                    <button onClick={() => go(route('organization.batches.anchor', batch.id))} className="btn-primary">Anchor to Blockchain</button>
                                </ActionCard>
                            )}

                            {/* Anchor result */}
                            {batch.anchor_status && (
                                <ActionCard title="Blockchain Anchor">
                                    <StatusBadge status={batch.anchor_status} />
                                    {batch.anchor_root && <div className="mt-2 text-xs font-mono text-slate-600 break-all">Root: {batch.anchor_root}</div>}
                                    {batch.transaction_hash && <div className="mt-1 text-xs font-mono text-slate-600 break-all">TX: {batch.transaction_hash}</div>}
                                </ActionCard>
                            )}

                            {batch.status === 'completed' && batch.anchor_status && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
                                    Batch issued and anchored. Certificates are verifiable via QR codes.
                                </div>
                            )}
                        </div>

                        {/* Right: Records */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800">Records ({records.length})</div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                                            <th className="px-4 py-2">#</th>
                                            <th className="px-4 py-2">Data</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2">Certificate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {records.map((r) => {
                                            const first = Object.entries(r.data || {})[0];
                                            return (
                                                <tr key={r.id}>
                                                    <td className="px-4 py-2 text-slate-400">{r.row}</td>
                                                    <td className="px-4 py-2">
                                                        <span className="font-medium text-slate-700">{first ? first[1] : '-'}</span>
                                                        {r.errors && r.errors.length > 0 && (
                                                            <div className="text-xs text-red-600 mt-0.5">{r.errors.slice(0, 2).join(' · ')}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                                                    <td className="px-4 py-2">
                                                        {r.certificate ? (
                                                            <a href={`/verify/${r.certificate.token}`} target="_blank" className="text-indigo-600 hover:underline text-xs">{r.certificate.number}</a>
                                                        ) : '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function ActionCard({ title, desc, children }) {
    return (
        <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            {desc && <p className="text-xs text-slate-500 mt-1">{desc}</p>}
            <div className="mt-3">{children}</div>
        </div>
    );
}

function Row({ k, v }) {
    return <div className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-700">{v}</span></div>;
}
