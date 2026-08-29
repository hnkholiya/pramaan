const colors = {
    draft: 'bg-slate-100 text-slate-700',
    uploaded: 'bg-sky-100 text-sky-700',
    validated: 'bg-blue-100 text-blue-700',
    mapped: 'bg-indigo-100 text-indigo-700',
    quoted: 'bg-purple-100 text-purple-700',
    payment_pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-cyan-100 text-cyan-700',
    processing: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
    submitted: 'bg-sky-100 text-sky-700',
    confirming: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    created: 'bg-slate-100 text-slate-700',
    authorized: 'bg-sky-100 text-sky-700',
    captured: 'bg-emerald-100 text-emerald-700',
    active: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-slate-100 text-slate-700',
    issued: 'bg-emerald-100 text-emerald-700',
    generated: 'bg-sky-100 text-sky-700',
    revoked: 'bg-red-100 text-red-700',
    valid: 'bg-emerald-100 text-emerald-700',
    invalid: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }) {
    const label = (status || '').replace(/_/g, ' ');
    const cls = colors[status] || 'bg-slate-100 text-slate-600';
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}
