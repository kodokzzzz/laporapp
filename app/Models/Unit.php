<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Unit extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'sla_days',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sla_days' => 'integer',
        ];
    }

    // ──────────────────────────────────────────────
    // Boot
    // ──────────────────────────────────────────────

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Unit $unit) {
            if (empty($unit->slug)) {
                $unit->slug = Str::slug($unit->name);

                $originalSlug = $unit->slug;
                $count = 1;
                while (static::where('slug', $unit->slug)->exists()) {
                    $unit->slug = $originalSlug . '-' . $count++;
                }
            }
        });

        static::updating(function (Unit $unit) {
            if ($unit->isDirty('name') && !$unit->isDirty('slug')) {
                $unit->slug = Str::slug($unit->name);

                $originalSlug = $unit->slug;
                $count = 1;
                while (static::where('slug', $unit->slug)->where('id', '!=', $unit->id)->exists()) {
                    $unit->slug = $originalSlug . '-' . $count++;
                }
            }
        });
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    /**
     * Reports assigned to this unit.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    /**
     * Operators (users) belonging to this unit.
     */
    public function operators(): HasMany
    {
        return $this->hasMany(User::class, 'unit_id');
    }

    // ──────────────────────────────────────────────
    // Scopes
    // ──────────────────────────────────────────────

    /**
     * Scope to active units.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
