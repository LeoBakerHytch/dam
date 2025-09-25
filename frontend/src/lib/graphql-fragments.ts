import { gql } from 'urql';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
    email
  }
`;