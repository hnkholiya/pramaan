import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">New Template</h2>}>
            <div className="py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Template Name" />
                            <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Description (optional)" />
                            <textarea id="description" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <InputLabel value="Orientation" />
                                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.orientation} onChange={(e) => setData('orientation', e.target.value)}>
                                    <option value="landscape">Landscape</option>
                                    <option value="portrait">Portrait</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="cw" value="Width (px)" />
                                <TextInput id="cw" type="number" className="mt-1 block w-full" value={data.canvas_width} onChange={(e) => setData('canvas_width', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="ch" value="Height (px)" />
                                <TextInput id="ch" type="number" className="mt-1 block w-full" value={data.canvas_height} onChange={(e) => setData('canvas_height', e.target.value)} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing}>Create & Open Editor</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
