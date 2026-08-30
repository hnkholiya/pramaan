import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import { useState } from 'react';

export default function Index({ templates }) {
    const [showAiModal, setShowAiModal] = useState(false);

    const {
    data,
    setData,
    post,
    delete: destroy,
    processing,
    errors,
    reset,
} = useForm({
    prompt: '',
});

    const openAiModal = () => {
        reset();
        setShowAiModal(true);
    };

    const closeAiModal = () => {
        if (!processing) {
            reset();
            setShowAiModal(false);
        }
    };

    const generateWithAi = (e) => {
        e.preventDefault();

        post(route('organization.templates.generate-ai'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowAiModal(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Certificate Templates
                </h2>
            }
        >
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                        <p className="text-sm text-slate-500">
                            Design reusable certificate layouts with versioning.
                        </p>

                        <div className="flex flex-wrap gap-2">

                            {/* AI Generator */}
                            <button
                                type="button"
                                onClick={openAiModal}
                                className="inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                            >
                                ✨ Generate with AI
                            </button>

                            {/* Manual template */}
                            <Link
                                href={route('organization.templates.create')}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                + New Template
                            </Link>

                            {/* Upload */}
                            <Link
                                href={route('organization.templates.upload')}
                                className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Upload Template
                            </Link>
                        </div>
                    </div>

                    {/* Template list */}
                    {templates.length === 0 ? (
                        <div className="rounded-xl bg-white p-10 text-center text-sm text-slate-400 shadow">
                            No templates yet. Create your first certificate template.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {templates.map((t) => (
                                <div
                                    key={t.id}
                                    className="rounded-xl border border-slate-100 bg-white p-5 shadow"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {t.name}
                                            </h3>

                                            <p className="text-xs text-slate-400">
                                                {t.slug}
                                            </p>
                                        </div>

                                        <StatusBadge status={t.status} />
                                    </div>

                                    <div className="mt-3 text-sm text-slate-500">
                                        {t.versions_count} version(s)
                                        {' · '}
                                        active v{t.active_version || '—'}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Link
                                            href={route(
                                                'organization.templates.editor',
                                                t.id
                                            )}
                                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                                        >
                                            Edit
                                        </Link>

                                        <Link
                                            href={route(
                                                'organization.templates.show',
                                                t.id
                                            )}
                                            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            Details
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                confirm('Delete this template?') &&
                                                destroy(
                                                    route(
                                                        'organization.templates.destroy',
                                                        t.id
                                                    )
                                                )
                                            }
                                            disabled={processing}
                                            className="rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* AI Generator Modal */}
            {showAiModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

                        {/* Modal header */}
                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    ✨ Generate Certificate with AI
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Describe the certificate design you want.
                                    Gemini will create the layout for you.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeAiModal}
                                disabled={processing}
                                className="text-2xl leading-none text-slate-400 hover:text-slate-700 disabled:opacity-40"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={generateWithAi}
                            className="px-6 py-6"
                        >
                            <label
                                htmlFor="ai-prompt"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Describe your certificate
                            </label>

                            <textarea
                                id="ai-prompt"
                                rows={7}
                                value={data.prompt}
                                onChange={(e) =>
                                    setData('prompt', e.target.value)
                                }
                                disabled={processing}
                                placeholder="Example: Create a professional landscape certificate for a Blockchain Basics course. Use a navy and gold style. Include recipient name, course, date, certificate number, verification URL and QR code."
                                className="mt-2 block w-full rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 disabled:bg-slate-100"
                            />

                            {errors.prompt && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.prompt}
                                </p>
                            )}

                            <div className="mt-4 rounded-lg bg-violet-50 p-4 text-sm text-violet-900">
                                <p className="font-medium">
                                    AI will create:
                                </p>

                                <p className="mt-1">
                                    A structured certificate layout using your
                                    organization's existing template system.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeAiModal}
                                    disabled={processing}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        data.prompt.trim().length < 10
                                    }
                                    className="inline-flex items-center rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="mr-2 h-4 w-4 animate-spin"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                />
                                            </svg>

                                            Generating...
                                        </>
                                    ) : (
                                        '✨ Generate Template'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}