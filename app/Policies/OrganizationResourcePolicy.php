<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

/**
 * Guards organization-scoped resources against cross-tenant (IDOR) access.
 * All ownership checks funnel through here; controllers never trust IDs.
 */
class OrganizationResourcePolicy
{
    public function belongsToOrganization(User $user, Organization $organization): bool
    {
        return $user->organization?->id === $organization->id;
    }
}
