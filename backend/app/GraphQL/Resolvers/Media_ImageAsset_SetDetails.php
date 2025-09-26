<?php declare (strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\ImageAsset;
use Exception;

final class Media_ImageAsset_SetDetails
{
    /**
     * @throws Exception
     */
    public function __invoke($root, array $args): array
    {
        $input = $args['input'];

        $imageAsset = ImageAsset::findOrFail($input['id']);

        if (array_key_exists('description', $input)) {
            $imageAsset->description = $input['description'];
        }

        if (array_key_exists('altText', $input)) {
            $imageAsset->alt_text = $input['altText'];
        }

        if (array_key_exists('tags', $input)) {
            $imageAsset->tags = $input['tags'];
        }

        $imageAsset->save();

        return [
            'imageAsset' => $imageAsset->fresh(),
        ];
    }
}
