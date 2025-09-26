<?php declare(strict_types=1);

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

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
