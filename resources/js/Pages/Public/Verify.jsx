
import { useCallback, useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

/* -------------------------------------------------------------------------- */
/*  Icon components (inline SVGs). Stroke weight aligned to 2 to match the    */
/*  icon language used on the marketing site (Home.jsx) so the two pages      */
/*  feel like one product rather than two different builds.                   */
/* -------------------------------------------------------------------------- */

function SearchIcon({ className = 'h-5 w-5' }) {
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
            <circle cx="11" cy="11" r="7" />
            <path d="m16.5 16.5 4 4" />
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3.5 19 6.2v5.2c0 4.2-2.7 7.6-7 9.1-4.3-1.5-7-4.9-7-9.1V6.2L12 3.5Z" />
            <path d="m9 12 2 2 4-4" />
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
            <path d="M7 9.5A5.5 5.5 0 0 1 12 7a5.5 5.5 0 0 1 5.5 5.5c0 3.6-.9 6-2 7.5" />
            <path d="M5 12a7 7 0 0 1 14 0c0 2.1-.2 4-.7 5.5" />
            <path d="M9 12a3 3 0 0 1 6 0c0 3.6-.7 6.4-1.5 8" />
            <path d="M11 12a1 1 0 0 1 2 0c0 2.8-.4 5-1 6.5" />
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3.5" y="4.5" width="6" height="6" rx="1.5" />
            <rect x="14.5" y="13.5" width="6" height="6" rx="1.5" />
            <path d="M9.5 7.5h3.5a3.5 3.5 0 0 1 3.5 3.5v2.5" />
            <path d="M14.5 16.5h-3.5a3.5 3.5 0 0 1-3.5-3.5v-2.5" />
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
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m5 13 4 4L19 7" />
        </svg>
    );
}

function XIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}

function MenuIcon({ className = 'h-5 w-5' }) {
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
            <path d="M4 6h16M4 12h16M4 18h16" />
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14" />
            <path d="m13 5 7 7-7 7" />
        </svg>
    );
}

function ExternalLinkIcon({ className = 'h-4 w-4' }) {
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
            <path d="M14 4h6v6" />
            <path d="m20 4-9 9" />
            <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
        </svg>
    );
}

function CopyIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function SpinnerIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={`${className} animate-spin`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
            />
            <path
                className="opacity-90"
                d="M22 12a10 10 0 0 1-10 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

/* -------------------------------------------------------------------------- */
/*  Site navigation — shared shape with Home.jsx                              */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/verify', label: 'Verify' },
];

function CheckRow({ label, valid }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3.5 last:border-0">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                        valid
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                    }`}
                >
                    {valid ? (
                        <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                        <XIcon className="h-3.5 w-3.5" />
                    )}
                </div>

                <span className="text-xs font-medium text-slate-700">
                    {label}
                </span>
            </div>

            <span
                className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                    valid
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                }`}
            >
                {valid ? 'Valid' : 'Invalid'}
            </span>
        </div>
    );
}

