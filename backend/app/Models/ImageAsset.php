<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\Tags;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $name
 * @property string $file_name
 * @property string $file_path
 * @property string|null $thumbnail_path
 * @property int $file_size
 * @property string $mime_type
 * @property int|null $width
 * @property int|null $height
 * @property array<int, string> $tags
 * @property string|null $description
 * @property string|null $alt_text
 * @property int $user_id
 * @property-read string $url
 * @property-read string $thumbnail_url
 * @property-read string $file_size_human
 */
class ImageAsset extends Model
{
    protected $fillable = [
        'name',
        'file_name',
        'file_path',
        'thumbnail_path',
        'file_size',
        'mime_type',
        'width',
        'height',
        'tags',
        'description',
        'alt_text',
        'user_id',
    ];

    protected $casts = [
        'tags' => Tags::class,
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function url(): Attribute
    {
        return Attribute::make(
            get: fn () => Storage::disk('public')->url($this->file_path)
        );
    }

    public function thumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => Storage::disk('public')->url($this->thumbnail_path)
        );
    }

    public function fileSizeHuman(): Attribute
    {
        return Attribute::make(
            get: function () {
                $bytes = $this->file_size;
                $units = ['B', 'KB', 'MB', 'GB'];

                for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
                    $bytes /= 1024;
                }

                return round($bytes, 2, PHP_ROUND_HALF_DOWN).' '.$units[$i];
            }
        );
    }

    public function scopeForUser($query)
    {
        return $query->where('user_id', auth('api')->id())
            ->orderBy('created_at', 'desc');
    }
}
