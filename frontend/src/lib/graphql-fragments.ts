import { gql } from 'urql';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
    email
    avatarUrl
  }
`;

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
    createdAt
    updatedAt
  }
`;
