<?php

namespace App\Services;

use App\Enums\OrganizationStatus;
use App\Models\Organization;
use RuntimeException;

class OrganizationAccessService
{
    /**
     * Ensure the organization is active.
     *
     * Suspended organizations may still view existing data,
     * but cannot perform new issuance-related operations.
     */
    public function assertActive(Organization $organization): void
    {
        if (
            $organization->status !== OrganizationStatus::Active
        ) {
            throw new RuntimeException(
                'This organization is suspended and cannot perform this action.'
            );
        }
    }

    /**
     * Convenience boolean check.
     */
    public function isActive(Organization $organization): bool
    {
        return $organization->status === OrganizationStatus::Active;
    }
}