// TODO: Set up generation of types from GraphQL schema

export interface ImageAsset {
  id: string;
  name: string;
  url: string;

  fileName: string;
  fileSize: number;
  fileSizeHuman: string;

  mimeType: string;
  width: number;
  height: number;
  tags?: string[];

  description?: string;
  altText?: string;

  createdAt: string;
  updatedAt: string;
}
export interface PaginatorInfo {
  currentPage: number;
  lastPage: number;
  hasMorePages: boolean;
  perPage: number;
  total: number;
}
