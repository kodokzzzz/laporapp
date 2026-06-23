<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * List all categories with their report counts.
     */
    public function index(): Response
    {
        $categories = Category::withCount('reports')
            ->with('parent:id,name')
            ->ordered()
            ->get();

        // Also provide parent categories for the parent_id dropdown
        $parentCategories = Category::whereNull('parent_id')
            ->active()
            ->ordered()
            ->get(['id', 'name']);

        return Inertia::render('Admin/Categories/Index', [
            'categories'       => $categories,
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Create a new category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'parent_id'   => ['nullable', 'exists:categories,id'],
            'icon'        => ['nullable', 'string', 'max:100'],
            'is_active'   => ['boolean'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
        ]);

        Category::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'parent_id'   => $validated['parent_id'] ?? null,
            'icon'        => $validated['icon'] ?? null,
            'is_active'   => $validated['is_active'] ?? true,
            'sort_order'  => $validated['sort_order'] ?? 0,
        ]);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    /**
     * Update an existing category.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'parent_id'   => [
                'nullable',
                'exists:categories,id',
                // Prevent setting self as parent
                Rule::notIn([$category->id]),
            ],
            'icon'        => ['nullable', 'string', 'max:100'],
            'is_active'   => ['boolean'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
        ]);

        // Prevent circular parent reference: ensure the target parent is not a child of this category
        if ($validated['parent_id'] ?? null) {
            $parentCandidate = Category::find($validated['parent_id']);
            if ($parentCandidate && $parentCandidate->parent_id === $category->id) {
                return back()->withErrors([
                    'parent_id' => 'Tidak dapat menetapkan kategori anak sebagai parent.',
                ]);
            }
        }

        $category->update([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'parent_id'   => $validated['parent_id'] ?? null,
            'icon'        => $validated['icon'] ?? null,
            'is_active'   => $validated['is_active'] ?? $category->is_active,
            'sort_order'  => $validated['sort_order'] ?? $category->sort_order,
        ]);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Delete a category (only if no reports reference it).
     */
    public function destroy(Category $category): RedirectResponse
    {
        // Check if any reports use this category
        if ($category->reports()->exists()) {
            return back()->withErrors([
                'delete' => 'Kategori tidak dapat dihapus karena masih memiliki laporan terkait.',
            ]);
        }

        // Check if any child categories exist
        if ($category->children()->exists()) {
            return back()->withErrors([
                'delete' => 'Kategori tidak dapat dihapus karena masih memiliki sub-kategori.',
            ]);
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
