import { Link } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">P</div>
                        <span className="font-bold text-slate-800">Pramaan</span>
                    </Link>
                    <Link href="/verify" className="text-sm text-slate-600 hover:text-slate-900">Verify</Link>
                </div>
            </header>
            <main className="py-10 px-4">{children}</main>
        </div>
    );
}
