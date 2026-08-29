<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $organization = $user->currentOrganization();

        if (! $organization) {
            return Inertia::render('Dashboard/Setup', [
                'user' => $user->only('id', 'name', 'email'),
            ]);
        }

        $stats = [
            'templates' => $organization->templates()->count(),
            'batches' => $organization->batches()->count(),
            'certificates' => $organization->certificates()->count(),
            'pending_payments' => $organization->payments()->where('status', 'created')->count(),
        ];

        $recentBatches = $organization->batches()
            ->with(['template', 'merkleAnchor'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'template' => $b->template?->name,
                'status' => $b->status->value,
                'valid' => $b->valid_records,
                'anchor' => $b->merkleAnchor?->status->value,
                'created_at' => $b->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Dashboard/Index', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
            ],
            'stats' => $stats,
            'recent_batches' => $recentBatches,
        ]);
    }
}
