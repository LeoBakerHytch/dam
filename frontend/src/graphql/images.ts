import { type FragmentOf, type ResultOf, type VariablesOf, readFragment } from 'gql.tada';

import { graphql } from './graphql';
import { PaginatorInfoFragment } from './pagination';

export const ImageAssetFragment = graphql(`
  fragment ImageAsset on ImageAsset {
    id
    name
    url
    thumbnailUrl

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

export function readImageAssetFragment(data: FragmentOf<typeof ImageAssetFragment>) {
  return readFragment(ImageAssetFragment, data);
}

export type ImageAsset = ResultOf<typeof ImageAssetFragment>;

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

export type ImageGalleryQueryVariables = VariablesOf<typeof ImageGalleryQuery>;
export type ImageGalleryQueryResult = ResultOf<typeof ImageGalleryQuery>;

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

export type UploadImageAssetMutationVariables = VariablesOf<typeof UploadImageAssetMutation>;
export type UploadImageAssetMutationResult = ResultOf<typeof UploadImageAssetMutation>;

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

export type SetImageAssetDetailsMutationVariables = VariablesOf<
  typeof SetImageAssetDetailsMutation
>;
export type SetImageAssetDetailsMutationResult = ResultOf<typeof SetImageAssetDetailsMutation>;
