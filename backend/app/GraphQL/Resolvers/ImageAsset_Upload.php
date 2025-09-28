<?php declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\ImageAsset;
use App\Models\User;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class ImageAsset_Upload
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

        // Only get mime type if file is valid to avoid the error
        try {
            $mimeType = $image->getMimeType();
        } catch (Exception $e) {
            throw new Exception('Invalid file uploaded: Cannot detect file type');
        }

        if (!$image->isValid()) {
            $errorCode = $image->getError();
            $errorMessage = match($errorCode) {
                UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive (current limit: ' . ini_get('upload_max_filesize') . ')',
                UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'File upload stopped by extension',
                default => 'Unknown upload error'
            };
            throw new Exception("Invalid file uploaded: {$errorMessage} (code: {$errorCode})");
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($mimeType, $allowedMimes)) {
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
            $lastError = error_get_last();
            $errorMessage = $lastError ? $lastError['message'] : 'Unknown error';
            throw new Exception("Unable to process image file: {$errorMessage}");
        }

        [$width, $height] = $imageInfo;

        $imageAsset = ImageAsset::create([
            'name' => $originalName,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_size' => $image->getSize(),
            'mime_type' => $mimeType,
            'width' => $width,
            'height' => $height,
            'user_id' => $user->id,
        ]);

        return [
            'imageAsset' => $imageAsset,
        ];
    }
}
