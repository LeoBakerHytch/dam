import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client/react';
import { type PropsWithChildren } from 'react';

import { loadAccessToken } from './auth-provider';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
});

const authLink = new SetContextLink(({ headers }) => {
  const accessToken = loadAccessToken()?.jwt;
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function ApolloApiProvider(props: PropsWithChildren) {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
