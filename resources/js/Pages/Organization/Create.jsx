import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

function BuildingIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path
                d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14 10h5a1 1 0 0 1 1 1v10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M4 21h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M7.5 7.5h1.5M7.5 11h1.5M7.5 14.5h1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M17.5 13.5h1M17.5 17h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="m4.5 7 6.65 5.05a1.5 1.5 0 0 0 1.8 0L19.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path
                d="M6.5 4h2.2a1 1 0 0 1 .95.68l1.02 3.03a1 1 0 0 1-.3 1.06l-1.4 1.24a11.5 11.5 0 0 0 5.02 5.02l1.24-1.4a1 1 0 0 1 1.06-.3l3.03 1.02a1 1 0 0 1 .68.95v2.2a1 1 0 0 1-1.08 1A16 16 0 0 1 5.5 5.08 1 1 0 0 1 6.5 4Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MapPinIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path
                d="M12 21s-7-6.13-7-11.25a7 7 0 1 1 14 0C19 14.87 12 21 12 21Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="9.75" r="2.25" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function GlobeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3.75 12h16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path
                d="M12 3.75c2.2 2.2 3.35 5.1 3.35 8.25s-1.15 6.05-3.35 8.25c-2.2-2.2-3.35-5.1-3.35-8.25S9.8 5.95 12 3.75Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ShieldCheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path
                d="M12 3.5c2.28 1.4 4.4 2 6.75 2v6.1c0 4.53-2.86 7.53-6.75 8.9-3.89-1.37-6.75-4.37-6.75-8.9V5.5c2.35 0 4.47-.6 6.75-2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9.25 12.25 11 14l3.75-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SpinnerIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

function ArrowRightIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="M4.5 12h15M13.5 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function FieldShell({ icon, label, htmlFor, required, hint, error, children }) {
    return (
        <div>
            <div className="flex items-baseline justify-between">
                <InputLabel htmlFor={htmlFor} value={label} className="flex items-center gap-1.5 text-sm font-medium text-gray-700" />
                {required ? (
                    <span className="text-xs font-medium text-gray-400">Required</span>
                ) : (
                    <span className="text-xs text-gray-400">Optional</span>
                )}
            </div>
            <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </span>
                {children}
            </div>
            {hint && !error ? <p className="mt-1.5 text-xs text-gray-400">{hint}</p> : null}
            <InputError message={error} className="mt-1.5" />
        </div>
    );
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        website: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('organization.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <img src="/pramaan.svg" alt="Pramaan" className="h-7 w-7 shrink-0" />
                    <div>
                        <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
                            Create Organization
                        </h2>
                        <p className="hidden text-sm text-gray-500 sm:block">
                            Set up your organization profile to get started with Pramaan.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Create Organization" />

            <div className="min-h-screen bg-gray-50/60 py-8 font-sans antialiased sm:py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                        {/* Intro / trust panel */}
                        <div className="mb-8 lg:col-span-4 lg:mb-0 xl:col-span-4">
                            <div className="lg:sticky lg:top-8">
                                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                                    <div className="bg-gray-900 px-6 py-8">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                                            <img src="/pramaan.svg" alt="" className="h-6 w-6 brightness-0 invert" />
                                        </div>
                                        <h3 className="mt-5 text-lg font-semibold text-white">
                                            Welcome to Pramaan
                                        </h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-gray-300">
                                            Organizations are the foundation of your workspace — every credential,
                                            member, and record lives inside one.
                                        </p>
                                    </div>

                                    <div className="space-y-4 px-6 py-6">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900/5 text-gray-700">
                                                <BuildingIcon />
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Single source of truth</p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                                                    All your organization's activity is scoped to this profile.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900/5 text-gray-700">
                                                <ShieldCheckIcon />
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Secure by default</p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                                                    Your details are encrypted and only visible to your team.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900/5 text-gray-700">
                                                <ArrowRightIcon />
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Takes under a minute</p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                                                    You can update these details anytime from settings.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-8 xl:col-span-8">
                            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                                <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
                                        <BuildingIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">
                                            Organization Details
                                        </h3>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            Tell us a little about the organization you're setting up.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={submit} noValidate>
                                    <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
                                        {/* Basic info */}
                                        <div className="space-y-5">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Basic Information
                                            </p>

                                            <FieldShell
                                                icon={<BuildingIcon />}
                                                label="Organization Name"
                                                htmlFor="name"
                                                required
                                                error={errors.name}
                                            >
                                                <TextInput
                                                    id="name"
                                                    className="block w-full rounded-lg border-gray-300 pl-10 text-sm shadow-sm transition-colors duration-150 focus:border-gray-900 focus:ring-gray-900"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Acme Corporation"
                                                    required
                                                />
                                            </FieldShell>
                                        </div>

                                        <div className="h-px bg-gray-100" />

                                        {/* Contact info */}
                                        <div className="space-y-5">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Contact Information
                                            </p>

                                            <div className="grid gap-5 sm:grid-cols-2">
                                                <FieldShell
                                                    icon={<MailIcon />}
                                                    label="Email"
                                                    htmlFor="email"
                                                    error={errors.email}
                                                >
                                                    <TextInput
                                                        id="email"
                                                        type="email"
                                                        className="block w-full rounded-lg border-gray-300 pl-10 text-sm shadow-sm transition-colors duration-150 focus:border-gray-900 focus:ring-gray-900"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        placeholder="contact@organization.com"
                                                    />
                                                </FieldShell>

                                                <FieldShell
                                                    icon={<PhoneIcon />}
                                                    label="Phone"
                                                    htmlFor="phone"
                                                    error={errors.phone}
                                                >
                                                    <TextInput
                                                        id="phone"
                                                        className="block w-full rounded-lg border-gray-300 pl-10 text-sm shadow-sm transition-colors duration-150 focus:border-gray-900 focus:ring-gray-900"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        placeholder="+1 (555) 000-0000"
                                                    />
                                                </FieldShell>
                                            </div>

                                            <FieldShell
                                                icon={<MapPinIcon />}
                                                label="Address"
                                                htmlFor="address"
                                                error={errors.address}
                                            >
                                                <textarea
                                                    id="address"
                                                    rows={3}
                                                    className="block w-full resize-none rounded-lg border-gray-300 pl-10 pt-2.5 text-sm shadow-sm transition-colors duration-150 focus:border-gray-900 focus:ring-gray-900"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    placeholder="Street, city, state, postal code"
                                                />
                                            </FieldShell>
                                        </div>

                                        <div className="h-px bg-gray-100" />

                                        {/* Online presence */}
                                        <div className="space-y-5">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Online Presence
                                            </p>

                                            <FieldShell
                                                icon={<GlobeIcon />}
                                                label="Website"
                                                htmlFor="website"
                                                error={errors.website}
                                                hint="Include the full URL, e.g. https://yourorganization.com"
                                            >
                                                <TextInput
                                                    id="website"
                                                    className="block w-full rounded-lg border-gray-300 pl-10 text-sm shadow-sm transition-colors duration-150 focus:border-gray-900 focus:ring-gray-900"
                                                    value={data.website}
                                                    onChange={(e) => setData('website', e.target.value)}
                                                    placeholder="https://yourorganization.com"
                                                />
                                            </FieldShell>
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse items-center gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-5 sm:flex-row sm:justify-between sm:px-8">
                                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <ShieldCheckIcon />
                                            Your information is encrypted and stored securely.
                                        </p>

                                        <PrimaryButton
                                            disabled={processing}
                                            className="flex w-full items-center justify-center gap-2 !bg-gray-900 px-6 py-2.5 text-sm font-medium tracking-wide transition-all duration-150 hover:!bg-gray-800 disabled:opacity-60 sm:w-auto"
                                        >
                                            {processing ? (
                                                <>
                                                    <SpinnerIcon />
                                                    Creating Organization…
                                                </>
                                            ) : (
                                                <>
                                                    Create Organization
                                                    <ArrowRightIcon />
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}