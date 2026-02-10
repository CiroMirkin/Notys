import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
      fetchOptions: {
        cache: 'no-store'
      }
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network'
      }
    }
  });
}

export const apolloClient = createApolloClient();