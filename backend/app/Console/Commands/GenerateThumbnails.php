<?php

namespace App\Console\Commands;

use App\Models\ImageAsset;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerateThumbnails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'thumbnails:generate {--force : Regenerate existing thumbnails}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate thumbnails for existing images';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $force = $this->option('force');

        $query = ImageAsset::query();
        if (!$force) {
            $query->whereNull('thumbnail_path');
        }

        $images = $query->get();

        if ($images->isEmpty()) {
            $this->info('No images need thumbnail generation.');
            return 0;
        }

        $this->info("Generating thumbnails for {$images->count()} images...");

        $progressBar = $this->output->createProgressBar($images->count());
        $progressBar->start();

        $success = 0;
        $failed = 0;

        foreach ($images as $image) {
            try {
                $thumbnailPath = $this->generateThumbnail($image);

                if ($thumbnailPath) {
                    $image->update(['thumbnail_path' => $thumbnailPath]);
                    $success++;
                } else {
                    $failed++;
                }
            } catch (Exception $e) {
                $this->error("Failed to generate thumbnail for {$image->name}: {$e->getMessage()}");
                $failed++;
            }

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();

        $this->info("Thumbnail generation complete: {$success} successful, {$failed} failed");

        return 0;
    }

    private function generateThumbnail(ImageAsset $imageAsset): ?string
    {
        try {
            $thumbnailSize = 450;

            // Check if original file exists
            if (!Storage::disk('public')->exists($imageAsset->file_path)) {
                throw new Exception('Original file not found');
            }

            $originalPath = Storage::disk('public')->path($imageAsset->file_path);

            // Create thumbnail filename
            $pathInfo = pathinfo($imageAsset->file_name);
            $thumbnailFileName = $pathInfo['filename'] . '_thumb.' . $pathInfo['extension'];

            // Get original image resource
            $sourceImage = match($imageAsset->mime_type) {
                'image/jpeg' => imagecreatefromjpeg($originalPath),
                'image/png' => imagecreatefrompng($originalPath),
                'image/gif' => imagecreatefromgif($originalPath),
                'image/webp' => imagecreatefromwebp($originalPath),
                default => false
            };

            if (!$sourceImage) {
                throw new Exception('Unable to create image resource');
            }

            // Calculate thumbnail dimensions maintaining aspect ratio
            if ($imageAsset->width > $imageAsset->height) {
                $thumbnailWidth = $thumbnailSize;
                $thumbnailHeight = intval(($imageAsset->height / $imageAsset->width) * $thumbnailSize);
            } else {
                $thumbnailHeight = $thumbnailSize;
                $thumbnailWidth = intval(($imageAsset->width / $imageAsset->height) * $thumbnailSize);
            }

            // Create thumbnail image
            $thumbnailImage = imagecreatetruecolor($thumbnailWidth, $thumbnailHeight);

            // Handle transparency
            if ($imageAsset->mime_type === 'image/png' || $imageAsset->mime_type === 'image/gif') {
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
                $imageAsset->width, $imageAsset->height
            );

            // Create thumbnails directory
            $thumbnailsDir = Storage::disk('public')->path('thumbnails');
            if (!is_dir($thumbnailsDir)) {
                mkdir($thumbnailsDir, 0755, true);
            }

            // Save thumbnail
            $thumbnailPath = 'thumbnails/' . $thumbnailFileName;
            $thumbnailFullPath = Storage::disk('public')->path($thumbnailPath);

            $success = match($imageAsset->mime_type) {
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
