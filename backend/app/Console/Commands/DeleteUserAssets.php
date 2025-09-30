<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class DeleteUserAssets extends Command
{
    protected $signature = 'user:delete-assets {email}';

    protected $description = 'Delete all stored assets for a given user (by email)';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (! $user) {
            $this->error("No user found with email {$email}");

            return 1;
        }

        $deletedCount = 0;

        /** @var \App\Models\ImageAsset $asset */
        foreach ($user->imageAssets as $asset) {
            $filePath = $asset->file_path;
            $thumbnailPath = $asset->thumbnail_path;

            // Delete the main file
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
                $this->info("Deleted file: $filePath");
            } else {
                $this->warn("Missing file: $filePath");
            }

            // Delete the thumbnail
            if ($thumbnailPath && Storage::disk('public')->exists($thumbnailPath)) {
                Storage::disk('public')->delete($thumbnailPath);
                $this->info("Deleted thumbnail: $thumbnailPath");
            } elseif ($thumbnailPath) {
                $this->warn("Missing thumbnail: $thumbnailPath");
            }

            // Delete DB record
            $asset->delete();
            $deletedCount++;
        }

        $this->info("Deleted $deletedCount image assets for $email.");

        return 0;
    }
}
