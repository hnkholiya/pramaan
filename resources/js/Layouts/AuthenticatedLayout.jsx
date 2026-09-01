import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function DashboardIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]">
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13" y="3.5" width="7.5" height="4.75" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13" y="10.75" width="7.5" height="9.75" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
            <rect x="3.5" y="13.5" width="7.5" height="7" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function TemplateIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]">
            <rect x="3.5" y="3.5" width="17" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
            <rect x="3.5" y="12" width="7.5" height="8.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13" y="12" width="7.5" height="8.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function BatchesIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]">
            <path
                d="m12 3.5 8.25 4.5L12 12.5 3.75 8 12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="m3.75 12 8.25 4.5L20.25 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m3.75 16 8.25 4.5L20.25 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CertificateIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]">
            <rect x="3.5" y="4" width="17" height="12" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9.5 19.5 10.75 16.5M14.5 19.5 13.25 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function PaymentsIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]">
            <rect x="2.75" y="5.5" width="18.5" height="13" rx="2.25" stroke="currentColor" strokeWidth="1.6" />
            <path d="M2.75 9.75h18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M6 14.25h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function AdminIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]">
            <path
                d="M12 3.5c2.28 1.4 4.4 2 6.75 2v6.1c0 4.53-2.86 7.53-6.75 8.9-3.89-1.37-6.75-4.37-6.75-8.9V5.5c2.35 0 4.47-.6 6.75-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ChevronDownIcon({ className = 'h-4 w-4' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
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

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path
                d="M15.5 8V6.5A2.5 2.5 0 0 0 13 4H7a2.5 2.5 0 0 0-2.5 2.5v11A2.5 2.5 0 0 0 7 20h6a2.5 2.5 0 0 0 2.5-2.5V16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M9.5 12h10.25M17 8.75 20.25 12 17 15.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
}

function NavItem({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={
                'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ' +
                (active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900')
            }
        >
            <span className={active ? 'text-gray-900' : 'text-gray-400 transition-colors duration-150 group-hover:text-gray-600'}>
                {icon}
            </span>
            {children}
            <span
                className={
                    'pointer-events-none absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-gray-900 transition-opacity duration-150 ' +
                    (active ? 'opacity-100' : 'opacity-0')
                }
            />
        </Link>
    );
}

function MobileNavItem({ href, active, icon, children }) {
    return (
        <Link
            href={href}
            className={
                'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-150 ' +
                (active ? 'bg-gray-900/5 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
            }
        >
            <span className={active ? 'text-gray-900' : 'text-gray-400'}>{icon}</span>
            {children}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [usePage().url]);

    const navItems = [
        {
            key: 'dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: <DashboardIcon />,
            label: 'Dashboard',
            show: true,
        },
        {
            key: 'templates',
            href: route('organization.templates.index'),
            active: route().current('organization.templates*'),
            icon: <TemplateIcon />,
            label: 'Templates',
            show: user.has_organization,
        },
        {
            key: 'batches',
            href: route('organization.batches.index'),
            active: route().current('organization.batches*'),
            icon: <BatchesIcon />,
            label: 'Batches',
            show: user.has_organization,
        },
        {
            key: 'certificates',
            href: route('organization.certificates.index'),
            active: route().current('organization.certificates*'),
            icon: <CertificateIcon />,
            label: 'Certificates',
            show: user.has_organization,
        },
        {
            key: 'payments',
            href: route('organization.payments.index'),
            active: route().current('organization.payments*'),
            icon: <PaymentsIcon />,
            label: 'Payments',
            show: user.has_organization,
        },
        {
            key: 'admin',
            href: route('admin.dashboard'),
            active: route().current('admin.*'),
            icon: <AdminIcon />,
            label: 'Admin',
            show: user.has_organization && user.is_admin,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/60 font-sans antialiased">
            <nav className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Brand */}
                        <div className="flex min-w-0 items-center gap-8">
                            <Link href="/" className="flex shrink-0 items-center gap-3">
                                {/* Background container removed, logo size increased to h-7 w-7 */}
                                <img src="/pramaan.svg" alt="Pramaan" className="h-10 w-10 shrink-0" />
                                <span className="hidden text-[15px] font-semibold tracking-tight text-gray-900 sm:block">
                                    Pramaan
                                </span>
                            </Link>

                            {/* Desktop nav */}
                            <div className="hidden lg:flex lg:items-center lg:gap-1">
                                {navItems
                                    .filter((item) => item.show)
                                    .map((item) => (
                                        <NavItem key={item.key} href={item.href} active={item.active} icon={item.icon}>
                                            {item.label}
                                        </NavItem>
                                    ))}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            {/* Profile dropdown - desktop/tablet */}
                            <div className="relative hidden sm:block" ref={profileRef}>
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen((prev) => !prev)}
                                    className={
                                        'flex items-center gap-2.5 rounded-lg border px-2 py-1.5 pr-3 text-left transition-colors duration-150 ' +
                                        (profileOpen
                                            ? 'border-gray-200 bg-gray-50'
                                            : 'border-transparent hover:border-gray-200 hover:bg-gray-50')
                                    }
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                                        {getInitials(user.name)}
                                    </span>
                                    <span className="hidden min-w-0 flex-col leading-tight md:flex">
                                        <span className="max-w-[140px] truncate text-sm font-medium text-gray-900">
                                            {user.name}
                                        </span>
                                        <span className="max-w-[140px] truncate text-xs text-gray-400">
                                            {user.email}
                                        </span>
                                    </span>
                                    <ChevronDownIcon
                                        className={
                                            'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-150 ' +
                                            (profileOpen ? 'rotate-180' : '')
                                        }
                                    />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-lg shadow-gray-900/5">
                                        <div className="border-b border-gray-100 px-3 py-2.5">
                                            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="truncate text-xs text-gray-400">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900"
                                            >
                                                <UserIcon />
                                                Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
                                            >
                                                <LogoutIcon />
                                                Log Out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <button
                                type="button"
                                onClick={() => setMobileOpen((prev) => !prev)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                                aria-label="Toggle navigation menu"
                            >
                                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile drawer */}
                <div
                    className={
                        'overflow-hidden border-t border-gray-100 bg-white transition-[max-height] duration-200 ease-out lg:hidden ' +
                        (mobileOpen ? 'max-h-[calc(100vh-4rem)] overflow-y-auto' : 'max-h-0')
                    }
                >
                    <div className="space-y-1 px-4 py-4">
                        {navItems
                            .filter((item) => item.show)
                            .map((item) => (
                                <MobileNavItem key={item.key} href={item.href} active={item.active} icon={item.icon}>
                                    {item.label}
                                </MobileNavItem>
                            ))}
                    </div>

                    <div className="border-t border-gray-100 px-4 py-4">
                        <div className="flex items-center gap-3 px-1 pb-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                                {getInitials(user.name)}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="truncate text-xs text-gray-400">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <MobileNavItem href={route('profile.edit')} active={route().current('profile.edit')} icon={<UserIcon />}>
                                Profile
                            </MobileNavItem>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
                            >
                                <LogoutIcon />
                                Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-gray-200/80 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}