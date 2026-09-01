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
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3.5 19 6v5.1c0 4.25-2.7 7.7-7 9.4-4.3-1.7-7-5.15-7-9.4V6l7-2.5Z" />
            <path d="m8.7 12.1 2.1 2.1 4.5-4.6" />
        </svg>
    );
}

function FingerprintIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M7.2 9.2A5.6 5.6 0 0 1 12 6.5a5.5 5.5 0 0 1 5.5 5.5c0 3.7-1 6.2-2.1 8" />
            <path d="M5 12a7 7 0 0 1 14 0c0 2.2-.25 4.1-.75 5.75" />
            <path d="M9 12a3 3 0 0 1 6 0c0 3.7-.7 6.6-1.6 8.5" />
            <path d="M11 12a1 1 0 0 1 2 0c0 3-.4 5.3-1 7" />
        </svg>
    );
}

function BlocksIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3.5" y="4" width="6" height="6" rx="1.5" />
            <rect x="14.5" y="14" width="6" height="6" rx="1.5" />
            <path d="M9.5 7h3a4 4 0 0 1 4 4v3" />
            <path d="M14.5 17h-3a4 4 0 0 1-4-4v-3" />
        </svg>
    );
}

function CheckIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m5 12.5 4.25 4L19 7.5" />
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

