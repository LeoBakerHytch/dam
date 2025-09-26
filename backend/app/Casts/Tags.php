<?php declare(strict_types=1);

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

/**
 * May be used for a field declared in the GraphQL schema to be a (non-nullable) array of strings.
 *
 * Should be backed by a JSON column in the database, which may be NULL — this will be normalized to an empty array.
 *
 * Trims and normalizes the input, removing empty strings and converting to lowercase.
 */
final class Tags implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes): array
    {
        if ($value === null) return [];
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function set($model, string $key, $value, array $attributes): array
    {
        if (!is_array($value)) {
            return [$key => null];
        }

        $normalized = array_map(
            fn ($t) => mb_strtolower(trim((string) $t)),
            $value
        );

        $filtered = array_filter($normalized, fn ($t) => $t !== '');

        return [$key => array_values($filtered)];
    }
}
