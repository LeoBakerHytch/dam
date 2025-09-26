import { useSearchParams } from 'react-router';
import { gql, useQuery } from 'urql';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ImageAssetTile } from '@/features/images/components/image-asset-tile';
import { IMAGE_ASSET_FRAGMENT } from '@/lib/graphql-fragments';
import { type ImageAsset } from '@/types/graphql';

interface PaginatorInfo {
  currentPage: number;
  lastPage: number;
  hasMorePages: boolean;
  perPage: number;
  total: number;
}

interface ImageAssetsQuery {
  imageAssets: {
    data: ImageAsset[];
    paginatorInfo: PaginatorInfo;
  };
}

const imageAssetsQuery = gql`
  query ImageAssets($page: Int) {
    imageAssets(page: $page) {
      data {
        ...ImageAssetFragment
      }
      paginatorInfo {
        currentPage
        lastPage
        hasMorePages
        perPage
        total
      }
    }
  }
  ${IMAGE_ASSET_FRAGMENT}
`;

export function ImageGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [{ data, fetching, error }] = useQuery<ImageAssetsQuery>({
    query: imageAssetsQuery,
    variables: { page: currentPage },
  });

  const handlePageChange = (page: number) => {
    setSearchParams(page === 1 ? {} : { page: page.toString() });
  };

  if (fetching) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-neutral-600 dark:text-neutral-400">Loading images...</div>
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

  if (assets.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-neutral-600 dark:text-neutral-400">No images found</div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-6 p-6">
      <div className="min-h-0 overflow-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-6">
          {assets.map((asset) => (
            <ImageAssetTile key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {paginatorInfo && paginatorInfo.lastPage > 1 && (
        <div className="bg-background/80 sticky bottom-0 py-4 backdrop-blur-sm">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {/* Always show first page if not in range */}
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                </>
              )}

              {/* Show current page and adjacent pages */}
              {(() => {
                const startPage = Math.max(1, currentPage - 1);
                const endPage = Math.min(paginatorInfo.lastPage, currentPage + 1);
                const pages = [];

                for (let page = startPage; page <= endPage; page++) {
                  pages.push(
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>,
                  );
                }

                return pages;
              })()}

              {/* Always show last page if not in range */}
              {currentPage < paginatorInfo.lastPage - 2 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(paginatorInfo.lastPage)}>
                      {paginatorInfo.lastPage}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={
                    !paginatorInfo.hasMorePages
                      ? undefined
                      : () => handlePageChange(currentPage + 1)
                  }
                  className={!paginatorInfo.hasMorePages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
