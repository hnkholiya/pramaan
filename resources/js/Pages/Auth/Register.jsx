import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

function LogoMark({ className = 'h-10 w-10' }) {
    return (
        <img
            src="/pramaan.svg"
            alt="Pramaan"
            className={`${className} object-contain`}
        />
    );
}

function UserIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function MailIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
            <path d="m5 7 7 5 7-5" />
        </svg>
    );
}

function LockIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="4.5" y="10" width="15" height="10" rx="2" />
            <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
        </svg>
    );
}

function EyeIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M2.8 12s3.3-5.5 9.2-5.5S21.2 12 21.2 12s-3.3 5.5-9.2 5.5S2.8 12 2.8 12Z" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    );
}

function EyeOffIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m3 3 18 18" />
            <path d="M10.6 6.7A8.6 8.6 0 0 1 12 6.5c5.9 0 9.2 5.5 9.2 5.5a15.4 15.4 0 0 1-2.3 2.9" />
            <path d="M6.2 6.2A15.4 15.4 0 0 0 2.8 12s3.3 5.5 9.2 5.5a8.8 8.8 0 0 0 3.1-.5" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
    );
}

function ArrowRightIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

function ShieldCheckIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function KeyIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m21 2-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.77 7.77 5.5 5.5 0 0 1 7.77-7.77ZM15 7l3 3" />
        </svg>
    );
}

function SpinnerIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={`animate-spin ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-20"
            />
            <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CryptographicBentoGrid() {
    return (
        <div className="relative mx-auto w-full max-w-[500px] grid grid-cols-2 gap-3">
            {/* Ambient background glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-sky-400/10 rounded-3xl blur-2xl pointer-events-none" />

            {/* Bento Card 1: Live Ledger Status (Spans 2 columns) */}
            <div className="col-span-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <ShieldCheckIcon className="h-4 w-4" />
                        </div>
                        <span className="text-[12px] font-bold text-slate-900">Cryptographic Anchor</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Secured
                    </span>
                </div>
                <div className="font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-xl tracking-tight overflow-x-auto shadow-inner">
                    0x7f83b...4a29e • SHA-256 Verified Ledger Block
                </div>
            </div>

            {/* Bento Card 2: Speed / Latency Metric */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-[11px] font-semibold">Verification Speed</span>
                    <span className="text-xs font-bold text-emerald-600">Optimal</span>
                </div>
                <div>
                    <div className="text-[22px] font-black tracking-tight text-slate-950">&lt; 0.4s</div>
                    <div className="text-[10px] font-medium text-slate-400 mt-0.5">Global edge lookup</div>
                </div>
            </div>

            {/* Bento Card 3: Key Generation Node */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-[11px] font-semibold">PKI Engine</span>
                    <KeyIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                    <div className="text-[16px] font-extrabold text-slate-950">RSA 4096-bit</div>
                    <div className="text-[10px] font-medium text-slate-400 mt-0.5">Hardware security module</div>
                </div>
            </div>

            {/* Bento Card 4: Tamper-proof Guarantee Banner (Spans 2 cols) */}
            <div className="col-span-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md flex items-center justify-between">
                <div>
                    <div className="text-[12px] font-bold">Zero-Knowledge Proofs Ready</div>
                    <div className="text-[11px] text-blue-100 opacity-90">Verify credentials without leaking sensitive payloads.</div>
                </div>
                <div className="h-8 w-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                    <ArrowRightIcon className="h-4 w-4 text-white" />
                </div>
            </div>
        </div>
    );
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create account — Pramaan" />

            <div
                className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Left Column: Cryptographic Bento Box Panel */}
                    <section className="relative hidden overflow-hidden border-r border-slate-200/90 bg-[#f4f7fb] lg:flex lg:flex-col justify-between p-12 xl:p-16">
                        {/* Blueprint grid texture */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.4]"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }}
                        />
                        <div className="pointer-events-none absolute right-[-100px] top-1/4 h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-3xl" />

                        {/* Top Branding */}
                        <div className="relative z-10 flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3.5" aria-label="Pramaan home">
                                <LogoMark className="h-10 w-10" />
                                <div>
                                    <div className="text-[19px] font-bold tracking-[-0.035em] text-slate-950">
                                        Pramaan
                                    </div>
                                    <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-600">
                                        Trust Infrastructure
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Center Value Content & Bento Box */}
                        <div className="relative z-10 my-auto py-6">
                            <div className="max-w-[500px] mb-8">
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md mb-5">
                                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
                                        Cryptographic Engine
                                    </span>
                                </div>

                                <h1 className="text-[40px] font-black leading-[1.08] tracking-[-0.045em] text-slate-950 xl:text-[46px]">
                                    Engineered for absolute <span className="text-blue-600">document integrity.</span>
                                </h1>

                                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                                    Create your organization workspace to access automated key generation, immutable ledgers, and sub-second validation routines.
                                </p>
                            </div>

                            <CryptographicBentoGrid />
                        </div>

                        {/* Bottom Status Footer */}
                        <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-slate-400">
                            <span>&copy; {new Date().getFullYear()} Pramaan Security Systems.</span>
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>All nodes synchronized</span>
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Premium Form Section */}
                    <section className="relative flex min-h-screen flex-col bg-white">
                        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6 sm:px-8 lg:hidden">
                            <Link href="/" className="flex items-center gap-3" aria-label="Pramaan home">
                                <LogoMark className="h-8 w-8" />
                                <div className="text-[18px] font-bold tracking-[-0.03em] text-slate-950">
                                    Pramaan
                                </div>
                            </Link>
                            <Link
                                href={route('login')}
                                className="text-[12px] font-semibold text-slate-600 hover:text-slate-950"
                            >
                                Sign in
                            </Link>
                        </div>

                        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-8 lg:px-12 xl:px-20">
                            <div className="w-full max-w-[420px]">
                                <div className="hidden lg:flex lg:justify-end mb-6">
                                    <Link
                                        href={route('login')}
                                        className="group inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500 transition-colors hover:text-slate-950"
                                    >
                                        Already registered?{' '}
                                        <span className="text-blue-600 font-bold group-hover:underline">Sign in</span>
                                        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                                        Secure Registration
                                    </div>
                                    <h2 className="text-[30px] font-black tracking-tight text-slate-950 sm:text-[34px]">
                                        Create workspace
                                    </h2>
                                    <p className="text-[13px] text-slate-500">
                                        Fill in your details below to set up your administrator portal.
                                    </p>
                                </div>

                                <form onSubmit={submit} className="mt-8 space-y-4.5" noValidate>
                                    <div>
                                        <label htmlFor="name" className="mb-1.5 block text-[12px] font-bold text-slate-700">
                                            Full name
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                autoComplete="name"
                                                autoFocus
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Dr. Jane Doe"
                                                className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-11 pr-4 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                                    errors.name
                                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                                                }`}
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-1.5 text-[11px] font-semibold text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-1.5 block text-[12px] font-bold text-slate-700">
                                            Institutional email
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                                                <MailIcon className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                autoComplete="username"
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="registrar@university.edu"
                                                className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-11 pr-4 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                                    errors.email
                                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                                                }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1.5 text-[11px] font-semibold text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-1.5 block text-[12px] font-bold text-slate-700">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                                                <LockIcon className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Create a secure password"
                                                className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-11 pr-12 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                                    errors.password
                                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((value) => !value)}
                                                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-700 focus:outline-none"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <EyeOffIcon className="h-4 w-4" />
                                                ) : (
                                                    <EyeIcon className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1.5 text-[11px] font-semibold text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="mb-1.5 block text-[12px] font-bold text-slate-700">
                                            Confirm password
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                                                <LockIcon className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm your secure password"
                                                className={`h-12 w-full rounded-xl border bg-slate-50/50 pl-11 pr-12 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                                    errors.password_confirmation
                                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((value) => !value)}
                                                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-700 focus:outline-none"
                                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOffIcon className="h-4 w-4" />
                                                ) : (
                                                    <EyeIcon className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="mt-1.5 text-[11px] font-semibold text-red-600">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-70"
                                        >
                                            {processing ? (
                                                <>
                                                    <SpinnerIcon className="h-4 w-4 text-white" />
                                                    <span>Initializing workspace...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Create account</span>
                                                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Mobile link */}
                                    <div className="mt-6 text-center lg:hidden">
                                        <p className="text-[12px] text-slate-500">
                                            Already registered?{' '}
                                            <Link
                                                href={route('login')}
                                                className="font-bold text-blue-600 hover:underline"
                                            >
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}