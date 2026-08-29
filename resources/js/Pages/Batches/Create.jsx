import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ templates }) {
    const { data, setData, post, processing, errors } = useForm({
        template_id: templates[0]?.id || '',
        csv: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('organization.batches.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">New Batch</h2>}>
            <div className="py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
                    {templates.length === 0 ? (
                        <div className="text-center text-slate-500">
                            <p>You need a template before uploading a batch.</p>
                            <a href={route('organization.templates.create')} className="mt-4 inline-block text-indigo-600 hover:underline">Create a template</a>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel value="Certificate Template" />
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.template_id} onChange={(e) => setData('template_id', e.target.value)}>
                                    {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <InputError message={errors.template_id} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel value="CSV File" />
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="mt-1 block w-full text-sm"
                                    onChange={(e) => setData('csv', e.target.files[0])}
                                />
                                <InputError message={errors.csv} className="mt-2" />
                                <p className="mt-2 text-xs text-slate-400">CSV must have a header row. Columns map to template fields later.</p>
                            </div>
                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing || !data.csv}>Upload & Create Batch</PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
