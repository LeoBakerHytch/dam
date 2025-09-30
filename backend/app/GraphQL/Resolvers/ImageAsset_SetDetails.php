<?php

declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\ImageAsset;
use Exception;

final class ImageAsset_SetDetails
{
    /**
     * @throws Exception
     */
    public function __invoke($root, array $args): array
    {
        $input = $args['input'];

        // @can directive handles authorization & existence nicely, no need to check here
        $imageAsset = ImageAsset::findOrFail($input['id']);

        $imageAsset->update(array_filter([
            'description' => $input['description'] ?? null,
            'alt_text' => $input['altText'] ?? null,
            'tags' => $input['tags'] ?? null,
        ], fn ($value) => $value !== null));

        return [
            'imageAsset' => $imageAsset,
        ];
    }
}