function TrustVisual() {
    return (
        <div className="relative mx-auto w-full max-w-[500px]">
            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/80" />
            
            <div className="relative flex min-h-[430px] items-center justify-center">
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 500 430"
                    fill="none"
                    aria-hidden="true"
                >
                    <path d="M95 100 L250 215" stroke="#E2E8F0" strokeWidth="1.5" />
                    <path d="M405 95 L250 215" stroke="#E2E8F0" strokeWidth="1.5" />
                    <path d="M115 330 L250 215" stroke="#E2E8F0" strokeWidth="1.5" />
                    <path d="M390 330 L250 215" stroke="#E2E8F0" strokeWidth="1.5" />

                    <circle r="3.5" fill="#3B82F6">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M95 100 L250 215" />
                    </circle>
                    <circle r="3.5" fill="#3B82F6">
                        <animateMotion dur="3.5s" repeatCount="indefinite" path="M405 95 L250 215" />
                    </circle>
                    <circle r="3.5" fill="#10B981">
                        <animateMotion dur="3.2s" repeatCount="indefinite" path="M115 330 L250 215" />
                    </circle>
                    <circle r="3.5" fill="#6366F1">
                        <animateMotion dur="3.8s" repeatCount="indefinite" path="M390 330 L250 215" />
                    </circle>

                    <circle cx="95" cy="100" r="3" fill="#3B82F6" />
                    <circle cx="405" cy="95" r="3" fill="#3B82F6" />
                    <circle cx="115" cy="330" r="3" fill="#94A3B8" />
                    <circle cx="390" cy="330" r="3" fill="#94A3B8" />
                    <circle cx="250" cy="215" r="5" fill="#3B82F6" />
                </svg>

                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-blue-100 bg-white shadow-[0_10px_30px_rgba(37,99,235,0.12)] transition-all">
                    <div className="absolute inset-[-8px] animate-pulse rounded-full border border-blue-100 opacity-60" />
                    <LogoMark className="h-[56px] w-[56px]" />
                </div>

                <div className="absolute left-[6%] top-[15%] rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 shadow-sm">
                    <FingerprintIcon className="h-4 w-4 text-blue-600" />
                    <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500">SHA-256</div>
                    <div className="mt-1 text-[8px] text-slate-400">Integrity</div>
                </div>

                <div className="absolute right-[4%] top-[14%] rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 shadow-sm">
                    <BlocksIcon className="h-4 w-4 text-blue-600" />
                    <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500">Blockchain</div>
                    <div className="mt-1 text-[8px] text-slate-400">Proof record</div>
                </div>

                <div className="absolute bottom-[8%] left-[8%] rounded-xl border border-slate-200/80 bg-white px-3.5 py-3 shadow-sm">
                    <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                    <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500">Verified</div>
                    <div className="mt-1 text-[8px] text-slate-400">Authentic</div>
                </div>

                <div className="absolute bottom-[8%] right-[5%]">
                    <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white px-3 py-2 shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-emerald-700">
                            Trust network active
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign in — Pramaan" />

            <div
                className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
                    <section className="relative hidden overflow-hidden border-r border-slate-200 bg-[#f6f9fc] lg:flex lg:flex-col">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.5]"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
                                backgroundSize: '48px 48px',
                            }}
                        />
                        <div className="pointer-events-none absolute left-1/2 top-[-260px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />

                        <div className="relative z-10 flex h-[84px] items-center px-10 xl:px-14">
                            <Link href="/" className="flex items-center gap-3" aria-label="Pramaan home">
                                <LogoMark className="h-10 w-10" />
                                <div className="leading-none">
                                    <div className="text-[19px] font-bold tracking-[-0.035em] text-slate-950">
                                        Pramaan
                                    </div>
                                    <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Digital trust infrastructure
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="relative z-10 flex flex-1 flex-col justify-center px-10 pb-10 xl:px-14">
                            <div className="mx-auto w-full max-w-[620px]">
                                <div className="max-w-xl">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 shadow-sm">
                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" />
                                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-700">
                                            Secure access
                                        </span>
                                    </div>

                                    <h1 className="mt-6 text-[42px] font-extrabold leading-[1.04] tracking-[-0.05em] text-slate-950 xl:text-[52px]">
                                        Your certificate{' '}
                                        <span className="block text-blue-600">trust workspace.</span>
                                    </h1>

                                    <p className="mt-5 max-w-lg text-[13px] leading-7 text-slate-500">
                                        Manage certificate issuance, cryptographic proof records, blockchain anchoring and
                                        verification from one secure workspace.
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <TrustVisual />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 backdrop-blur">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <FingerprintIcon className="h-4 w-4" />
                                        </div>
                                        <p className="mt-3 text-[10px] font-bold text-slate-800">Integrity</p>
                                        <p className="mt-1 text-[9px] leading-4 text-slate-400">SHA-256 fingerprints</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 backdrop-blur">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <BlocksIcon className="h-4 w-4" />
                                        </div>
                                        <p className="mt-3 text-[10px] font-bold text-slate-800">Proof</p>
                                        <p className="mt-1 text-[9px] leading-4 text-slate-400">Blockchain records</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 backdrop-blur">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                            <ShieldCheckIcon className="h-4 w-4" />
                                        </div>
                                        <p className="mt-3 text-[10px] font-bold text-slate-800">Verification</p>
                                        <p className="mt-1 text-[9px] leading-4 text-slate-400">Public validation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between px-10 pb-8 text-[9px] text-slate-400 xl:px-14">
                            <span>Pramaan secure workspace</span>
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Systems operational</span>
                            </div>
                        </div>
                    </section>

                    <section className="relative flex min-h-screen flex-col bg-white">
                        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5 sm:px-8 lg:hidden">
                            <Link href="/" className="flex items-center gap-3" aria-label="Pramaan home">
                                <LogoMark className="h-9 w-9" />
                                <div className="text-[18px] font-bold tracking-[-0.03em] text-slate-950">
                                    Pramaan
                                </div>
                            </Link>
                            <Link
                                href="/"
                                className="text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-950"
                            >
                                Back to home
                            </Link>
                        </div>

                        <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 lg:px-12 xl:px-20">
                            <div className="w-full max-w-[430px]">
                                <div className="hidden lg:flex lg:justify-end">
                                    <Link
                                        href="/"
                                        className="group inline-flex items-center gap-2 text-[11px] font-semibold text-slate-400 transition-colors hover:text-slate-950"
                                    >
                                        Back to homepage
                                        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                <div className="mt-0 lg:mt-14">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                                        Welcome back
                                    </p>
                                    <h2 className="mt-3 text-[32px] font-extrabold tracking-[-0.045em] text-slate-950 sm:text-[36px]">
                                        Sign in to Pramaan
                                    </h2>
                                    <p className="mt-3 text-[13px] leading-6 text-slate-500">
                                        Access your organization workspace and certificate operations.
                                    </p>
                                </div>

                                {status && (
                                    <div className="mt-7 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                            <CheckIcon className="h-3.5 w-3.5" />
                                        </div>
                                        <p className="text-[11px] font-medium leading-5 text-emerald-700">{status}</p>
                                    </div>
                                )}

                                <form onSubmit={submit} className="mt-8" noValidate>
                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-[11px] font-semibold text-slate-700">
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                                                <MailIcon className="h-[17px] w-[17px]" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                autoComplete="username"
                                                autoFocus
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="name@organization.com"
                                                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:ring-4 ${
                                                    errors.email
                                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                                                }`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-[10px] font-medium text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center justify-between">
                                            <label htmlFor="password" className="block text-[11px] font-semibold text-slate-700">
                                                Password
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-[10px] font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-400">
                                                <LockIcon className="h-[17px] w-[17px]" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter your password"
                                                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:ring-4 ${
                                                    errors.password
                                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((value) => !value)}
                                                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-400 transition-colors hover:text-slate-700 focus:outline-none"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <EyeOffIcon className="h-[17px] w-[17px]" />
                                                ) : (
                                                    <EyeIcon className="h-[17px] w-[17px]" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-[10px] font-medium text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Remember Me Checkbox Row */}
                                    <div className="mt-5 flex items-center justify-between">
                                        <label className="flex items-center gap-2.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-[11px] font-medium text-slate-600">Remember me</span>
                                        </label>
                                    </div>

                                    {/* Submit Action Button */}
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-70"
                                        >
                                            {processing ? (
                                                <>
                                                    <SpinnerIcon className="h-4 w-4 text-white" />
                                                    <span>Signing in...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Sign in to workspace</span>
                                                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Register Page Redirect Link */}
                                    <div className="mt-6 text-center">
                                        <p className="text-[11px] text-slate-500">
                                            Don't have an organization workspace?{' '}
                                            <Link
                                                href={route('register')}
                                                className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                                            >
                                                Create account
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