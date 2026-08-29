import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Upload() {
    const { data, setData, post, processing, errors, progress } = useForm({
        name: '',
        description: '',
        orientation: 'landscape',
        file: null,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('organization.templates.upload.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Upload Template
                </h2>
            }
        >
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Upload Your Template
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Upload an existing certificate design and use
                                it as the base for your Pramaan template.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Template Name
                                </label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g. University Completion Certificate"
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                    rows={4}
                                    placeholder="Describe this certificate template..."
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />

                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Orientation
                                </label>

                                <select
                                    value={data.orientation}
                                    onChange={(e) =>
                                        setData(
                                            'orientation',
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="landscape">
                                        Landscape
                                    </option>

                                    <option value="portrait">
                                        Portrait
                                    </option>
                                </select>

                                {errors.orientation && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.orientation}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Certificate Design
                                </label>

                                <div className="mt-2 rounded-lg border-2 border-dashed border-slate-300 p-6">
                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg,.svg"
                                        onChange={(e) =>
                                            setData(
                                                'file',
                                                e.target.files?.[0] ?? null
                                            )
                                        }
                                        className="block w-full text-sm text-slate-600"
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        Supported: PDF, PNG, JPG, JPEG, SVG.
                                        Maximum size: 10 MB.
                                    </p>

                                    {data.file && (
                                        <p className="mt-3 text-sm text-slate-700">
                                            Selected:{' '}
                                            <span className="font-medium">
                                                {data.file.name}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {errors.file && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.file}
                                    </p>
                                )}
                            </div>

                            {progress && (
                                <div>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Uploading...</span>
                                        <span>{progress.percentage}%</span>
                                    </div>

                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-600"
                                            style={{
                                                width: `${progress.percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <a
                                    href={route(
                                        'organization.templates.index'
                                    )}
                                    className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50"
                                >
                                    Cancel
                                </a>

                                <button
                                    type="submit"
                                    disabled={
                                        processing || !data.file || !data.name
                                    }
                                    className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Uploading...'
                                        : 'Upload Template'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}