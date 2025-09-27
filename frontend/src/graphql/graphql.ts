import { initGraphQLTada } from 'gql.tada';

import type { introspection } from '@/graphql-env';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    Upload: File;
  };
}>();
