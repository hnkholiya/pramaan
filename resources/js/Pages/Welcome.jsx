import { Head, Link } from '@inertiajs/react';
console.log("Welcome  Page here !!")

function ShieldIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M12 3L19 6V11.2C19 15.45 16.32 19.15 12 21C7.68 19.15 5 15.45 5 11.2V6L12 3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path
                d="M8.5 12L10.75 14.25L15.5 9.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DocumentIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M6.5 3.5H14L18 7.5V20.5H6.5V3.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path
                d="M14 3.5V7.5H18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <path
                d="M9 12H16M9 15.5H14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function LinkIcon({ className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M9.5 14.5L14.5 9.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
            <path
                d="M8.25 17.5H6.75C4.54 17.5 2.75 15.71 2.75 13.5C2.75 11.29 4.54 9.5 6.75 9.5H10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
            <path
                d="M14 6.5H17.25C19.46 6.5 21.25 8.29 21.25 10.5C21.25 12.71 19.46 14.5 17.25 14.5H15.75"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CheckIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M5 12.5L9.25 16.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowRightIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M13 6L19 12L13 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ArrowUpRightIcon({ className = 'h-4 w-4' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M7 17L17 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M8 7H17V16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PramaanLogo() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950">
                <ShieldIcon className="h-[19px] w-[19px] text-white" />
            </div>

            <div className="leading-none">
                <div className="text-[18px] font-bold tracking-[-0.025em] text-slate-950">
                    Pramaan
                </div>

                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Document verification
                </div>
            </div>
        </div>
    );
}

