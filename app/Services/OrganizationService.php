<?php

namespace App\Services;

use App\Enums\ActivityAction;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrganizationService
{
    public function __construct(
        private ActivityLogService $activityLog,
    ) {}

    public function createForUser(User $user, array $data): Organization
    {
        return DB::transaction(function () use ($user, $data) {
            $organization = Organization::create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'slug' => $this->uniqueSlug($data['name']),
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'website' => $data['website'] ?? null,
                'status' => \App\Enums\OrganizationStatus::Active->value,
            ]);

            $this->activityLog->log(ActivityAction::OrganizationCreated, $organization->id, $user->id, $organization);

            return $organization;
        });
    }

    public function update(Organization $organization, array $data): Organization
    {
        $organization->update($data);

        $this->activityLog->log(ActivityAction::OrganizationUpdated, $organization->id, subject: $organization);

        return $organization;
    }

    public function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;
        while (Organization::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
