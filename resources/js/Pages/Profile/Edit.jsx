import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

function ProfileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path
                d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.5 20.25c0-3.728 3.358-6.75 7.5-6.75s7.5 3.022 7.5 6.75"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PasswordIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <rect x="4.5" y="10.5" width="15" height="9.75" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 10.5V7.75a4 4 0 1 1 8 0v2.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="15" r="1.4" fill="currentColor" />
        </svg>
    );
}

function DangerIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="M12 9v4.5M12 16.5h.008" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const sections = [
    {
        id: 'profile-information',
        title: 'Profile Information',
        description: 'Your name, email address, and account verification status.',
        icon: <ProfileIcon />,
    },
    {
        id: 'update-password',
        title: 'Password',
        description: 'Use a long, unique password to keep your account secure.',
        icon: <PasswordIcon />,
    },
    {
        id: 'delete-account',
        title: 'Danger Zone',
        description: 'Permanently delete your account and all associated data.',
        icon: <DangerIcon />,
        danger: true,
    },
];

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <img src="/pramaan.svg" alt="Pramaan" className="h-7 w-7 shrink-0" />
                    <div>
                        <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
                            Account Settings
                        </h2>
                        <p className="hidden text-sm text-gray-500 sm:block">
                            Manage your profile, security, and account preferences.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="min-h-screen bg-gray-50/60 py-8 font-sans antialiased sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                        <aside className="mb-8 lg:col-span-4 lg:mb-0 xl:col-span-3">
                            <div className="lg:sticky lg:top-8">
                                <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900">
                                            <img src="/pramaan.svg" alt="" className="h-6 w-6 brightness-0 invert" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Pramaan</p>
                                            <p className="text-xs text-gray-500">Account &amp; Security</p>
                                        </div>
                                    </div>

                                    <nav className="mt-6 space-y-1">
                                        {sections.map((section) => (
                                            <a
                                                key={section.id}
                                                href={'#' + section.id}
                                                className={
                                                    'group flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 ' +
                                                    (section.danger
                                                        ? 'text-red-600 hover:bg-red-50'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                                                }
                                            >
                                                <span
                                                    className={
                                                        'mt-0.5 shrink-0 ' +
                                                        (section.danger
                                                            ? 'text-red-500'
                                                            : 'text-gray-400 group-hover:text-gray-700')
                                                    }
                                                >
                                                    {section.icon}
                                                </span>
                                                <span>
                                                    <span
                                                        className={
                                                            'block font-medium ' +
                                                            (section.danger ? 'text-red-600' : 'text-gray-900')
                                                        }
                                                    >
                                                        {section.title}
                                                    </span>
                                                    <span className="mt-0.5 hidden text-xs text-gray-400 xl:block">
                                                        {section.description}
                                                    </span>
                                                </span>
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </aside>

                        <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                            <section
                                id="profile-information"
                                className="scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
                                        <ProfileIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">Profile Information</h3>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            Your name, email address, and account verification status.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-5 py-6 sm:px-8 sm:py-8">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </div>
                            </section>

                            <section
                                id="update-password"
                                className="scroll-mt-24 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
                                        <PasswordIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">Password</h3>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            Use a long, unique password to keep your account secure.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-5 py-6 sm:px-8 sm:py-8">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </div>
                            </section>

                            <section
                                id="delete-account"
                                className="scroll-mt-24 overflow-hidden rounded-2xl border border-red-200/70 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4 border-b border-red-100 bg-red-50/40 px-5 py-5 sm:px-8 sm:py-6">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                        <DangerIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-red-700">Danger Zone</h3>
                                        <p className="mt-0.5 text-sm text-red-500/80">
                                            Permanently delete your account and all associated data.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-5 py-6 sm:px-8 sm:py-8">
                                    <DeleteUserForm className="max-w-xl" />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}