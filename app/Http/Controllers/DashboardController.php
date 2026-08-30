<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        /*
         * Platform Admin must NEVER enter the organization dashboard.
         *
         * Admin users intentionally do not belong to an organization.
         * Send them directly to the dedicated admin dashboard.
         */
        if ((bool) $user->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        $organization = $user->currentOrganization();

        /*
         * Normal organization user without an organization yet.
         */
        if (! $organization) {
            return Inertia::render('Dashboard/Setup', [
                'user' => $user->only(
                    'id',
                    'name',
                    'email'
                ),
            ]);
        }

        $stats = [
            'templates' => $organization
                ->templates()
                ->count(),

            'batches' => $organization
                ->batches()
                ->count(),

            'certificates' => $organization
                ->certificates()
                ->count(),

            'pending_payments' => $organization
                ->payments()
                ->where('status', 'created')
                ->count(),
        ];

        $recentBatches = $organization
            ->batches()
            ->with([
                'template',
                'merkleAnchor',
            ])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($batch) => [
                'id' => $batch->id,

                'template' => $batch
                    ->template?->name,

                'status' => $batch
                    ->status
                    ->value,

                'valid' => $batch
                    ->valid_records,

                'anchor' => $batch
                    ->merkleAnchor?->status
                    ->value,

                'created_at' => $batch
                    ->created_at
                    ?->toIso8601String(),
            ]);

        return Inertia::render(
            'Dashboard/Index',
            [
                'organization' => [
                    'id' => $organization->id,
                    'name' => $organization->name,
                ],

                'stats' => $stats,

                'recent_batches' => $recentBatches,
            ]
        );
    }
}