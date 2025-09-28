import { UploadIcon } from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';

export function ImageUploadTile({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
      // Reset input so same files can be selected again if needed
      event.target.value = '';
    }
  };

  return (
    <div className="flex w-40 cursor-pointer flex-col gap-2" onClick={handleClick}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative">
        <div className="flex h-32 w-full items-center justify-center rounded-sm border-2 border-dashed border-neutral-300 bg-neutral-50 transition-opacity hover:opacity-75 dark:border-neutral-600 dark:bg-neutral-800">
          <div className="flex flex-col items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <UploadIcon className="h-6 w-6" />
            <span className="select-none text-center text-xs leading-tight">
              Click here
              <br />
              or drop files
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-ellipsis text-sm font-medium text-neutral-600 dark:text-neutral-300">
          Accepted file types
        </p>
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          JPG, PNG, GIF, WebP
        </div>
      </div>
    </div>
  );
}
