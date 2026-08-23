import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useAuthStore } from '../stores/authStore';

const httpUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/graphql';

const httpLink = new HttpLink({
  uri: httpUrl,
  headers: {
    get authorization() {
      const token = useAuthStore.getState().token;
      return token ? `Bearer ${token}` : '';
    },
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
    connectionParams: () => {
      const token = useAuthStore.getState().token;
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