function CertificateDetails({ data }) {
    const recipient = data.recipient || {};
    const name = recipient.recipient_name || recipient.name || '';

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Certificate Details
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                <DetailItem
                    label="Certificate Number"
                    value={data.certificate_number}
                />

                <DetailItem
                    label="Recipient Name"
                    value={name}
                />

                <DetailItem
                    label="Issuing Organization"
                    value={data.organization?.name}
                />

                <DetailItem
                    label="Issuance Date"
                    value={
                        data.issued_at
                            ? new Date(data.issued_at).toLocaleDateString(
                                  'en-US',
                                  {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                  }
                              )
                            : '-'
                    }
                />

                {data.transaction_hash && (
                    <div className="border-t border-slate-100 pt-2 sm:col-span-2">
                        <div className="space-y-2.5">
                            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Blockchain Transaction Hash
                            </span>

                            <span className="block break-all rounded-lg border border-slate-200/60 bg-slate-50 p-2 font-mono text-xs leading-relaxed text-slate-600">
                                {data.transaction_hash}
                            </span>

                            <div className="flex flex-wrap items-center gap-2">
                                <a
                                    href={`https://sepolia.arbiscan.io/tx/${encodeURIComponent(
                                        data.transaction_hash
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/40 hover:text-slate-950 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2"
                                >
                                    <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                                    <span>View on Arbiscan</span>
                                </a>

                                <CopyButton value={data.transaction_hash} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </span>

            <span className="mt-1 block truncate text-sm font-medium text-slate-900">
                {value || '-'}
            </span>
        </div>
    );
}

function CopyButton({ value }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:self-center"
        >
            {copied ? (
                <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
                <CopyIcon className="h-3.5 w-3.5 text-slate-400" />
            )}

            {copied ? 'Copied' : 'Copy Hash'}
        </button>
    );
}

function Checks({ checks }) {
    return (
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Cryptographic Integrity Checks
                </h3>

                <FingerprintIcon className="h-4 w-4 text-slate-400" />
            </div>

            <div className="px-5 py-2">
                <CheckRow
                    label="Certificate status active"
                    valid={checks.status?.valid}
                />

                <CheckRow
                    label="Document hash integrity (SHA-256)"
                    valid={checks.document_integrity?.valid}
                />

                <CheckRow
                    label="Merkle tree proof validation"
                    valid={checks.merkle_proof?.valid}
                />

                <CheckRow
                    label="Decentralized blockchain anchor"
                    valid={checks.blockchain_anchor?.valid}
                />
            </div>
        </div>
    );
}

function TrustBadge({ icon, title, subtitle }) {
    return (
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 text-center shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                {icon}
            </div>

            <p className="text-xs font-semibold text-slate-900">
                {title}
            </p>

            <p className="text-[10px] text-slate-500">
                {subtitle}
            </p>
        </div>
    );
}

export default function Verify({ result }) {
    /*
     * Supports:
     * 1. Direct /verify usage with an empty field.
     * 2. Existing verification URLs such as /verify?number=...
     * 3. Returning verification results containing the certificate number.
     */
    const [number, setNumber] = useState(() => {
        const resultNumber = result?.data?.certificate_number;

        if (resultNumber) {
            return resultNumber;
        }

        if (typeof window !== 'undefined') {
            return (
                new URLSearchParams(window.location.search).get('number') ||
                ''
            );
        }

        return '';
    });

    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const closeMobileMenu = useCallback(
        () => setMobileMenuOpen(false),
        []
    );

    /*
     * Keep the input synchronized when Inertia supplies a verification
     * result after a lookup.
     */
    useEffect(() => {
        const verifiedNumber = result?.data?.certificate_number;

        if (verifiedNumber) {
            setNumber(verifiedNumber);
        }
    }, [result?.data?.certificate_number]);

    /*
     * Read an existing ?number=... value when arriving from another page.
     * This does not perform verification by itself; the existing Verify
     * action remains responsible for submitting the lookup.
     */
    useEffect(() => {
        const resultNumber = result?.data?.certificate_number;

        if (resultNumber || typeof window === 'undefined') {
            return;
        }

        const queryNumber =
            new URLSearchParams(window.location.search).get('number');

        if (queryNumber) {
            setNumber(queryNumber);
        }
    }, [result?.data?.certificate_number]);

    /* Track scroll position so the fixed header can intensify its glass effect. */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24);

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Close the mobile drawer with Escape for keyboard users. */
    useEffect(() => {
        if (!mobileMenuOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen, closeMobileMenu]);

    const lookup = (e) => {
        e.preventDefault();

        const value = number.trim();

        if (!value || loading) {
            return;
        }

        /*
         * Existing verification route and request mechanism are preserved.
         */
        router.visit(
            `${route('public.verify')}?number=${encodeURIComponent(value)}`,
            {
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            }
        );
    };

    const mobileMenuClasses = mobileMenuOpen
        ? 'max-h-64 py-4 opacity-100'
        : 'max-h-0 overflow-hidden py-0 opacity-0';

    const hasSuccessfulResult = Boolean(result?.valid);

    return (
        <>
            <Head title="Verify Certificate — Pramaan" />

            <div
                className="flex min-h-screen flex-col justify-between bg-[#f8fafc] text-slate-900 antialiased selection:bg-blue-600 selection:text-white"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                {/* ============================================================ */}
                {/* HEADER                                                        */}
                {/* ============================================================ */}
                <header
                    className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500 ease-out ${
                        scrolled
                            ? 'border-slate-200/70 bg-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-2xl backdrop-saturate-150'
                            : 'border-slate-200/80 bg-white/90 shadow-none backdrop-blur-xl'
                    }`}
                >
                    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        <Link
                            href="/"
                            aria-label="Pramaan home"
                            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            <img
                                src="/pramaan.svg"
                                alt="Pramaan"
                                className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="leading-none">
                                <div className="text-[19px] font-bold tracking-[-0.035em] text-slate-950">
                                    Pramaan
                                </div>

                                <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Digital trust infrastructure
                                </div>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <nav
                            className="hidden items-center gap-2 lg:flex"
                            aria-label="Primary navigation"
                        >
                            {NAV_LINKS.map(({ href, label }) => {
                                const isActive = href === '/verify';

                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        aria-current={
                                            isActive ? 'page' : undefined
                                        }
                                        className={`rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* CTA + mobile toggle */}
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="hidden h-10 items-center rounded-lg px-3.5 text-[12px] font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:inline-flex"
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/register"
                                className="hidden h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-[12px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] sm:inline-flex"
                            >
                                Create account
                                <ArrowRightIcon className="h-3.5 w-3.5" />
                            </Link>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenuOpen((value) => !value)
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 lg:hidden"
                                aria-label={
                                    mobileMenuOpen
                                        ? 'Close navigation menu'
                                        : 'Open navigation menu'
                                }
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-navigation"
                            >
                                {mobileMenuOpen ? (
                                    <XIcon />
                                ) : (
                                    <MenuIcon />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile drawer */}
                    <div
                        id="mobile-navigation"
                        className={`border-t border-slate-200/70 bg-white/70 px-5 backdrop-blur-2xl transition-all duration-300 ease-out lg:hidden ${mobileMenuClasses}`}
                    >
                        <nav
                            className="flex flex-col"
                            aria-label="Mobile navigation"
                        >
                            {NAV_LINKS.map(({ href, label }) => {
                                const isActive = href === '/verify';

                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={closeMobileMenu}
                                        aria-current={
                                            isActive ? 'page' : undefined
                                        }
                                        className={`border-b border-slate-100 py-3 text-[13px] font-medium transition-colors ${
                                            isActive
                                                ? 'text-blue-700'
                                                : 'text-slate-600 hover:text-slate-950'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}

                            <div className="flex gap-2 pt-4">
                                <Link
                                    href="/login"
                                    className="flex h-10 flex-1 items-center justify-center rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                    Sign in
                                </Link>

                                <Link
                                    href="/register"
                                    className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-950 text-[12px] font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
                                >
                                    Create account
                                </Link>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* ============================================================ */}
                {/* MAIN CONTENT                                                  */}
                {/* ============================================================ */}
                <main className="flex-grow pt-[76px]">
                    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">

                            {/* Left Column: Form & Context */}
                            <div className="space-y-6 lg:sticky lg:top-[104px] lg:col-span-5">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                        Public Trust Gateway
                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                        Verify a certificate with absolute certainty.
                                    </h1>

                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                        Validate official academic or professional credentials instantly using decentralized verification and cryptographic proofs.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                                    <form
                                        onSubmit={lookup}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label
                                                htmlFor="certificate-number"
                                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
                                            >
                                                Certificate Number
                                            </label>

                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                    <SearchIcon className="h-4 w-4" />
                                                </div>

                                                <input
                                                    id="certificate-number"
                                                    type="text"
                                                    value={number}
                                                    onChange={(e) =>
                                                        setNumber(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g. CERT-2026-9482"
                                                    autoFocus
                                                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!number.trim() || loading}
                                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-xs transition-all hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <SpinnerIcon className="h-4 w-4" />
                                                    Verifying…
                                                </>
                                            ) : (
                                                <>
                                                    {hasSuccessfulResult
                                                        ? 'Verify again'
                                                        : 'Verify Certificate'}
                                                    <ArrowRightIcon className="h-4 w-4" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-5 flex items-start gap-2.5 border-t border-slate-100 pt-4">
                                        <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                                        <p className="text-xs leading-normal text-slate-500">
                                            Find the unique serial reference printed on the bottom right corner of the document.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <TrustBadge
                                        icon={<FingerprintIcon />}
                                        title="SHA-256"
                                        subtitle="Integrity"
                                    />

                                    <TrustBadge
                                        icon={<BlocksIcon />}
                                        title="Merkle"
                                        subtitle="Proof"
                                    />

                                    <TrustBadge
                                        icon={<ShieldCheckIcon />}
                                        title="Chain"
                                        subtitle="Anchored"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Dynamic Results Area */}
                            <div className="lg:col-span-7">
                                {!result && (
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center shadow-xs sm:p-12">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <SearchIcon className="h-6 w-6" />
                                        </div>

                                        <h3 className="text-lg font-semibold text-slate-900">
                                            Awaiting verification input
                                        </h3>

                                        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
                                            Enter a valid certificate number on the left panel to load integrity data and blockchain verification signals.
                                        </p>
                                    </div>
                                )}

                                {result && result.valid && (
                                    <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-xs">
                                        <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/60 p-6 sm:p-8">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                                                <CheckIcon className="h-6 w-6" />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                                                        Status Verified
                                                    </span>

                                                    <span className="inline-flex items-center rounded border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                                                        Authentic
                                                    </span>
                                                </div>

                                                <h2 className="mt-1 text-xl font-bold text-emerald-950">
                                                    This certificate is officially valid
                                                </h2>

                                                <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">
                                                    {result.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 sm:p-8">
                                            <CertificateDetails
                                                data={result.data}
                                            />

                                            {result.checks && (
                                                <Checks
                                                    checks={result.checks}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {result && !result.valid && (
                                    <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-xs">
                                        <div className="flex items-start gap-4 border-b border-rose-100 bg-rose-50/60 p-6 sm:p-8">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
                                                <XIcon className="h-6 w-6" />
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                                                    Verification Failed
                                                </span>

                                                <h2 className="mt-1 text-xl font-bold text-rose-950">
                                                    Certificate could not be verified
                                                </h2>

                                                <p className="mt-1 text-xs leading-relaxed text-rose-800/80">
                                                    {result.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-5 p-6 sm:p-8">
                                            {result.data && (
                                                <CertificateDetails
                                                    data={result.data}
                                                />
                                            )}

                                            {result.checks && (
                                                <Checks
                                                    checks={result.checks}
                                                />
                                            )}

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                                                    Troubleshooting Tips
                                                </h4>

                                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                                    Check for typographical errors or accidental spacing. Make sure you are using the reference string assigned directly to the original PDF or print format.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* ============================================================ */}
                {/* FOOTER                                                       */}
                {/* ============================================================ */}
                <footer className="border-t border-slate-800 bg-slate-950">
                    <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                        <Link
                            href="/"
                            aria-label="Pramaan home"
                            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        >
                            <img
                                src="/pramaan.svg"
                                alt="Pramaan"
                                className="h-9 w-9 object-contain"
                            />

                            <div>
                                <p className="text-sm font-bold tracking-tight text-white">
                                    Pramaan
                                </p>

                                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    Digital trust infrastructure
                                </p>
                            </div>
                        </Link>

                        <nav
                            className="flex items-center gap-5 text-xs font-medium text-slate-500"
                            aria-label="Footer navigation"
                        >
                            <Link
                                href="/"
                                className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:text-slate-300"
                            >
                                Home
                            </Link>

                            <Link
                                href="/verify"
                                className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:text-slate-300"
                            >
                                Verify
                            </Link>

                            <Link
                                href="/login"
                                className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:text-slate-300"
                            >
                                Sign in
                            </Link>

                            <Link
                                href="/register"
                                className="transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:text-slate-300"
                            >
                                Create account
                            </Link>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
}

