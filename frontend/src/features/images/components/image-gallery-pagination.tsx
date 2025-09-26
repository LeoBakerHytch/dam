import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginatorInfo } from '@/types/graphql';

export function ImageGalleryPagination({
  paginatorInfo,
  currentPage,
  onPageChange,
}: {
  paginatorInfo: PaginatorInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  if (paginatorInfo.lastPage <= 1) {
    return null;
  }

  return (
    <div className="bg-background/80 sticky bottom-0 py-4 backdrop-blur-sm">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>

          {/* Always show first page if not in range */}
          {currentPage > 3 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
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
                    onClick={() => onPageChange(page)}
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
                <PaginationLink onClick={() => onPageChange(paginatorInfo.lastPage)}>
                  {paginatorInfo.lastPage}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              disabled={!paginatorInfo.hasMorePages}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
