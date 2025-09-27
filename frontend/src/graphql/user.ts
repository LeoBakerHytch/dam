import { FragmentOf, ResultOf, readFragment } from 'gql.tada';

import { graphql } from '@/graphql';

export const UserFragment = graphql(`
  fragment User on User {
    id
    name
    email
    avatarUrl
  }
`);

export type User = ResultOf<typeof UserFragment>;

export function User(data: FragmentOf<typeof UserFragment>) {
  return readFragment(UserFragment, data);
}
