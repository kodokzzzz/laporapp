<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    /**
     * List all units with operator counts and report counts.
     */
    public function index(): Response
    {
        $units = Unit::withCount(['operators', 'reports'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Units/Index', [
            'units' => $units,
        ]);
    }

    /**
     * Create a new unit.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255', 'unique:units,name'],
            'description' => ['nullable', 'string', 'max:500'],
            'sla_days'    => ['nullable', 'integer', 'min:1', 'max:365'],
            'is_active'   => ['boolean'],
        ]);

        Unit::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sla_days'    => $validated['sla_days'] ?? 14,
            'is_active'   => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Unit berhasil ditambahkan.');
    }

    /**
     * Update an existing unit.
     */
    public function update(Request $request, Unit $unit): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255', 'unique:units,name,' . $unit->id],
            'description' => ['nullable', 'string', 'max:500'],
            'sla_days'    => ['nullable', 'integer', 'min:1', 'max:365'],
            'is_active'   => ['boolean'],
        ]);

        $unit->update([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sla_days'    => $validated['sla_days'] ?? $unit->sla_days,
            'is_active'   => $validated['is_active'] ?? $unit->is_active,
        ]);

        return back()->with('success', 'Unit berhasil diperbarui.');
    }

    /**
     * Delete a unit (only if no reports or operators reference it).
     */
    public function destroy(Unit $unit): RedirectResponse
    {
        // Check if any reports are assigned to this unit
        if ($unit->reports()->exists()) {
            return back()->withErrors([
                'delete' => 'Unit tidak dapat dihapus karena masih memiliki laporan terkait.',
            ]);
        }

        // Check if any operators belong to this unit
        if ($unit->operators()->exists()) {
            return back()->withErrors([
                'delete' => 'Unit tidak dapat dihapus karena masih memiliki operator terkait.',
            ]);
        }

        $unit->delete();

        return back()->with('success', 'Unit berhasil dihapus.');
    }
}
