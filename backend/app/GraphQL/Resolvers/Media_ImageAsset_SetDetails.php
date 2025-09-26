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

        if (isset($input['description'])) {
            $imageAsset->description = $input['description'];
        }

        if (isset($input['altText'])) {
            $imageAsset->alt_text = $input['altText'];
        }

        if (isset($input['tags'])) {
            $imageAsset->tags = $input['tags'];
        }

        $imageAsset->save();

        return [
            'imageAsset' => $imageAsset->fresh(),
        ];
    }
}
