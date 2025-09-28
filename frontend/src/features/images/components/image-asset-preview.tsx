import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client/react';

import { Button } from '@/components/ui/button';
import {
  type ImageAsset,
  UploadImageAssetMutation,
  type UploadImageAssetMutationResult,
  type UploadImageAssetMutationVariables,
  readImageAssetFragment,
} from '@/graphql/images';

type UploadState = 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';

export function ImageAssetPreview({
  file,
  onUploadComplete,
}: {
  file: File;
  onUploadComplete?: (imageAsset: ImageAsset) => void;
}) {
  const [uploadState, setUploadState] = useState<UploadState>('PENDING');
  const [error, setError] = useState<string | null>(null);
  const [mutate] = useMutation<UploadImageAssetMutationResult, UploadImageAssetMutationVariables>(
    UploadImageAssetMutation,
  );

  const uploadFile = useCallback(async () => {
    setUploadState('UPLOADING');
    setError(null);

    try {
      const mutationResult = await mutate({
        variables: {
          input: {
            image: file,
          },
        },
      });

      const uploadResult = mutationResult.data?.ImageAsset_Upload;

      if (uploadResult) {
        setUploadState('SUCCESS');
        toast.success('Image uploaded successfully');
        onUploadComplete?.(readImageAssetFragment(uploadResult.imageAsset));
      } else if (mutationResult.error) {
        setUploadState('ERROR');
        setError(mutationResult.error.message || 'Upload failed');
        toast.error('Failed to upload image');
      }
    } catch (err) {
      setUploadState('ERROR');
      setError(err instanceof Error ? err.message : 'Network error occurred');
      toast.error('Network error occurred');
    }
  }, [mutate, file, onUploadComplete]);

  useEffect(() => {
    void uploadFile();
  }, [uploadFile]);

  const retry = () => {
    void uploadFile();
  };

  const getStatusIcon = () => {
    switch (uploadState) {
      case 'UPLOADING':
        return <Loader2 size={16} className="animate-spin text-blue-500" />;
      case 'SUCCESS':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'ERROR':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
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

        {uploadState === 'UPLOADING' && (
          <p className="text-xs text-blue-600 dark:text-blue-400">Uploading...</p>
        )}

        {uploadState === 'SUCCESS' && (
          <p className="text-xs text-green-600 dark:text-green-400">Uploaded successfully</p>
        )}

        {uploadState === 'ERROR' && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            <Button size="sm" variant="outline" onClick={retry} className="h-6 text-xs">
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
