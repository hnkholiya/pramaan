<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationRequest;
use App\Services\OrganizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function __construct(private OrganizationService $service) {}

    public function create(Request $request)
    {
        if ($request->user()->currentOrganization()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Organization/Create');
    }

    public function store(StoreOrganizationRequest $request)
    {
        $organization = $this->service->createForUser($request->user(), $request->validated());

        return redirect()->route('dashboard')->with('success', 'Organization created.');
    }

    public function show(Request $request)
    {
        return Inertia::render('Organization/Show', [
            'organization' => $request->user()->currentOrganization(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:1000'],
            'website' => ['nullable', 'url'],
        ]);

        $org = $request->user()->currentOrganization();
        if (! $org) {
            return redirect()->route('organization.create');
        }

        $this->service->update($org, $data);

        return redirect()->route('organization.show')->with('success', 'Organization updated.');
    }
}
