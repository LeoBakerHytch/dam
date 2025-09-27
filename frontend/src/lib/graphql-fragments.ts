import { gql } from 'urql';

export const IMAGE_ASSET_FRAGMENT = gql`
  fragment ImageAssetFragment on ImageAsset {
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
`;