function VerificationPreview() {
    return (
        <div className="relative w-full">
            <div className="absolute -inset-5 rounded-[32px] bg-slate-200/50 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.10)]">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                            <DocumentIcon className="h-[18px] w-[18px]" />
                        </div>

                        <div>
                            <div className="text-[12px] font-semibold text-slate-900">
                                Academic Certificate
                            </div>

                            <div className="mt-0.5 text-[10px] text-slate-400">
                                PDF document
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        <span className="text-[10px] font-semibold text-emerald-700">
                            Verified
                        </span>
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-start justify-between gap-5">
                            <div>
                                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                    Verification result
                                </div>

                                <div className="mt-2 text-[16px] font-semibold tracking-[-0.015em] text-slate-950">
                                    Document integrity confirmed
                                </div>

                                <p className="mt-2 max-w-[300px] text-[11px] leading-5 text-slate-500">
                                    The submitted document matches its registered
                                    proof record.
                                </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600">
                                <ShieldIcon className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <span className="text-[10px] text-slate-400">
                                    Proof status
                                </span>

                                <span className="text-[10px] font-semibold text-slate-700">
                                    Valid
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <span className="text-[10px] text-slate-400">
                                    Document integrity
                                </span>

                                <span className="text-[10px] font-semibold text-emerald-700">
                                    Unchanged
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">
                                    Verification
                                </span>

                                <span className="text-[10px] font-semibold text-slate-700">
                                    Successful
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                                Proof fingerprint
                            </span>

                            <span className="font-mono text-[9px] text-slate-400">
                                SHA-256
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white px-3.5 py-3 font-mono text-[9px] leading-5 text-slate-500">
                            8a91c4e7d21f0b53c6a84d91e2f7b308
                            <br />
                            14b8f0a6c31d95e7426ab18f9c4d207e
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <div className="text-[9px] text-slate-400">
                                Proof created
                            </div>

                            <div className="mt-1 text-[11px] font-semibold text-slate-800">
                                31 Aug 2026
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                            <div className="text-[9px] text-slate-400">
                                Record
                            </div>

                            <div className="mt-1 text-[11px] font-semibold text-slate-800">
                                PRM-8A2F
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-950 px-5 py-3.5 sm:px-6">
                    <span className="text-[9px] font-medium text-slate-400">
                        Pramaan proof record
                    </span>

                    <span className="text-[9px] font-semibold text-white">
                        Integrity verified
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function Welcome({ auth }) {
    const primaryHref = auth.user
        ? route('dashboard')
        : route('register');

    return (
        <>
            <Head title="Pramaan — Verifiable Document Integrity" />

            <div
                className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased"
                style={{
                    fontFamily:
                        "'Inter', ui-sans-serif, system-ui, sans-serif",
                }}
            >
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        <Link href="/" aria-label="Pramaan home">
                            <PramaanLogo />
                        </Link>

                        <nav
                            className="hidden items-center gap-8 md:flex"
                            aria-label="Main navigation"
                        >
                            <a
                                href="#how-it-works"
                                className="text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-950"
                            >
                                How it works
                            </a>

                            <a
                                href="#security"
                                className="text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-950"
                            >
                                Security
                            </a>
                        </nav>

                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                >
                                    Dashboard
                                    <ArrowUpRightIcon />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="hidden h-10 items-center rounded-lg px-3.5 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
                                    >
                                        Sign in
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                    >
                                        Get started
                                        <ArrowUpRightIcon />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    <section className="border-b border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
                            <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                                        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                                            Verifiable document infrastructure
                                        </span>
                                    </div>

                                    <h1 className="mt-6 text-[42px] font-extrabold leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[62px]">
                                        Trust every document.
                                        <span className="block text-slate-400">
                                            Verify every proof.
                                        </span>
                                    </h1>

                                    <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-[17px]">
                                        Pramaan creates verifiable proof for
                                        digital documents, helping organizations
                                        establish authenticity and detect
                                        unauthorized changes.
                                    </p>

                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            href={primaryHref}
                                            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                                        >
                                            {auth.user
                                                ? 'Open dashboard'
                                                : 'Create your proof'}
                                            <ArrowRightIcon />
                                        </Link>

                                        <a
                                            href="#how-it-works"
                                            className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-[13px] font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                                        >
                                            See how it works
                                        </a>
                                    </div>

                                    <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6">
                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                            <CheckIcon className="h-3.5 w-3.5 text-slate-700" />
                                            Tamper-evident
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                            <CheckIcon className="h-3.5 w-3.5 text-slate-700" />
                                            Independently verifiable
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                            <CheckIcon className="h-3.5 w-3.5 text-slate-700" />
                                            Built for scale
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-auto w-full max-w-[540px] lg:ml-auto">
                                    <VerificationPreview />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="security"
                        className="border-b border-slate-200 bg-slate-50"
                    >
                        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
                            <div className="max-w-2xl">
                                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                                    Designed for trust
                                </div>

                                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                                    Verification without unnecessary
                                    complexity.
                                </h2>
                            </div>

                            <div className="mt-10 grid gap-4 md:grid-cols-3">
                                <div className="rounded-xl border border-slate-200 bg-white p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                                        <ShieldIcon />
                                    </div>

                                    <h3 className="mt-6 text-[14px] font-bold text-slate-950">
                                        Integrity protection
                                    </h3>

                                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                                        Establish a durable proof that can reveal
                                        whether a document has been altered.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                                        <LinkIcon />
                                    </div>

                                    <h3 className="mt-6 text-[14px] font-bold text-slate-950">
                                        Verifiable records
                                    </h3>

                                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                                        Connect documents to proof records that
                                        can be validated when authenticity
                                        matters.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                                        <DocumentIcon />
                                    </div>

                                    <h3 className="mt-6 text-[14px] font-bold text-slate-950">
                                        Simple experience
                                    </h3>

                                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                                        Keep verification understandable for
                                        organizations, reviewers, and end users.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="how-it-works"
                        className="border-b border-slate-200 bg-white"
                    >
                        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                            <div className="max-w-2xl">
                                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                                    How it works
                                </div>

                                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                                    From document to proof in three steps.
                                </h2>

                                <p className="mt-4 text-[13px] leading-6 text-slate-500">
                                    A straightforward verification flow backed
                                    by a structured proof record.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-5 md:grid-cols-3">
                                <div className="rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
                                            <DocumentIcon className="h-[18px] w-[18px]" />
                                        </div>

                                        <span className="font-mono text-[10px] font-semibold text-slate-300">
                                            01
                                        </span>
                                    </div>

                                    <h3 className="mt-7 text-[14px] font-bold text-slate-950">
                                        Register
                                    </h3>

                                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                                        Create a proof from the original digital
                                        document.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
                                            <LinkIcon className="h-[18px] w-[18px]" />
                                        </div>

                                        <span className="font-mono text-[10px] font-semibold text-slate-300">
                                            02
                                        </span>
                                    </div>

                                    <h3 className="mt-7 text-[14px] font-bold text-slate-950">
                                        Anchor
                                    </h3>

                                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                                        Associate the proof with its verifiable
                                        record.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
                                            <ShieldIcon className="h-[18px] w-[18px]" />
                                        </div>

                                        <span className="font-mono text-[10px] font-semibold text-slate-300">
                                            03
                                        </span>
                                    </div>

                                    <h3 className="mt-7 text-[14px] font-bold text-slate-950">
                                        Verify
                                    </h3>

                                    <p className="mt-2 text-[12px] leading-6 text-slate-500">
                                        Compare the document against its
                                        registered proof.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-950">
                        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-14">
                            <div className="max-w-2xl">
                                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                    Pramaan
                                </div>

                                <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
                                    Make document authenticity easier to
                                    trust.
                                </h2>

                                <p className="mt-3 max-w-xl text-[12px] leading-6 text-slate-400">
                                    Build a reliable verification layer for the
                                    documents your organization depends on.
                                </p>
                            </div>

                            <Link
                                href={primaryHref}
                                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[13px] font-semibold text-slate-950 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
                            >
                                {auth.user ? 'Open dashboard' : 'Get started'}
                                <ArrowUpRightIcon />
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="bg-white">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-[10px] text-slate-400 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
                        <PramaanLogo />

                        <div className="text-left md:text-right">
                            Verifiable document integrity
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}