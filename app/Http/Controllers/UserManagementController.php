<?php

namespace App\Http\Controllers;

use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    /**
     * List all users with filters and pagination.
     */
    public function index(Request $request): Response
    {
        $query = User::with('unit:id,name');

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // Filter by active status
        if ($request->filled('status')) {
            $isActive = $request->input('status') === 'active';
            $query->where('is_active', $isActive);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['role', 'status', 'search']),
            'roles'   => [
                'pelapor'  => 'Pelapor',
                'operator' => 'Operator',
                'admin'    => 'Admin',
            ],
            'units'   => Unit::active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone'    => ['nullable', 'string', 'max:20'],
            'role'     => ['required', 'string', 'in:pelapor,operator,admin'],
            'unit_id'  => ['nullable', 'required_if:role,operator', 'exists:units,id'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $password = $validated['password'] ?? 'password123';

        User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'phone'     => $validated['phone'] ?? null,
            'role'      => $validated['role'],
            'unit_id'   => $validated['unit_id'] ?? null,
            'password'  => $password, // Will be hashed by the cast
            'is_active' => true,
        ]);

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone'    => ['nullable', 'string', 'max:20'],
            'role'     => ['required', 'string', 'in:pelapor,operator,admin'],
            'unit_id'  => ['nullable', 'required_if:role,operator', 'exists:units,id'],
            'is_active' => ['boolean'],
        ]);

        $user->update([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'phone'     => $validated['phone'] ?? null,
            'role'      => $validated['role'],
            'unit_id'   => $validated['unit_id'] ?? null,
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ]);

        return back()->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Toggle user active status.
     */
    public function toggleActive(User $user): RedirectResponse
    {
        $user->update([
            'is_active' => !$user->is_active,
        ]);

        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Pengguna {$user->name} berhasil {$status}.");
    }

    /**
     * Reset user password.
     */
    public function resetPassword(User $user): RedirectResponse
    {
        $newPassword = 'password123';

        $user->update([
            'password' => $newPassword, // Will be hashed by the cast
        ]);

        return back()->with('success', "Password pengguna {$user->name} berhasil direset. Password baru: {$newPassword}");
    }
}
