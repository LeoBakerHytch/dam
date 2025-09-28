import { type FragmentOf, type ResultOf, readFragment } from 'gql.tada';

import { graphql } from './graphql';

export const PaginatorInfoFragment = graphql(`
  fragment PaginatorInfo on PaginatorInfo {
    currentPage
    lastPage
    hasMorePages
    perPage
    total
  }
`);

export function readPaginatorInfoFragment(data: FragmentOf<typeof PaginatorInfoFragment>) {
  return readFragment(PaginatorInfoFragment, data);
}

export type PaginatorInfo = ResultOf<typeof PaginatorInfoFragment>;
