<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogService
{
    /**
     * Centralized activity logging. Never throws on failures.
     */
    public function log(
        ActivityAction|string $action,
        ?int $organizationId = null,
        ?int $userId = null,
        ?Model $subject = null,
        array $metadata = [],
    ): ?ActivityLog {
        try {
            $log = new ActivityLog();
            $log->action = $action instanceof ActivityAction ? $action->value : $action;
            $log->organization_id = $organizationId ?? $this->currentOrganizationId();
            $log->user_id = $userId ?? Auth::id();
            $log->subject_type = $subject ? $subject->getMorphClass() : null;
            $log->subject_id = $subject ? $subject->getKey() : null;
            $log->metadata = $metadata ?: null;
            $log->ip_address = Request::ip();
            $log->save();

            return $log;
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function currentOrganizationId(): ?int
    {
        $user = Auth::user();

        return $user?->organization?->id;
    }
}
