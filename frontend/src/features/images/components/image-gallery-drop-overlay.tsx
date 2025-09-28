import { UploadIcon } from 'lucide-react';

interface ImageGalleryDropOverlayProps {
  isVisible: boolean;
}

export function ImageGalleryDropOverlay({ isVisible }: ImageGalleryDropOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80">
      <div className="flex items-center justify-center rounded-lg border-4 border-dashed border-neutral-400 bg-white/90 p-12 dark:border-white dark:bg-black/90">
        <div className="text-black-600 flex flex-col items-center gap-4 dark:text-white">
          <UploadIcon className="h-12 w-12" />
          <div className="text-center">
            <p className="text-lg font-medium">Drop files to upload</p>
            <p className="text-sm">Release to add images to your gallery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
