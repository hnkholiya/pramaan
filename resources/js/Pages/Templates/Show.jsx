import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';

function LayoutTemplateIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <rect x="3.5" y="3.5" width="17" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="3.5" y="12" width="7.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <rect x="13" y="12" width="7.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function RulerIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <rect x="2.5" y="8" width="19" height="8" rx="1.5" transform="rotate(0 12 12)" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 8v3M9.5 8v2M13 8v3M16.5 8v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function OrientationIcon({ orientation }) {
    if (orientation === 'portrait') {
        return (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <rect x="6" y="2" width="12" height="20" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <rect x="2" y="6" width="20" height="12" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function LinkIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path
                d="M9.5 14.5 14.5 9.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
            <path
                d="M11 7.5 12.4 6.1a3.5 3.5 0 1 1 4.95 4.95L15.9 12.4M13 16.5l-1.4 1.4a3.5 3.5 0 1 1-4.95-4.95L8.1 11.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function AlertTriangleIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path
                d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M12 9v4.5M12 16.5h.008" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function LayersIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
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

function LayerElementIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 9.5h16M9.5 9.5V20" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

function CheckBadgeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
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

function EditIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path
                d="M4 20h4.2L18.6 9.6a1.5 1.5 0 0 0 0-2.12l-2.08-2.08a1.5 1.5 0 0 0-2.12 0L4 15.8V20Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="m13 6 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path
                d="M2.75 12S6 5.5 12 5.5 21.25 12 21.25 12 18 18.5 12 18.5 2.75 12 2.75 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function ArrowUpRightIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
            <path d="M7 17 17 7M8.5 7H17v8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Show({ template, has_been_used }) {
    const v = template.active_version
        ? template.versions.find((x) => x.id === template.active_version)
        : null;

    const isLandscape = template.orientation === 'landscape';
    const aspectRatio =
        template.canvas_width && template.canvas_height
            ? template.canvas_width / template.canvas_height
            : isLandscape
            ? 1.414
            : 0.707;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <img src="/pramaan.svg" alt="Pramaan" className="h-7 w-7 shrink-0" />
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold leading-tight tracking-tight text-gray-900">
                            {template.name}
                        </h2>
                        <p className="hidden text-sm text-gray-500 sm:block">
                            Template details, versions, and design actions.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={template.name} />

            <div className="min-h-screen bg-gray-50/60 py-8 font-sans antialiased sm:py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Preview panel */}
                        <div className="mb-8 lg:col-span-5 lg:mb-0 xl:col-span-4">
                            <div className="lg:sticky lg:top-8">
                                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                                    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/80 p-6 sm:p-10">
                                        <div
                                            className="flex w-full max-w-[280px] items-center justify-center rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]"
                                            style={{ aspectRatio: aspectRatio }}
                                        >
                                            <div className="flex flex-col items-center gap-2 px-6 text-center">
                                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900/5 text-gray-400">
                                                    <LayoutTemplateIcon />
                                                </span>
                                                <span className="text-xs font-medium text-gray-400">
                                                    {template.canvas_width}×{template.canvas_height}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 border-t border-gray-100 px-5 py-5 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                <RulerIcon />
                                                Canvas Size
                                            </span>
                                            <span className="text-xs font-semibold text-gray-700">
                                                {template.canvas_width} × {template.canvas_height}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                <OrientationIcon orientation={template.orientation} />
                                                Orientation
                                            </span>
                                            <span className="text-xs font-semibold capitalize text-gray-700">
                                                {template.orientation}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                <LinkIcon />
                                                Slug
                                            </span>
                                            <span className="max-w-[60%] truncate font-mono text-xs text-gray-500">
                                                {template.slug}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details panel */}
                        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
                            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
                                            <LayoutTemplateIcon />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {template.name}
                                            </h3>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                {template.description || 'No description provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={template.status} />
                                </div>

                                {has_been_used && (
                                    <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:mx-8">
                                        <span className="mt-0.5 shrink-0 text-amber-500">
                                            <AlertTriangleIcon />
                                        </span>
                                        <p className="text-sm leading-relaxed text-amber-800">
                                            This template has issued certificates. Editing it now
                                            creates a new immutable version; historical certificates
                                            keep their original layout.
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col gap-3 px-5 py-6 sm:flex-row sm:px-8">
                                    <Link
                                        href={route('organization.templates.editor', template.id)}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-gray-800"
                                    >
                                        <EditIcon />
                                        Open Editor
                                    </Link>
                                    
                                    <a
                                        href={route('organization.templates.preview', template.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50"
                                    >
                                        <EyeIcon />
                                        Preview PDF
                                        <ArrowUpRightIcon />
                                    </a>
                                </div>
                            </div>

                            {/* Versions */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
                                        <LayersIcon />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">Versions</h3>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            {template.versions.length}{' '}
                                            {template.versions.length === 1 ? 'version' : 'versions'} of
                                            this template
                                        </p>
                                    </div>
                                </div>

                                {template.versions.length === 0 ? (
                                    <div className="px-8 py-10 text-center text-sm text-gray-400">
                                        No versions have been created yet.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-50">
                                        {template.versions.map((ver) => (
                                            <li
                                                key={ver.id}
                                                className={
                                                    'flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-150 hover:bg-gray-50/70 sm:px-8 ' +
                                                    (ver.is_active ? 'bg-emerald-50/30' : '')
                                                }
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={
                                                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ' +
                                                            (ver.is_active
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-gray-100 text-gray-500')
                                                        }
                                                    >
                                                        v{ver.version}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">
                                                            Version {ver.version}
                                                        </p>
                                                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                                                            <LayerElementIcon />
                                                            {ver.snapshot?.elements?.length ?? 0} elements
                                                        </p>
                                                    </div>
                                                </div>

                                                {ver.is_active ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                        <CheckBadgeIcon />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-medium text-gray-400">
                                                        Inactive
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}