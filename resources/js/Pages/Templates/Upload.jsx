import { useState, useRef } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

function UploadCloudIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7">
            <path
                d="M7.5 18.5A4.5 4.5 0 0 1 6.6 9.6a5.5 5.5 0 0 1 10.73-1.9A4.75 4.75 0 0 1 17 18.5H7.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M12 14.5V9M12 9l-2.25 2.25M12 9l2.25 2.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path
                d="M7 3.5h7.17a1 1 0 0 1 .7.3l3.83 3.83a1 1 0 0 1 .3.7V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function TagIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path
                d="M11.5 3.5H6a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 .44 1.06l8 8a1.5 1.5 0 0 0 2.12 0l5.5-5.5a1.5 1.5 0 0 0 0-2.12l-8-8a1.5 1.5 0 0 0-1.06-.44Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="8.75" cy="8.75" r="1.15" fill="currentColor" />
        </svg>
    );
}

function AlignLeftIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="M4.5 6.5h15M4.5 11h10M4.5 15.5h13M4.5 20h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function LandscapeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-8">
            <rect x="1.5" y="4.5" width="21" height="15" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function PortraitIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-6">
            <rect x="4.5" y="1.5" width="15" height="21" rx="1.75" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function CheckCircleIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="m8.25 12.25 2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function AlertIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 8v4.5M12 15.5h.008" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

function ArrowLeftIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="M19.5 12h-15M9.5 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.svg'];
const ACCEPTED_ATTR = ACCEPTED_EXTENSIONS.join(',');

export default function Upload() {
    const { data, setData, post, processing, errors, progress } = useForm({
        name: '',
        description: '',
        orientation: 'landscape',
        file: null,
    });

    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const submit = (event) => {
        event.preventDefault();

        post(route('organization.templates.upload.store'), {
            forceFormData: true,
        });
    };

    const handleFileSelect = (file) => {
        if (file) {
            setData('file', file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const removeFile = () => {
        setData('file', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const canSubmit = !processing && data.file && data.name;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <img src="/pramaan.svg" alt="Pramaan" className="h-7 w-7 shrink-0" />
                    <div>
                        <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
                            Upload Template
                        </h2>
                        <p className="hidden text-sm text-gray-500 sm:block">
                            Add a new certificate design to your template library.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Upload Template" />

            <div className="min-h-screen bg-gray-50/60 py-8 font-sans antialiased sm:py-12">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                        <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-8 sm:py-6">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900/5 text-gray-700">
                                <UploadCloudIcon />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">
                                    Upload Your Template
                                </h3>
                                <p className="mt-0.5 text-sm text-gray-500">
                                    Upload an existing certificate design and use it as the base
                                    for your Pramaan template.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} noValidate>
                            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
                                {/* Name */}
                                <div>
                                    <div className="flex items-baseline justify-between">
                                        <label
                                            htmlFor="name"
                                            className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
                                        >
                                            Template Name
                                        </label>
                                        <span className="text-xs font-medium text-gray-400">Required</span>
                                    </div>
                                    <div className="relative mt-1.5">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            <TagIcon />
                                        </span>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. University Completion Certificate"
                                            className="block w-full rounded-lg border-gray-300 pl-10 text-sm shadow-sm transition-colors duration-150 focus:border-gray-900 focus:ring-gray-900"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                                            <AlertIcon />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="flex items-baseline justify-between">
                                        <label
                                            htmlFor="description"
                                            className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
                                        >
                                            Description
                                        </label>
                                        <span className="text-xs text-gray-400">Optional</span>
                                    </div>
                                    <div className="relative mt-1.5">
                                        <span className="pointer-events-none absolute left-3 top-3 text-gray-400">
                                            <AlignLeftIcon />
                                        </span>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            placeholder="Describe this certificate template..."
                                            className="block w-full resize-none rounded-lg border-gray-300 pl-10 pt-2.5 text-sm shadow-sm transition-colors duration-150 focus:border-gray-900 focus:ring-gray-900"
                                        />
                                    </div>
                                    {errors.description && (
                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                                            <AlertIcon />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Orientation */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Orientation</label>
                                    <div className="mt-1.5 grid grid-cols-2 gap-3">
                                        {[
                                            { value: 'landscape', label: 'Landscape', icon: <LandscapeIcon /> },
                                            { value: 'portrait', label: 'Portrait', icon: <PortraitIcon /> },
                                        ].map((option) => {
                                            const selected = data.orientation === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setData('orientation', option.value)}
                                                    aria-pressed={selected}
                                                    className={
                                                        'flex flex-col items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-all duration-150 ' +
                                                        (selected
                                                            ? 'border-gray-900 bg-gray-900/5 text-gray-900 shadow-sm'
                                                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50')
                                                    }
                                                >
                                                    <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
                                                        {option.icon}
                                                    </span>
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.orientation && (
                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                                            <AlertIcon />
                                            {errors.orientation}
                                        </p>
                                    )}
                                </div>

                                {/* File upload */}
                                <div>
                                    <div className="flex items-baseline justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                            Certificate Design
                                        </label>
                                        <span className="text-xs font-medium text-gray-400">Required</span>
                                    </div>

                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                fileInputRef.current?.click();
                                            }
                                        }}
                                        className={
                                            'mt-1.5 cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-150 ' +
                                            (isDragging
                                                ? 'border-gray-900 bg-gray-900/5'
                                                : errors.file
                                                ? 'border-red-300 bg-red-50/40'
                                                : 'border-gray-200 bg-gray-50/40 hover:border-gray-300 hover:bg-gray-50')
                                        }
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept={ACCEPTED_ATTR}
                                            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                                            className="hidden"
                                        />

                                        {!data.file ? (
                                            <>
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-100">
                                                    <UploadCloudIcon />
                                                </div>
                                                <p className="mt-3 text-sm font-medium text-gray-700">
                                                    <span className="text-gray-900 underline decoration-gray-300 underline-offset-2">
                                                        Click to upload
                                                    </span>{' '}
                                                    or drag and drop
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    PDF, PNG, JPG, JPEG, or SVG — up to 10 MB
                                                </p>
                                            </>
                                        ) : (
                                            <div
                                                className="flex items-center justify-between gap-3 rounded-lg bg-white px-4 py-3 text-left shadow-sm ring-1 ring-gray-100"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                        <CheckCircleIcon />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                            {data.file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {formatBytes(data.file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeFile}
                                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-600"
                                                    aria-label="Remove file"
                                                >
                                                    <XIcon />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2 flex items-center gap-1.5">
                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                            <FileIcon />
                                            Supported: {ACCEPTED_EXTENSIONS.join(', ')} · Maximum 10 MB
                                        </span>
                                    </div>

                                    {errors.file && (
                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
                                            <AlertIcon />
                                            {errors.file}
                                        </p>
                                    )}
                                </div>

                                {/* Upload progress */}
                                {progress && (
                                    <div>
                                        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                                            <span className="flex items-center gap-1.5 font-medium text-gray-700">
                                                <SpinnerIcon />
                                                Uploading…
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {progress.percentage}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="h-full rounded-full bg-gray-900 transition-all duration-300 ease-out"
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col-reverse items-center gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-5 sm:flex-row sm:justify-between sm:px-8">
                                <Link
                                    href={route('organization.templates.index')}
                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 sm:w-auto"
                                >
                                    <ArrowLeftIcon />
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {processing ? (
                                        <>
                                            <SpinnerIcon />
                                            Uploading…
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloudIcon />
                                            Upload Template
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}