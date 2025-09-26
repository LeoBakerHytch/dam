import { Image } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { Heading } from '@/components/text/heading';
import { cn } from '@/lib/utils';

import { ImageAssetPreview } from './image-asset-preview';

export function ImageUploadZone() {
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAcceptedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });

  if (acceptedFiles.length > 0) {
    return (
      <div className="flex h-full w-full flex-col rounded-md border-2 border-dashed border-neutral-300 p-6 dark:border-neutral-700">
        <Heading
          title={`Creating ${acceptedFiles.length} image asset${acceptedFiles.length > 1 ? 's' : ''}`}
        />
        <div className="flex w-full flex-wrap gap-4">
          {acceptedFiles.map((file) => (
            <ImageAssetPreview file={file} />
          ))}
        </div>
      </div>
    );
  }

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
