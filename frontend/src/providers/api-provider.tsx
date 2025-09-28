import { PropsWithChildren, useMemo } from 'react';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

import { useAuth } from '@/providers/auth-provider';

function ApiProviderInner(props: PropsWithChildren) {
  const { accessToken } = useAuth();

  const apiClient = useMemo(() => {
    return new Client({
      url: '/graphql',
      exchanges: [cacheExchange, fetchExchange],
      fetchOptions: () => {
        return {
          headers: {
            authorization: accessToken ? `Bearer ${accessToken.jwt}` : '',
          },
        };
      },
    });
  }, [accessToken]);

  return <Provider value={apiClient}>{props.children}</Provider>;
}

export function ApiProvider(props: PropsWithChildren) {
  return <ApiProviderInner>{props.children}</ApiProviderInner>;
}
