import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

/* -------------------------------------------------------------------------- */
/*  Icon components (inline SVGs – no external icon library dependency)       */
/*  All icons share the same stroke weight / viewBox conventions so they      */
/*  stay visually consistent wherever they're dropped in.                    */
/* -------------------------------------------------------------------------- */

function LogoMark({ className = 'h-10 w-10' }) {
    return (
        <img
            src="/pramaan.svg"
            alt="Pramaan"
            className={`${className} object-contain`}
        />
    );
}

function ArrowRight({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    );
}

function ArrowUpRight({ className = 'h-4 w-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10" />
        </svg>
    );
}

function ShieldCheck({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
        </svg>
    );
}

function FileIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );
}

function Fingerprint({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11m5.979-5.111A7.95 7.95 0 0112 5c4.418 0 8 3.582 8 8 0 .552-.056 1.09-.164 1.61m-4.043-8.874A3.996 3.996 0 0012 9"
            />
        </svg>
    );
}

function Blocks({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
        </svg>
    );
}

function QrCode({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
        </svg>
    );
}

function Menu({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function XIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

/* -------------------------------------------------------------------------- */
/*  ArchitectureConnector – vertical joining line between architecture rows   */
/* -------------------------------------------------------------------------- */

function ArchitectureConnector() {
    return (
        <div className="my-2 flex justify-center" aria-hidden="true">
            <div className="h-4 w-px bg-gradient-to-b from-slate-200 to-slate-300" />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Reveal – IntersectionObserver fade / slide-in animation                   */
/*  Respects prefers-reduced-motion and always cleans up its observer.        */
/* -------------------------------------------------------------------------- */

function Reveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;

        // Respect the user's motion preference: show content immediately
        // instead of animating it in.
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            setVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
            observer.disconnect();
        };
    }, []);

    const stateClasses = visible
        ? 'translate-y-0 opacity-100'
        : 'translate-y-8 opacity-0';

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${stateClasses} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  NetworkNode – individual labelled node in the Trust Network diagram       */
/* -------------------------------------------------------------------------- */

function NetworkNode({ icon: Icon, label, detail, align = 'left' }) {
    return (
        <div
            className={`flex items-center gap-2.5 ${
                align === 'right' ? 'flex-row-reverse text-right' : ''
            }`}
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.06)] backdrop-blur-sm ring-1 ring-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_8px_20px_rgba(37,99,235,0.16)]">
                <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-slate-700">
                    {label}
                </p>
                <p className="mt-1 text-[9px] leading-tight text-slate-400">
                    {detail}
                </p>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  TrustNetwork – central hero visual (document → hash → chain → verify)     */
/* -------------------------------------------------------------------------- */

