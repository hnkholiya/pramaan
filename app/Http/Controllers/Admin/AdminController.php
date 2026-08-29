<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Certificate;
use App\Models\CertificateBatch;
use App\Models\MerkleAnchor;
use App\Models\Organization;
use App\Models\Payment;
use Inertia\Inertia;

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
                'confirmed_anchors' => MerkleAnchor::where('status', 'confirmed')->count(),
                'failed_anchors' => MerkleAnchor::where('status', 'failed')->count(),
            ],
        ]);
    }

    public function organizations()
    {
        $organizations = Organization::withCount(['templates', 'batches', 'certificates'])
            ->with('owner')
            ->latest()
            ->paginate(20)
            ->through(fn ($o) => [
                'id' => $o->id,
                'name' => $o->name,
                'slug' => $o->slug,
                'status' => $o->status->value,
                'owner' => $o->owner?->email,
                'templates' => $o->templates_count,
                'batches' => $o->batches_count,
                'certificates' => $o->certificates_count,
                'created_at' => $o->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Organizations', ['organizations' => $organizations]);
    }

    public function batches()
    {
        $batches = CertificateBatch::with(['organization', 'template', 'merkleAnchor'])
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

        return Inertia::render('Admin/Batches', ['batches' => $batches]);
    }

    public function certificates()
    {
        $certificates = Certificate::with(['organization', 'batch'])
            ->latest()
            ->paginate(20)
            ->through(fn ($c) => [
                'id' => $c->id,
                'organization' => $c->organization?->name,
                'certificate_number' => $c->certificate_number,
                'status' => $c->status->value,
                'issued_at' => $c->issued_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Certificates', ['certificates' => $certificates]);
    }

    public function payments()
    {
        $payments = Payment::with(['organization', 'batch'])
            ->latest()
            ->paginate(20)
            ->through(fn ($p) => [
                'id' => $p->id,
                'organization' => $p->organization?->name,
                'amount' => $p->amount,
                'currency' => $p->currency,
                'provider' => $p->provider->value,
                'status' => $p->status->value,
                'order_id' => $p->provider_order_id,
            ]);

        return Inertia::render('Admin/Payments', ['payments' => $payments]);
    }

    public function activity()
    {
        $logs = ActivityLog::with('organization', 'user')
            ->latest()
            ->paginate(50)
            ->through(fn ($l) => [
                'id' => $l->id,
                'organization' => $l->organization?->name,
                'user' => $l->user?->email,
                'action' => $l->action->value,
                'metadata' => $l->metadata,
                'created_at' => $l->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Activity', ['logs' => $logs]);
    }
}
