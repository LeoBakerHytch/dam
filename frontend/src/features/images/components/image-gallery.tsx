import { useMutation, useQuery } from '@apollo/client/react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSearchParams } from 'react-router';

import {
  type AssetUploadErrorCode,
  type AssetUploadItem,
} from '@/features/images/types/AssetUploadItem';
import {
  type ImageAsset,
  ImageGalleryQuery,
  type ImageGalleryQueryResult,
  type ImageGalleryQueryVariables,
  UploadImageAssetMutation,
  type UploadImageAssetMutationResult,
  type UploadImageAssetMutationVariables,
  readImageAssetFragment,
} from '@/graphql/images';
import { readPaginatorInfoFragment } from '@/graphql/pagination';

import { ImageAssetDetailSheet } from './image-asset-detail-sheet';
import { ImageAssetTile } from './image-asset-tile';
import { ImageAssetTileSkeleton } from './image-asset-tile-skeleton';
import { ImageGalleryDropOverlay } from './image-gallery-drop-overlay';
import { ImageGalleryPagination } from './image-gallery-pagination';
import { ImageUploadProgressTile } from './image-upload-progress-tile';
import { ImageUploadTile } from './image-upload-tile';
import { ImageUploadZone } from './image-upload-zone';

export function ImageGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [selectedAsset, setSelectedAsset] = useState<ImageAsset | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [uploadItems, setUploadItems] = useState<AssetUploadItem[]>([]);
  const [isProcessingUploads, setIsProcessingUploads] = useState(false);

  const { loading, error, data, refetch } = useQuery<
    ImageGalleryQueryResult,
    ImageGalleryQueryVariables
  >(ImageGalleryQuery, {
    variables: {
      page: currentPage,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const [uploadMutation] = useMutation<
    UploadImageAssetMutationResult,
    UploadImageAssetMutationVariables
  >(UploadImageAssetMutation);

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams(page === 1 ? {} : { page: page.toString() });
    },
    [setSearchParams],
  );

  const handleAssetClick = useCallback((asset: ImageAsset) => {
    setSelectedAsset(asset);
    setIsDetailSheetOpen(true);
  }, []);

  const handleFilesSelected = useCallback((files: File[]) => {
    const newUploadItems: AssetUploadItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'PENDING' as const,
    }));

    setUploadItems((prev) => [...newUploadItems, ...prev]);
  }, []);

  // Sequential upload processing
  useEffect(() => {
    const processNextUpload = async () => {
      if (isProcessingUploads) return;

      const nextPendingUpload = uploadItems.find((item) => item.status === 'PENDING');
      if (!nextPendingUpload) return;

      setIsProcessingUploads(true);

      // Update status to uploading
      setUploadItems((prev) =>
        prev.map((item) =>
          item.id === nextPendingUpload.id ? { ...item, status: 'UPLOADING' as const } : item,
        ),
      );

      try {
        const result = await uploadMutation({
          variables: {
            input: {
              image: nextPendingUpload.file,
            },
          },
        });

        if (result.data?.ImageAsset_Upload) {
          // Mark as success
          setUploadItems((prev) =>
            prev.map((item) =>
              item.id === nextPendingUpload.id ? { ...item, status: 'SUCCESS' as const } : item,
            ),
          );
        } else {
          // Mark as error
          setUploadItems((prev) =>
            prev.map((item) =>
              item.id === nextPendingUpload.id
                ? { ...item, status: 'ERROR' as const, error: 'Upload failed' }
                : item,
            ),
          );
        }
      } catch (err) {
        let errorCode: AssetUploadErrorCode = 'NETWORK_ERROR';

        if (err instanceof Error) {
          if (err.message.includes('413') || err.message.includes('Payload Too Large')) {
            errorCode = 'FILE_TOO_LARGE';
          } else if (err.message.includes('422')) {
            errorCode = 'INVALID_FORMAT';
          } else {
            errorCode = 'UNKNOWN_ERROR';
          }
        }

        // Mark as error
        setUploadItems((prev) =>
          prev.map((item) =>
            item.id === nextPendingUpload.id
              ? {
                  ...item,
                  status: 'ERROR' as const,
                  errorCode,
                }
              : item,
          ),
        );
      } finally {
        setIsProcessingUploads(false);
      }
    };

    void processNextUpload();
  }, [uploadItems, isProcessingUploads, uploadMutation, currentPage]);

  // Clean up successful uploads after a delay and refresh cache
  useEffect(() => {
    const successfulUploads = uploadItems.filter((item) => item.status === 'SUCCESS');

    if (successfulUploads.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      // Remove successful upload items
      setUploadItems((prev) => prev.filter((item) => item.status !== 'SUCCESS'));

      // Refresh the gallery data to show newly uploaded images
      void refetch();
    }, 3000); // Show success state for 3 seconds

    return () => clearTimeout(timer);
  }, [uploadItems, refetch]);

  const handleRetryUpload = useCallback((uploadId: string) => {
    setUploadItems((prev) =>
      prev.map((item) =>
        item.id === uploadId ? { ...item, status: 'PENDING' as const, errorCode: undefined } : item,
      ),
    );
  }, []);

  // Drag and drop functionality
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFilesSelected(acceptedFiles);
    },
    [handleFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    noClick: true, // Prevent dropzone from triggering file picker on click
    noKeyboard: true,
  });

  if (loading) {
    return (
      <div className="grid h-full grid-rows-[1fr_auto] gap-6 p-5">
        <div className="min-h-0 overflow-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-6">
            {Array.from({ length: 28 }).map((_, index) => (
              <ImageAssetTileSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-red-600 dark:text-red-400">Error loading images: {error.message}</div>
      </div>
    );
  }

  const assets = data?.imageAssets?.data || [];
  const paginatorInfo = data?.imageAssets?.paginatorInfo;

  // Calculate how many existing assets to show (28 total - 1 upload tile - upload items)
  const maxExistingAssets = Math.max(0, 28 - 1 - uploadItems.length);
  const assetsToShow = assets.slice(0, maxExistingAssets);

  if (assets.length === 0 && uploadItems.length === 0) {
    return (
      <div className="flex h-full flex-1 p-6">
        <ImageUploadZone onFilesSelected={handleFilesSelected} />
      </div>
    );
  }

  return (
    <>
      <div {...getRootProps()} className="relative grid h-full grid-rows-[1fr_auto] gap-6 p-5">
        <input {...getInputProps()} />
        <ImageGalleryDropOverlay isVisible={isDragActive} />

        <div className="min-h-0 overflow-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-6 transition-opacity duration-300">
            <ImageUploadTile onFilesSelected={handleFilesSelected} />

            {uploadItems.map((uploadItem) => (
              <ImageUploadProgressTile
                key={uploadItem.id}
                uploadItem={uploadItem}
                onRetry={() => handleRetryUpload(uploadItem.id)}
              />
            ))}

            {assetsToShow.map(readImageAssetFragment).map((asset) => (
              <ImageAssetTile
                key={asset.id}
                asset={asset}
                onClick={() => handleAssetClick(asset)}
              />
            ))}
          </div>
        </div>

        {paginatorInfo && (
          <ImageGalleryPagination
            paginatorInfo={readPaginatorInfoFragment(paginatorInfo)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <ImageAssetDetailSheet
        asset={selectedAsset}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
      />
    </>
  );
}
