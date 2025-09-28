import { useQuery } from '@apollo/client/react';

import {
  CurrentUserQuery,
  type CurrentUserQueryResult,
  type User,
  readUserFragment,
} from '@/graphql/user';
import { useAuth } from '@/providers/auth-provider';

export function useCurrentUser(): { user: User | null; loading: boolean } {
  const { isAuthenticated } = useAuth();

  const { data, loading } = useQuery<CurrentUserQueryResult>(CurrentUserQuery, {
    skip: !isAuthenticated,
    errorPolicy: 'ignore',
  });

  return {
    user: data?.currentUser ? readUserFragment(data.currentUser) : null,
    loading: isAuthenticated ? loading : false,
  };
}
