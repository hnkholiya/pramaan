import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        orientation: 'landscape',
        canvas_width: 1200,
        canvas_height: 850,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('organization.templates.store'));
    };

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Page Header */}
                <div className="border-b border-gray-200 bg-white shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-4">
                            <Link 
                                href={route('organization.templates.index')}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Create New Template</h1>
                                <p className="mt-2 text-gray-600">Design a new certificate template from scratch or start with the editor.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
                            <form onSubmit={submit} className="space-y-8">
                                {/* Template Name */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                        <InputLabel htmlFor="name" value="Template Name" className="text-base font-semibold" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Give your template a unique, descriptive name.</p>
                                    <TextInput 
                                        id="name" 
                                        placeholder="e.g., Blockchain Basics Certificate"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)} 
                                        required 
                                    />
                                    <InputError message={errors.name} className="mt-3" />
                                </div>

                                {/* Description */}
                                <div className="border-t border-gray-100 pt-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <InputLabel htmlFor="description" value="Description (optional)" className="text-base font-semibold" />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">Add notes about the certificate design or purpose.</p>
                                    <textarea 
                                        id="description" 
                                        placeholder="E.g., Landscape certificate for online course completion, includes QR code for verification..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                                        rows={4}
                                        value={data.description} 
                                        onChange={(e) => setData('description', e.target.value)} 
                                    />
                                    <InputError message={errors.description} className="mt-3" />
                                </div>

                                {/* Canvas Settings */}
                                <div className="border-t border-gray-100 pt-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                                        </svg>
                                        <h3 className="text-base font-semibold text-gray-900">Canvas Settings</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-6">Configure the certificate page dimensions and orientation.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <InputLabel value="Orientation" className="font-medium" />
                                            <select 
                                                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                                value={data.orientation} 
                                                onChange={(e) => setData('orientation', e.target.value)}
                                            >
                                                <option value="landscape">Landscape</option>
                                                <option value="portrait">Portrait</option>
                                            </select>
                                            <InputError message={errors.orientation} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="cw" value="Width (pixels)" className="font-medium" />
                                            <TextInput 
                                                id="cw" 
                                                type="number" 
                                                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                                value={data.canvas_width} 
                                                onChange={(e) => setData('canvas_width', e.target.value)} 
                                            />
                                            <InputError message={errors.canvas_width} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="ch" value="Height (pixels)" className="font-medium" />
                                            <TextInput 
                                                id="ch" 
                                                type="number" 
                                                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                                value={data.canvas_height} 
                                                onChange={(e) => setData('canvas_height', e.target.value)} 
                                            />
                                            <InputError message={errors.canvas_height} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-xs font-medium text-blue-900 uppercase mb-2">Size Tips</p>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Standard landscape: 1200×850px or 1280×720px</li>
                                            <li>• Standard portrait: 850×1200px or 720×1280px</li>
                                            <li>• Adjust dimensions to match your design requirements</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="border-t border-gray-100 pt-8 flex justify-end gap-3">
                                    <Link
                                        href={route('organization.templates.index')}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton 
                                        disabled={processing}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {processing ? 'Creating...' : 'Create & Open Editor'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
