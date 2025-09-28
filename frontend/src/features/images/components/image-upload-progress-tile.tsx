import { CheckCircle, Loader2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ImageUploadProgressTileProps {
  file: File;
  status: 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
  error?: string;
  onRetry: () => void;
}

export function ImageUploadProgressTile({
  file,
  status,
  error,
  onRetry,
}: ImageUploadProgressTileProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'PENDING':
        return <div className="h-4 w-4 rounded-full bg-neutral-400" />;
      case 'UPLOADING':
        return <Loader2 size={16} className="animate-spin text-blue-500" />;
      case 'SUCCESS':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'ERROR':
        return <XCircle size={16} className="text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'PENDING':
        return 'Waiting...';
      case 'UPLOADING':
        return 'Uploading...';
      case 'SUCCESS':
        return 'Uploaded successfully';
      case 'ERROR':
        return error || 'Upload failed';
    }
  };

  return (
    <div className="flex w-40 flex-col gap-2">
      <div className="relative">
        <img
          className="h-32 w-full rounded-sm object-cover"
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
        <div className="absolute right-2 top-2 rounded-full bg-white/90 p-1 dark:bg-black/90">
          {getStatusIcon()}
        </div>

        {status === 'ERROR' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/50">
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="h-7 bg-white text-xs text-black hover:bg-white/90"
            >
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-ellipsis text-sm text-neutral-800 dark:text-neutral-200">
          {file.name}
        </p>

        <p className="text-xs">{getStatusText()}</p>
      </div>
    </div>
  );
}
