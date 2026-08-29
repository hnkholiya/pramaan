import { Link } from '@inertiajs/react';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">P</div>
                        <span className="text-xl font-bold text-slate-800">Pramaan</span>
                    </div>
                    <nav className="flex items-center gap-3">
                        <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">Login</Link>
                        <Link href="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Register</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex items-center">
                <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
                            Blockchain-verified digital certificates
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Issue, manage, and verify certificates with cryptographic integrity on the Arbitrum blockchain.
                            Every document is hashed, anchored to a Merkle root, and verifiable by anyone.
                        </p>
                        <div className="mt-8 flex gap-3">
                            <Link href="/register" className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-indigo-700">
                                Start Issuing
                            </Link>
                            <Link href="/verify" className="border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-medium hover:bg-slate-50">
                                Verify a Certificate
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
                        <h3 className="font-semibold text-slate-800">How it works</h3>
                        <ol className="mt-4 space-y-3 text-sm text-slate-600">
                            {[
                                'Create templates and design certificate layouts',
                                'Upload recipient CSV data',
                                'Pay securely via Razorpay',
                                'Generate PDF certificates with QR codes',
                                'Anchor SHA-256 hashes in a Merkle tree on Arbitrum',
                                'Anyone can verify authenticity publicly',
                            ].map((step, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                    <span className="pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </main>
        </div>
    );
}
