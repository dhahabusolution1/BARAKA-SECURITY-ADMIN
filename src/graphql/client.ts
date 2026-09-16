import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  split,
  HttpLink,
} from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { from as rxFrom } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { useAuthStore } from '../stores/authStore';
import { useRealtimeStore } from '../stores/realtimeStore';
import { endSession, refreshSession } from '../lib/authSession';

const httpUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/graphql';

const SKIP_AUTH_RETRY = new Set(['LoginOps', 'RefreshToken']);

function isUnauthenticatedError(error: unknown): boolean {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some((err) => err.extensions?.code === 'UNAUTHENTICATED');
  }
  return false;
}

const authLink = new SetContextLink((prevContext) => {
  const token = useAuthStore.getState().token;
  const prevHeaders = (prevContext.headers as Record<string, string> | undefined) ?? {};
  return {
    headers: {
      ...prevHeaders,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!isUnauthenticatedError(error)) return;

  if (SKIP_AUTH_RETRY.has(operation.operationName ?? '')) {
    return;
  }

  // Évite une boucle infinie si le refresh a déjà été tenté pour cette opération
  if (operation.getContext().authRetry) {
    void endSession({
      reason: 'Session expirée. Veuillez vous reconnecter.',
      clearStore: () => apolloClient.clearStore(),
    });
    return EMPTY;
  }

  return rxFrom(refreshSession()).pipe(
    switchMap((ok) => {
      if (!ok) {
        void endSession({
          reason: 'Session expirée. Veuillez vous reconnecter.',
          clearStore: () => apolloClient.clearStore(),
        });
        return EMPTY;
      }

      const token = useAuthStore.getState().token;
      const prevHeaders =
        (operation.getContext().headers as Record<string, string> | undefined) ?? {};

      operation.setContext({
        authRetry: true,
        headers: {
          ...prevHeaders,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      });

      return forward(operation);
    }),
    catchError(() => {
      void endSession({
        reason: 'Session expirée. Veuillez vous reconnecter.',
        clearStore: () => apolloClient.clearStore(),
      });
      return EMPTY;
    })
  );
});

const httpLink = new HttpLink({
  uri: httpUrl,
});

const wsClient = createClient({
  url: wsUrl,
  connectionParams: () => {
    const token = useAuthStore.getState().token;
    return {
      authorization: token ? `Bearer ${token}` : '',
    };
  },
  retryAttempts: 20,
  shouldRetry: () => true,
  on: {
    connected: () => useRealtimeStore.getState().setStatus('connected'),
    closed: () => useRealtimeStore.getState().setStatus('disconnected'),
  },
});

const wsLink = new GraphQLWsLink(wsClient);

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
  link: ApolloLink.from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache(),
});
