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

  const getStatusColor = () => {
    switch (status) {
      case 'PENDING':
        return 'text-neutral-500 dark:text-neutral-400';
      case 'UPLOADING':
        return 'text-blue-600 dark:text-blue-400';
      case 'SUCCESS':
        return 'text-green-600 dark:text-green-400';
      case 'ERROR':
        return 'text-red-600 dark:text-red-400';
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
      </div>

      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-ellipsis text-sm text-neutral-800 dark:text-neutral-200">
          {file.name}
        </p>

        <p className={`text-xs ${getStatusColor()}`}>{getStatusText()}</p>

        {status === 'ERROR' && (
          <Button size="sm" variant="outline" onClick={onRetry} className="h-6 text-xs">
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
