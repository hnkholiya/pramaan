import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

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
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Create Organization</h2>}>
            <div className="py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Organization Name" />
                            <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput id="phone" className="mt-1 block w-full" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel htmlFor="address" value="Address" />
                            <textarea id="address" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel htmlFor="website" value="Website" />
                            <TextInput id="website" className="mt-1 block w-full" value={data.website} onChange={(e) => setData('website', e.target.value)} />
                            <InputError message={errors.website} className="mt-2" />
                        </div>
                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing}>Create Organization</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
