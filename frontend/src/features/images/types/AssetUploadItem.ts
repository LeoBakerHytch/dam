export type AssetUploadStatus = 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'ERROR';

export type AssetUploadErrorCode =
  | 'FILE_TOO_LARGE'
  | 'INVALID_FORMAT'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export type AssetUploadItem = {
  id: string;
  file: File;
  status: AssetUploadStatus;
  errorCode?: AssetUploadErrorCode;
};
