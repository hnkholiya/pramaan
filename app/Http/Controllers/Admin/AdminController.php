<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ActivityAction;
use App\Enums\OrganizationStatus;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\CertificateBatch;
use App\Models\MerkleAnchor;
use App\Models\Organization;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'organizations' => Organization::count(),
                'batches' => CertificateBatch::count(),
                'certificates' => Certificate::count(),
                'payments' => Payment::count(),
                'anchors' => MerkleAnchor::count(),
                'confirmed_anchors' => MerkleAnchor::where(
                    'status',
                    'confirmed'
                )->count(),
                'failed_anchors' => MerkleAnchor::where(
                    'status',
                    'failed'
                )->count(),
            ],
        ]);
    }

    /**
     * Admin organization management.
     *
     * Supports:
     * - Search by organization name
     * - Search by owner email
     * - Status filter
     * - Pagination
     */
    public function organizations(Request $request)
    {
        $search = trim(
            (string) $request->input('search', '')
        );

        $status = $request->input('status');

        $organizations = Organization::query()
            ->with('owner')
            ->withCount([
                'templates',
                'batches',
                'certificates',
                'payments',
            ])

            ->when(
                $search !== '',
                function ($query) use ($search) {
                    $query->where(function ($query) use ($search) {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('slug', 'like', "%{$search}%")
                            ->orWhereHas(
                                'owner',
                                function ($ownerQuery) use ($search) {
                                    $ownerQuery
                                        ->where(
                                            'name',
                                            'like',
                                            "%{$search}%"
                                        )
                                        ->orWhere(
                                            'email',
                                            'like',
                                            "%{$search}%"
                                        );
                                }
                            );
                    });
                }
            )

            ->when(
                in_array(
                    $status,
                    [
                        OrganizationStatus::Active->value,
                        OrganizationStatus::Suspended->value,
                    ],
                    true
                ),
                function ($query) use ($status) {
                    $query->where('status', $status);
                }
            )

            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(function (Organization $organization) {
                return [
                    'id' => $organization->id,

                    'name' => $organization->name,

                    'slug' => $organization->slug,

                    'email' => $organization->email,

                    'phone' => $organization->phone,

                    'status' => $organization->status->value,

                    'status_label' =>
                        $organization->status->label(),

                    'owner' => [
                        'id' => $organization->owner?->id,

                        'name' => $organization->owner?->name,

                        'email' => $organization->owner?->email,
                    ],

                    'templates' =>
                        $organization->templates_count,

                    'batches' =>
                        $organization->batches_count,

                    'certificates' =>
                        $organization->certificates_count,

                    'payments' =>
                        $organization->payments_count,

                    'created_at' =>
                        $organization->created_at
                            ?->toIso8601String(),
                ];
            });

        return Inertia::render(
            'Admin/Organizations',
            [
                'organizations' => $organizations,

                'filters' => [
                    'search' => $search,

                    'status' => $status,
                ],

                'statuses' => [
                    [
                        'value' =>
                            OrganizationStatus::Active->value,

                        'label' =>
                            OrganizationStatus::Active->label(),
                    ],
                    [
                        'value' =>
                            OrganizationStatus::Suspended->value,

                        'label' =>
                            OrganizationStatus::Suspended->label(),
                    ],
                ],
            ]
        );
    }

    /**
     * Show complete organization information.
     */
    public function show(
        Organization $organization
    ) {
        $organization->load([
            'owner:id,name,email',
        ]);

        $organization->loadCount([
            'templates',
            'batches',
            'certificates',
            'payments',
        ]);

        $recentBatches = $organization
            ->batches()
            ->with('merkleAnchor')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function (CertificateBatch $batch) {
                return [
                    'id' => $batch->id,

                    'source_file_name' =>
                        $batch->source_file_name,

                    'status' =>
                        $batch->status->value,

                    'total_records' =>
                        $batch->total_records,

                    'valid_records' =>
                        $batch->valid_records,

                    'invalid_records' =>
                        $batch->invalid_records,

                    'anchor_status' =>
                        $batch->merkleAnchor?->status->value,

                    'transaction_hash' =>
                        $batch->merkleAnchor?->transaction_hash,

                    'created_at' =>
                        $batch->created_at
                            ?->toIso8601String(),
                ];
            });

        $recentPayments = $organization
            ->payments()
            ->latest()
            ->limit(10)
            ->get()
            ->map(function (Payment $payment) {
                return [
                    'id' => $payment->id,

                    'amount' => $payment->amount,

                    'currency' => $payment->currency,

                    'provider' =>
                        $payment->provider->value,

                    'status' =>
                        $payment->status->value,

                    'order_id' =>
                        $payment->provider_order_id,

                    'payment_id' =>
                        $payment->provider_payment_id,

                    'created_at' =>
                        $payment->created_at
                            ?->toIso8601String(),
                ];
            });

        $recentActivity = $organization
            ->activityLogs()
            ->with('user:id,name,email')
            ->latest()
            ->limit(20)
            ->get()
            ->map(function (ActivityLog $log) {
                return [
                    'id' => $log->id,

                    'action' =>
                        $log->action->value,

                    'metadata' =>
                        $log->metadata,

                    'user' => [
                        'id' => $log->user?->id,

                        'name' => $log->user?->name,

                        'email' => $log->user?->email,
                    ],

                    'created_at' =>
                        $log->created_at
                            ?->toIso8601String(),
                ];
            });

        return Inertia::render(
            'Admin/OrganizationShow',
            [
                'organization' => [
                    'id' =>
                        $organization->id,

                    'name' =>
                        $organization->name,

                    'slug' =>
                        $organization->slug,

                    'email' =>
                        $organization->email,

                    'phone' =>
                        $organization->phone,

                    'address' =>
                        $organization->address,

                    'website' =>
                        $organization->website,

                    'logo_path' =>
                        $organization->logo_path,

                    'status' =>
                        $organization->status->value,

                    'status_label' =>
                        $organization->status->label(),

                    'created_at' =>
                        $organization->created_at
                            ?->toIso8601String(),

                    'owner' => [
                        'id' =>
                            $organization->owner?->id,

                        'name' =>
                            $organization->owner?->name,

                        'email' =>
                            $organization->owner?->email,
                    ],

                    'counts' => [
                        'templates' =>
                            $organization->templates_count,

                        'batches' =>
                            $organization->batches_count,

                        'certificates' =>
                            $organization->certificates_count,

                        'payments' =>
                            $organization->payments_count,
                    ],
                ],

                'recent_batches' =>
                    $recentBatches,

                'recent_payments' =>
                    $recentPayments,

                'recent_activity' =>
                    $recentActivity,
            ]
        );
    }

    /**
     * Activate or suspend an organization.
     */
    public function updateStatus(
        Request $request,
        Organization $organization
    ) {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:' .
                    OrganizationStatus::Active->value .
                    ',' .
                    OrganizationStatus::Suspended->value,
            ],
        ]);

        $oldStatus =
            $organization->status->value;

        $newStatus =
            $validated['status'];

        /*
         * No-op status change.
         */
        if ($oldStatus === $newStatus) {
            return back();
        }

        $organization->update([
            'status' => $newStatus,
        ]);

        /*
         * Audit the platform-admin action.
         */
        ActivityLog::create([
            'organization_id' =>
                $organization->id,

            'user_id' =>
                $request->user()->id,

            'action' =>
                ActivityAction::OrganizationUpdated->value,

            'subject_type' =>
                Organization::class,

            'subject_id' =>
                $organization->id,

            'metadata' => [
                'field' => 'status',

                'old' => $oldStatus,

                'new' => $newStatus,

                'source' => 'admin_panel',
            ],

            'ip_address' =>
                $request->ip(),
        ]);

        return back()->with(
            'success',
            'Organization status updated successfully.'
        );
    }

    public function batches()
    {
        $batches = CertificateBatch::with([
            'organization',
            'template',
            'merkleAnchor',
        ])
            ->latest()
            ->paginate(20)
            ->through(fn ($b) => [
                'id' => $b->id,
                'organization' => $b->organization?->name,
                'template' => $b->template?->name,
                'status' => $b->status->value,
                'total' => $b->total_records,
                'valid' => $b->valid_records,
                'anchor' => $b->merkleAnchor?->status->value,
            ]);

        return Inertia::render(
            'Admin/Batches',
            [
                'batches' => $batches,
            ]
        );
    }

    public function certificates()
    {
        $certificates = Certificate::with([
            'organization',
            'batch',
        ])
            ->latest()
            ->paginate(20)
            ->through(fn ($c) => [
                'id' => $c->id,
                'organization' => $c->organization?->name,
                'certificate_number' =>
                    $c->certificate_number,
                'status' => $c->status->value,
                'issued_at' =>
                    $c->issued_at?->toIso8601String(),
            ]);

        return Inertia::render(
            'Admin/Certificates',
            [
                'certificates' => $certificates,
            ]
        );
    }

    public function payments()
    {
        $payments = Payment::with([
            'organization',
            'batch',
        ])
            ->latest()
            ->paginate(20)
            ->through(fn ($p) => [
                'id' => $p->id,
                'organization' => $p->organization?->name,
                'amount' => $p->amount,
                'currency' => $p->currency,
                'provider' => $p->provider->value,
                'status' => $p->status->value,
                'order_id' =>
                    $p->provider_order_id,
            ]);

        return Inertia::render(
            'Admin/Payments',
            [
                'payments' => $payments,
            ]
        );
    }

    public function activity()
    {
        $logs = ActivityLog::with([
            'organization',
            'user',
        ])
            ->latest()
            ->paginate(50)
            ->through(fn ($l) => [
                'id' => $l->id,
                'organization' =>
                    $l->organization?->name,
                'user' =>
                    $l->user?->email,
                'action' =>
                    $l->action->value,
                'metadata' =>
                    $l->metadata,
                'created_at' =>
                    $l->created_at
                        ?->toIso8601String(),
            ]);

        return Inertia::render(
            'Admin/Activity',
            [
                'logs' => $logs,
            ]
        );
    }
}