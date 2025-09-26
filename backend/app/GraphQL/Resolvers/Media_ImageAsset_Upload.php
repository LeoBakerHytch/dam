<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\ImageAsset;
use App\Models\User;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class Media_ImageAsset_Upload
{
    /**
     * @throws Exception
     */
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];

        $authenticatedUser = auth('api')->user();
        if (!$authenticatedUser) {
            throw new Exception('User not authenticated');
        }

        $user = User::find($authenticatedUser->getAuthIdentifier());
        if (!$user) {
            throw new Exception('User not found');
        }

        /** @var UploadedFile $image */
        $image = $input['image'];

        if (!$image->isValid()) {
            throw new Exception('Invalid file uploaded');
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($image->getMimeType(), $allowedMimes)) {
            throw new Exception('Only JPEG, PNG, GIF, and WebP images are allowed');
        }

        $maxSize = 10 * 1024 * 1024; // 10MB
        if ($image->getSize() > $maxSize) {
            throw new Exception('File size must not exceed 10MB');
        }

        // Generate unique filename
        $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $image->getClientOriginalExtension();
        $fileName = $originalName . '_' . time() . '.' . $extension;

        // Store the file
        $filePath = $image->storeAs('images', $fileName, 'public');

        if (!$filePath) {
            throw new Exception('Failed to store file');
        }

        // Get image dimensions
        $fullPath = Storage::disk('public')->path($filePath);
        $imageInfo = getimagesize($fullPath);

        if (!$imageInfo) {
            // Clean up the stored file if we can’t get dimensions
            Storage::disk('public')->delete($filePath);
            throw new Exception('Unable to process image file');
        }

        [$width, $height] = $imageInfo;

        $imageAsset = ImageAsset::create([
            'name' => $originalName,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_size' => $image->getSize(),
            'mime_type' => $image->getMimeType(),
            'width' => $width,
            'height' => $height,
            'user_id' => $user->id,
        ]);

        return [
            'imageAsset' => $imageAsset,
        ];
    }
}