function TrustNetwork() {
    return (
        <div className="relative mx-auto h-[420px] w-full max-w-[500px] sm:h-[480px]">
            {/* Outer rings */}
            <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/70 sm:h-[285px] sm:w-[285px]" />
            <div className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/80 bg-blue-50/30 sm:h-[180px] sm:w-[180px]" />

            {/* Connection paths joining each node to the centre */}
            <div className="absolute inset-0 opacity-50" aria-hidden="true">
                <svg className="h-full w-full" viewBox="0 0 610 560" fill="none">
                    <path d="M110 150 305 280 500 145" stroke="#CBD5E1" strokeWidth="1" />
                    <path d="M110 150 145 400 305 280" stroke="#CBD5E1" strokeWidth="1" />
                    <path d="M500 145 470 400 305 280" stroke="#CBD5E1" strokeWidth="1" />
                    <path d="M145 400 305 455 470 400" stroke="#CBD5E1" strokeWidth="1" />
                    <path d="M110 150 305 455 500 145" stroke="#E2E8F0" strokeWidth="1" />
                    <circle cx="110" cy="150" r="3" fill="#60A5FA" />
                    <circle cx="500" cy="145" r="3" fill="#60A5FA" />
                    <circle cx="145" cy="400" r="3" fill="#94A3B8" />
                    <circle cx="470" cy="400" r="3" fill="#94A3B8" />
                    <circle cx="305" cy="455" r="3" fill="#60A5FA" />
                </svg>
            </div>

            {/* Centre logo */}
            <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-32 sm:w-32">
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/10 motion-reduce:animate-none" />
                <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full border border-blue-200/80 bg-white/95 shadow-[0_20px_60px_rgba(37,99,235,0.14)] backdrop-blur-sm sm:h-[104px] sm:w-[104px]">
                    <LogoMark className="h-14 w-14 sm:h-16 sm:w-16" />
                </div>
            </div>

            {/* Nodes */}
            <div className="absolute left-[6%] top-[20%] sm:left-[8%]">
                <NetworkNode icon={FileIcon} label="DOCUMENT" detail="Original record" />
            </div>

            <div className="absolute right-[4%] top-[19%] sm:right-[6%]">
                <NetworkNode icon={Fingerprint} label="SHA-256" detail="Unique fingerprint" align="right" />
            </div>

            <div className="absolute bottom-[17%] left-[7%] sm:left-[9%]">
                <NetworkNode icon={Blocks} label="BLOCKCHAIN" detail="Proof record" />
            </div>

            <div className="absolute bottom-[17%] right-[6%] sm:right-[8%]">
                <NetworkNode icon={QrCode} label="VERIFY" detail="Public validation" align="right" />
            </div>

            {/* Status badge – top */}
            <div className="absolute left-1/2 top-[4%] -translate-x-1/2">
                <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/95 px-3 py-1.5 shadow-[0_4px_14px_rgba(16,185,129,0.14)] backdrop-blur-sm">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                        Proof verified
                    </span>
                </div>
            </div>

            {/* Label – bottom */}
            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2">
                <div className="whitespace-nowrap rounded-full border border-slate-200/80 bg-white/95 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400 shadow-sm backdrop-blur-sm">
                    Pramaan trust network
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  ArchitectureRow – single step in the verification architecture card       */
/* -------------------------------------------------------------------------- */

function ArchitectureRow({ icon: Icon, title, value, accent = false, success = false }) {
    let containerStyle = 'border-slate-200 bg-white hover:border-slate-300';
    if (accent) containerStyle = 'border-blue-200 bg-blue-50/60 hover:border-blue-300';
    if (success) containerStyle = 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300';

    let iconBoxStyle = 'bg-slate-100 text-slate-600';
    if (accent) iconBoxStyle = 'bg-blue-600 text-white';
    if (success) iconBoxStyle = 'bg-emerald-600 text-white';

    let valueStyle = 'text-slate-400';
    if (accent) valueStyle = 'text-blue-600';
    if (success) valueStyle = 'text-emerald-600';

    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-300 ${containerStyle}`}
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBoxStyle}`}>
                    <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-[10px] font-semibold tracking-tight text-slate-700">
                        {title}
                    </p>
                </div>
            </div>

            <span className={`shrink-0 font-mono text-[9px] font-semibold ${valueStyle}`}>
                {value}
            </span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Static content                                                            */
/*  Kept as plain data objects so copy can be edited in one place.            */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
    { href: '#product', label: 'Product' },
    { href: '#technology', label: 'Technology' },
    { href: '#how-it-works', label: 'How it works' },
];

const features = [
    {
        number: '01',
        icon: Fingerprint,
        title: 'Cryptographic identity',
        description:
            'Every certificate can be represented by a unique SHA-256 fingerprint, creating a precise digital identity for the document.',
    },
    {
        number: '02',
        icon: Blocks,
        title: 'Blockchain proof',
        description:
            'Certificate proofs can be anchored to blockchain infrastructure, creating a durable record that can be independently checked.',
    },
    {
        number: '03',
        icon: QrCode,
        title: 'Public verification',
        description:
            'Recipients can move from a certificate or QR code to a simple verification experience without needing platform access.',
    },
];

const workflow = [
    {
        number: '01',
        title: 'Create',
        description: 'Build certificate templates and prepare recipient information.',
        icon: FileIcon,
    },
    {
        number: '02',
        title: 'Generate',
        description: 'Create digital certificates with unique document fingerprints.',
        icon: Fingerprint,
    },
    {
        number: '03',
        title: 'Anchor',
        description: 'Record the certificate proof using blockchain infrastructure.',
        icon: Blocks,
    },
    {
        number: '04',
        title: 'Verify',
        description: 'Validate the certificate against its registered proof record.',
        icon: ShieldCheck,
    },
];

/* -------------------------------------------------------------------------- */
/*  Main Home component                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    /* Smooth-scroll for in-page anchor links + close mobile menu on navigate */
    useEffect(() => {
        const handleAnchorClick = (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMobileMenu();
        };

        document.addEventListener('click', handleAnchorClick);
        return () => {
            document.removeEventListener('click', handleAnchorClick);
        };
    }, [closeMobileMenu]);

    /* Close the mobile drawer with the Escape key for keyboard users */
    useEffect(() => {
        if (!mobileMenuOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closeMobileMenu();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen, closeMobileMenu]);

    /* Global smooth scroll behaviour (cleaned up on unmount) */
    useEffect(() => {
        const previousScrollBehavior = document.body.style.scrollBehavior;
        document.body.style.scrollBehavior = 'smooth';
        return () => {
            document.body.style.scrollBehavior = previousScrollBehavior;
        };
    }, []);

    const mobileMenuClasses = mobileMenuOpen
        ? 'max-h-[28rem] py-4 opacity-100'
        : 'max-h-0 overflow-hidden py-0 opacity-0';

    return (
        <>
            <Head title="Pramaan — Verifiable Digital Certificates" />

            <div
                className="min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
            >
                {/* ============================================================ */}
                {/*  HEADER                                                      */}
                {/* ============================================================ */}
                <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        {/* Brand */}
                        <Link
                            href="/"
                            aria-label="Pramaan home"
                            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
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

                        {/* Desktop nav */}
                        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
                            {NAV_LINKS.map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="text-[12px] font-medium text-slate-500 transition-colors duration-200 hover:text-slate-950 focus-visible:outline-none focus-visible:text-slate-950"
                                >
                                    {label}
                                </a>
                            ))}
                            <Link
                                href="/verify"
                                className="text-[12px] font-medium text-slate-500 transition-colors duration-200 hover:text-slate-950 focus-visible:outline-none focus-visible:text-slate-950"
                            >
                                Verify
                            </Link>
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
                                Get started
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((value) => !value)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 lg:hidden"
                                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-navigation"
                            >
                                {mobileMenuOpen ? <XIcon /> : <Menu />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile drawer */}
                    <div
                        id="mobile-navigation"
                        className={`border-t border-slate-200 bg-white px-5 transition-all duration-300 ease-out lg:hidden ${mobileMenuClasses}`}
                    >
                        <nav className="flex flex-col" aria-label="Mobile navigation">
                            {NAV_LINKS.map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="border-b border-slate-100 py-3 text-[13px] font-medium text-slate-600 transition-colors hover:text-slate-950"
                                >
                                    {label}
                                </a>
                            ))}
                            <Link
                                href="/verify"
                                onClick={closeMobileMenu}
                                className="border-b border-slate-100 py-3 text-[13px] font-medium text-slate-600 transition-colors hover:text-slate-950"
                            >
                                Verify
                            </Link>

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
                                    Get started
                                </Link>
                            </div>
                        </nav>
                    </div>
                </header>

                <main>
                    {/* ======================================================== */}
                    {/*  HERO                                                    */}
                    {/* ======================================================== */}
                    <section className="relative min-h-screen overflow-hidden bg-[#f8fafc] pt-[76px]">
                        {/* Background grid + glow */}
                        <div className="pointer-events-none absolute inset-0">
                            <div
                                className="absolute inset-0 opacity-[0.45]"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)',
                                    backgroundSize: '48px 48px',
                                }}
                            />
                            <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
                        </div>

                        <div className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                            <div className="grid w-full items-center gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-4">
                                <Reveal>
                                    <div className="max-w-2xl">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                                Verifiable digital certificate infrastructure
                                            </span>
                                        </div>

                                        <h1 className="mt-7 text-[46px] font-extrabold leading-[0.99] tracking-[-0.045em] text-slate-950 sm:text-6xl md:text-[68px] lg:text-[74px]">
                                            Trust your
                                            <span className="block text-blue-600">documents.</span>
                                            Prove their authenticity.
                                        </h1>

                                        <p className="mt-7 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-[16px] sm:leading-8">
                                            Pramaan gives digital certificates a cryptographic
                                            identity and a blockchain-backed proof record,
                                            making authenticity simple to verify.
                                        </p>

                                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                            <Link
                                                href="/register"
                                                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-[12px] font-bold text-white shadow-[0_10px_30px_rgba(15,23,42,0.14)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-[0_16px_36px_rgba(15,23,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] active:translate-y-0"
                                            >
                                                Start issuing
                                                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                            </Link>

                                            <Link
                                                href="/verify"
                                                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-[12px] font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] active:translate-y-0"
                                            >
                                                <ShieldCheck className="h-4 w-4 text-blue-600" />
                                                Verify a certificate
                                            </Link>
                                        </div>

                                        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-slate-200 pt-6">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                                                    <Fingerprint className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-500">SHA-256</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                                                    <Blocks className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-500">Blockchain backed</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                                                    <QrCode className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="text-[10px] font-semibold text-slate-500">QR verification</span>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal delay={180}>
                                    <TrustNetwork />
                                </Reveal>
                            </div>
                        </div>

                        {/* Bottom strip */}
                        <div className="relative border-t border-slate-200 bg-white/70">
                            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
                                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                    The infrastructure behind verifiable certificates
                                </span>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] font-semibold text-slate-400">
                                    <span>Issue</span>
                                    <span className="text-slate-200">/</span>
                                    <span>Fingerprint</span>
                                    <span className="text-slate-200">/</span>
                                    <span>Anchor</span>
                                    <span className="text-slate-200">/</span>
                                    <span>Verify</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ======================================================== */}
                    {/*  PRODUCT / WHY PRAMAAN                                   */}
                    {/* ======================================================== */}
                    <section id="product" className="scroll-mt-24 border-b border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
                            <Reveal>
                                <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-600">
                                            Why Pramaan
                                        </p>
                                        <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[48px]">
                                            Trust built into
                                            <span className="block text-slate-400">every certificate.</span>
                                        </h2>
                                    </div>
                                    <p className="max-w-xl text-[14px] leading-7 text-slate-500 lg:ml-auto">
                                        Pramaan combines document fingerprinting, blockchain
                                        infrastructure and public verification into a single
                                        certificate trust layer.
                                    </p>
                                </div>
                            </Reveal>

                            <div className="mt-14 grid gap-4 md:grid-cols-3">
                                {features.map(({ number, icon: Icon, title, description }, index) => (
                                    <Reveal key={number} delay={index * 100}>
                                        <article className="group h-full rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition-colors duration-300 group-hover:bg-blue-600">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className="font-mono text-[10px] font-bold text-slate-300">
                                                    {number}
                                                </span>
                                            </div>

                                            <h3 className="mt-8 text-[15px] font-bold tracking-[-0.015em] text-slate-950">
                                                {title}
                                            </h3>

                                            <p className="mt-3 text-[12px] leading-6 text-slate-500">
                                                {description}
                                            </p>

                                            <div className="mt-8 h-px w-10 bg-slate-200 transition-all duration-500 group-hover:w-20 group-hover:bg-blue-500" />
                                        </article>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ======================================================== */}
                    {/*  TECHNOLOGY                                              */}
                    {/* ======================================================== */}
                    <section id="technology" className="scroll-mt-24 border-b border-slate-200 bg-slate-50">
                        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
                            <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
                                <Reveal>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-600">
                                            Technology
                                        </p>
                                        <h2 className="mt-4 max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[48px]">
                                            Proof is stronger
                                            <span className="block text-slate-400">than a promise.</span>
                                        </h2>
                                        <p className="mt-5 max-w-xl text-[13px] leading-7 text-slate-500">
                                            A certificate should not depend solely on the
                                            issuer's database. Pramaan connects the document to
                                            cryptographic and blockchain-backed proof that can be
                                            independently checked.
                                        </p>

                                        <div className="mt-9 grid max-w-xl gap-3 sm:grid-cols-2">
                                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                                                <Fingerprint className="h-5 w-5 text-blue-600" />
                                                <p className="mt-5 text-[12px] font-bold text-slate-950">
                                                    Document fingerprint
                                                </p>
                                                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                                                    A deterministic cryptographic representation of
                                                    the document.
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
                                                <Blocks className="h-5 w-5 text-blue-600" />
                                                <p className="mt-5 text-[12px] font-bold text-slate-950">
                                                    Blockchain proof
                                                </p>
                                                <p className="mt-2 text-[10px] leading-5 text-slate-500">
                                                    A durable proof record designed for independent
                                                    verification.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal delay={150}>
                                    <div className="relative">
                                        <div className="absolute -inset-8 rounded-full bg-blue-100/50 blur-3xl" />
                                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
                                            <div className="border-b border-slate-200 px-5 py-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                        Verification architecture
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-600">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Active
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 sm:p-7">
                                                <ArchitectureRow icon={FileIcon} title="Digital document" value="Certificate.pdf" />
                                                <ArchitectureConnector />
                                                <ArchitectureRow icon={Fingerprint} title="Cryptographic fingerprint" value="SHA-256" accent />
                                                <ArchitectureConnector />
                                                <ArchitectureRow icon={Blocks} title="Proof record" value="Arbitrum" />
                                                <ArchitectureConnector />
                                                <ArchitectureRow icon={ShieldCheck} title="Verification" value="Authentic" success />
                                            </div>

                                            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] text-slate-400">Proof status</span>
                                                    <span className="text-[9px] font-bold text-emerald-600">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>

                    {/* ======================================================== */}
                    {/*  HOW IT WORKS                                            */}
                    {/* ======================================================== */}
                    <section id="how-it-works" className="scroll-mt-24 border-b border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
                            <Reveal>
                                <div className="max-w-2xl">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-600">
                                        How it works
                                    </p>
                                    <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] text-slate-950 sm:text-4xl lg:text-[48px]">
                                        One workflow.
                                        <span className="block text-slate-400">One verifiable record.</span>
                                    </h2>
                                    <p className="mt-4 text-[13px] leading-7 text-slate-500">
                                        From certificate creation to public verification, every
                                        step fits into one structured lifecycle.
                                    </p>
                                </div>
                            </Reveal>

                            <div className="relative mt-14">
                                <div
                                    className="absolute left-[12%] right-[12%] top-5 hidden h-px bg-slate-200 lg:block"
                                    aria-hidden="true"
                                />
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    {workflow.map(({ number, title, description, icon: Icon }, index) => (
                                        <Reveal key={number} delay={index * 90}>
                                            <article className="relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg lg:border-transparent lg:bg-transparent lg:shadow-none">
                                                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                                                    <Icon className="h-[17px] w-[17px]" />
                                                </div>
                                                <div className="mt-7">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-[9px] font-bold text-blue-600">
                                                            {number}
                                                        </span>
                                                        <h3 className="text-[14px] font-bold text-slate-950">
                                                            {title}
                                                        </h3>
                                                    </div>
                                                    <p className="mt-3 text-[11px] leading-6 text-slate-500">
                                                        {description}
                                                    </p>
                                                </div>
                                            </article>
                                        </Reveal>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ======================================================== */}
                    {/*  CTA                                                     */}
                    {/* ======================================================== */}
                    <section className="relative overflow-hidden bg-slate-950">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
                            <div
                                className="absolute inset-0 opacity-[0.08]"
                                style={{
                                    backgroundImage:
                                        'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                                    backgroundSize: '48px 48px',
                                }}
                            />
                        </div>

                        <Reveal>
                            <div className="relative mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-28">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>

                                <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.18em] text-blue-300">
                                    Build trust into every certificate
                                </p>

                                <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-[1.1] tracking-[-0.045em] text-white sm:text-4xl lg:text-[52px]">
                                    Make authenticity
                                    <span className="block text-slate-500">easy to prove.</span>
                                </h2>

                                <p className="mx-auto mt-5 max-w-xl text-[13px] leading-7 text-slate-400">
                                    Issue secure digital certificates and give recipients a
                                    straightforward way to verify them.
                                </p>

                                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                                    <Link
                                        href="/register"
                                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-[12px] font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] active:translate-y-0"
                                    >
                                        Get started
                                        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href="/verify"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-6 text-[12px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] active:translate-y-0"
                                    >
                                        Verify a certificate
                                    </Link>
                                </div>
                            </div>
                        </Reveal>
                    </section>
                </main>

                {/* ============================================================ */}
                {/*  FOOTER                                                      */}
                {/* ============================================================ */}
                <footer className="border-t border-slate-800 bg-slate-950">
                    <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
                        <Link
                            href="/"
                            aria-label="Pramaan home"
                            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                        >
                            <LogoMark className="h-9 w-9" />
                            <div className="leading-none">
                                <div className="text-[17px] font-bold tracking-[-0.03em] text-white">
                                    Pramaan
                                </div>
                                <div className="mt-1 text-[7px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                    Digital trust infrastructure
                                </div>
                            </div>
                        </Link>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-medium text-slate-600">
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
                                Register
                            </Link>
                            <span>© {new Date().getFullYear()} Pramaan</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}