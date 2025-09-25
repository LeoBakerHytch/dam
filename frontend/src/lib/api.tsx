import { PropsWithChildren, createContext } from 'react';
import { Client, cacheExchange, fetchExchange } from 'urql';

export const apiClient = new Client({
  url: 'http://localhost:8000/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    // const token = getToken();
    const token = null;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

const ApiContext = createContext(apiClient);

export function ApiProvider(props: PropsWithChildren) {
  return <ApiContext.Provider value={apiClient}>{props.children}</ApiContext.Provider>;
}
