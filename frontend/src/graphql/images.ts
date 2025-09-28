import { FragmentOf, ResultOf, readFragment } from 'gql.tada';

import { graphql } from './graphql';
import { PaginatorInfoFragment } from './pagination';

export const ImageAssetFragment = graphql(`
  fragment ImageAsset on ImageAsset {
    id
    name
    url

    fileName
    fileSize
    fileSizeHuman

    mimeType
    width
    height

    description
    altText
    tags

    createdAt
    updatedAt
  }
`);

export type ImageAsset = ResultOf<typeof ImageAssetFragment>;

export function ImageAsset(data: FragmentOf<typeof ImageAssetFragment>) {
  return readFragment(ImageAssetFragment, data);
}

export const ImageGalleryQuery = graphql(
  `
    query ImageGallery($page: Int) {
      imageAssets(page: $page) {
        data {
          ...ImageAsset
        }
        paginatorInfo {
          ...PaginatorInfo
        }
      }
    }
  `,
  [ImageAssetFragment, PaginatorInfoFragment],
);

export type ImageGalleryQuery = ResultOf<typeof ImageGalleryQuery>;

export const UploadImageAssetMutation = graphql(
  `
    mutation ImageAsset_Upload($input: ImageAsset_Upload_Input!) {
      ImageAsset_Upload(input: $input) {
        imageAsset {
          ...ImageAsset
        }
      }
    }
  `,
  [ImageAssetFragment],
);

export const SetImageAssetDetailsMutation = graphql(
  `
    mutation ImageAsset_SetDetails($input: ImageAsset_SetDetails_Input!) {
      ImageAsset_SetDetails(input: $input) {
        imageAsset {
          ...ImageAsset
        }
      }
    }
  `,
  [ImageAssetFragment],
);
