<?php

declare(strict_types=1);

namespace App\GraphQL\Resolvers;

use App\Models\ImageAsset;
use Exception;
use GraphQL\Error\Error;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class ImageAsset_Upload
{
    /**
     * @throws Error
     */
    public function __invoke($_, array $args): array
    {
        $input = $args['input'];
        $user = auth('api')->user();

        /** @var UploadedFile $image */
        $image = $input['image'];

        // Only get mime type if file is valid to avoid the error
        try {
            $mimeType = $image->getMimeType();
        } catch (Exception $e) {
            throw new Error('Invalid file uploaded: Cannot detect file type');
        }

        if (! $image->isValid()) {
            $errorCode = $image->getError();
            $errorMessage = match ($errorCode) {
                UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive (current limit: '.ini_get('upload_max_filesize').')',
                UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'File upload stopped by extension',
                default => 'Unknown upload error'
            };
            throw new Error("Invalid file uploaded: {$errorMessage} (code: {$errorCode})");
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (! in_array($mimeType, $allowedMimes)) {
            throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed');
        }

        $maxSize = 10 * 1024 * 1024; // 10MB
        if ($image->getSize() > $maxSize) {
            throw new Error('File size must not exceed 10MB');
        }

        // Generate unique filename
        $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $image->getClientOriginalExtension();
        $fileName = $originalName.'_'.time().'.'.$extension;

        // Store the file
        $filePath = $image->storeAs('images', $fileName, 'public');

        if (! $filePath) {
            throw new Error('Failed to store file');
        }

        // Generate thumbnail
        $thumbnailPath = $this->generateThumbnail($image, $fileName);

        if (! $thumbnailPath) {
            // Clean up original file if thumbnail generation fails
            Storage::disk('public')->delete($filePath);
            throw new Error('Failed to generate thumbnail');
        }

        // Get image dimensions
        $fullPath = Storage::disk('public')->path($filePath);
        $imageInfo = getimagesize($fullPath);

        if (! $imageInfo) {
            // Clean up the stored files if we can't get dimensions
            Storage::disk('public')->delete($filePath);
            Storage::disk('public')->delete($thumbnailPath);
            $lastError = error_get_last();
            $errorMessage = $lastError ? $lastError['message'] : 'Unknown error';
            throw new Error("Unable to process image file: {$errorMessage}");
        }

        [$width, $height] = $imageInfo;

        $imageAsset = ImageAsset::create([
            'name' => $originalName,
            'file_name' => $fileName,
            'file_path' => $filePath,
            'thumbnail_path' => $thumbnailPath,
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

    /**
     * Generate a thumbnail for the uploaded image
     */
    private function generateThumbnail(UploadedFile $image, string $fileName): ?string
    {
        try {
            $thumbnailSize = 450;

            // Create thumbnail filename
            $pathInfo = pathinfo($fileName);
            $thumbnailFileName = $pathInfo['filename'].'_thumb.'.$pathInfo['extension'];

            // Get original image resource
            $originalPath = $image->getPathname();
            $mimeType = $image->getMimeType();

            $sourceImage = match ($mimeType) {
                'image/jpeg' => imagecreatefromjpeg($originalPath),
                'image/png' => imagecreatefrompng($originalPath),
                'image/gif' => imagecreatefromgif($originalPath),
                'image/webp' => imagecreatefromwebp($originalPath),
                default => false
            };

            if (! $sourceImage) {
                return null;
            }

            // Get original dimensions
            $originalWidth = imagesx($sourceImage);
            $originalHeight = imagesy($sourceImage);

            // Calculate thumbnail dimensions maintaining aspect ratio
            if ($originalWidth > $originalHeight) {
                $thumbnailWidth = $thumbnailSize;
                $thumbnailHeight = intval(($originalHeight / $originalWidth) * $thumbnailSize);
            } else {
                $thumbnailHeight = $thumbnailSize;
                $thumbnailWidth = intval(($originalWidth / $originalHeight) * $thumbnailSize);
            }

            // Create thumbnail image
            $thumbnailImage = imagecreatetruecolor($thumbnailWidth, $thumbnailHeight);

            // Handle transparency for PNG and GIF
            if ($mimeType === 'image/png' || $mimeType === 'image/gif') {
                imagealphablending($thumbnailImage, false);
                imagesavealpha($thumbnailImage, true);
                $transparent = imagecolorallocatealpha($thumbnailImage, 255, 255, 255, 127);
                imagefill($thumbnailImage, 0, 0, $transparent);
            }

            // Resize image
            imagecopyresampled(
                $thumbnailImage, $sourceImage,
                0, 0, 0, 0,
                $thumbnailWidth, $thumbnailHeight,
                $originalWidth, $originalHeight
            );

            // Create thumbnails directory if it doesn't exist
            $thumbnailsDir = Storage::disk('public')->path('thumbnails');
            if (! is_dir($thumbnailsDir)) {
                mkdir($thumbnailsDir, 0755, true);
            }

            // Save thumbnail
            $thumbnailPath = 'thumbnails/'.$thumbnailFileName;
            $thumbnailFullPath = Storage::disk('public')->path($thumbnailPath);

            $success = match ($mimeType) {
                'image/jpeg' => imagejpeg($thumbnailImage, $thumbnailFullPath, 85),
                'image/png' => imagepng($thumbnailImage, $thumbnailFullPath, 6),
                'image/gif' => imagegif($thumbnailImage, $thumbnailFullPath),
                'image/webp' => imagewebp($thumbnailImage, $thumbnailFullPath, 85),
                default => false
            };

            // Clean up memory
            imagedestroy($sourceImage);
            imagedestroy($thumbnailImage);

            return $success ? $thumbnailPath : null;

        } catch (Exception $e) {
            return null;
        }
    }
}
