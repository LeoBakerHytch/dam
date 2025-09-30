import { Image } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

export function ImageUploadZone({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-neutral-300 dark:border-neutral-700"
    >
      <div className="flex flex-row items-center gap-4">
        <Image
          size="50"
          className={cn('text-neutral-800 dark:text-neutral-200', {
            'animate-wiggle': isDragActive,
          })}
        />
        <input {...getInputProps()} />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Drop some images here to get started
        </p>
      </div>
    </div>
  );
}
