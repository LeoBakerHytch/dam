import { PropsWithChildren } from 'react';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

export const apiClient = new Client({
  url: '/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    // const token = getToken();
    const token = null;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

export function ApiProvider(props: PropsWithChildren) {
  return <Provider value={apiClient}>{props.children}</Provider>;
}
