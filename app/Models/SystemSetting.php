<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
    ];

    // ──────────────────────────────────────────────
    // Static Methods
    // ──────────────────────────────────────────────

    /**
     * Get a setting value by key.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();

        if (!$setting) {
            return $default;
        }

        return static::castValue($setting->value, $setting->type);
    }

    /**
     * Set a setting value by key.
     *
     * @param string $key
     * @param mixed $value
     * @param string $type
     * @return SystemSetting
     */
    public static function set(string $key, mixed $value, string $type = 'string'): SystemSetting
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_bool($value) ? ($value ? '1' : '0') : (string) $value,
                'type'  => $type,
            ]
        );
    }

    // ──────────────────────────────────────────────
    // Private Helpers
    // ──────────────────────────────────────────────

    /**
     * Cast a value based on its type.
     */
    private static function castValue(?string $value, string $type): mixed
    {
        if (is_null($value)) {
            return null;
        }

        return match ($type) {
            'boolean', 'bool' => in_array(strtolower($value), ['1', 'true', 'yes']),
            'integer', 'int'  => (int) $value,
            'float', 'double' => (float) $value,
            'json', 'array'   => json_decode($value, true),
            default           => $value,
        };
    }
}
