import toast from 'react-hot-toast';
import { useAuthStore, type User } from '../stores/authStore';

const httpUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';

const REFRESH_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        id
        nom
        prenom
        email
        telephone
        role
        photoUrl
        adresse
        contactUrgenceNom
        contactUrgenceTel
      }
    }
  }
`;

let refreshPromise: Promise<boolean> | null = null;
let endingSession = false;

type RefreshPayload = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

async function requestTokenRefresh(): Promise<boolean> {
  const currentRefresh = useAuthStore.getState().refreshToken;
  if (!currentRefresh) return false;

  try {
    const response = await fetch(httpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: REFRESH_MUTATION,
        variables: { refreshToken: currentRefresh },
      }),
    });

    const json = (await response.json()) as {
      data?: { refreshToken?: RefreshPayload };
      errors?: Array<{ message?: string }>;
    };

    const payload = json.data?.refreshToken;
    if (!payload?.accessToken || !payload.refreshToken || !payload.user) {
      return false;
    }

    useAuthStore.getState().setAuth(payload.accessToken, payload.refreshToken, payload.user);
    return true;
  } catch {
    return false;
  }
}

/** Refresh unique partagé si plusieurs requêtes échouent en même temps. */
export function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

type EndSessionOptions = {
  reason?: string;
  clearStore?: () => Promise<unknown>;
};

/** Déconnexion forcée + redirection login (évite d’afficher une erreur GraphQL). */
export async function endSession(options: EndSessionOptions = {}): Promise<void> {
  if (endingSession) return;
  endingSession = true;

  try {
    useAuthStore.getState().logout();
    if (options.clearStore) {
      await options.clearStore().catch(() => undefined);
    }
    if (options.reason) {
      toast.error(options.reason);
    }
    if (window.location.pathname !== '/login') {
      window.location.replace('/login');
    }
  } finally {
    // Laisse le temps au replace de démarrer avant d’autoriser une nouvelle fin de session
    window.setTimeout(() => {
      endingSession = false;
    }, 1000);
  }
}
