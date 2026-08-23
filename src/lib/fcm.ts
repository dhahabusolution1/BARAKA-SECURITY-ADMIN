import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';
import { apolloClient } from '../graphql/client';
import { UPDATE_FCM_TOKEN_MUTATION } from '../graphql/operations';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

export function isWebFcmConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId && vapidKey);
}

function getFirebaseApp(): FirebaseApp | null {
  if (!isWebFcmConfigured()) return null;
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}

let messagingPromise: Promise<Messaging | null> | null = null;

async function getWebMessaging(): Promise<Messaging | null> {
  if (!messagingPromise) {
    messagingPromise = (async () => {
      if (!isWebFcmConfigured()) return null;
      if (!(await isSupported())) return null;
      const app = getFirebaseApp();
      if (!app) return null;
      return getMessaging(app);
    })();
  }
  return messagingPromise;
}

/**
 * Demande la permission navigateur, récupère le token FCM web
 * et l’associe au compte ops via GraphQL.
 */
export async function registerOpsPushToken(): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return;
  }
  if (!isWebFcmConfigured()) return;

  const messaging = await getWebMessaging();
  if (!messaging) return;

  const permission =
    Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission;
  if (permission !== 'granted') return;

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/',
  });

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
  if (!token) return;

  await apolloClient.mutate({
    mutation: UPDATE_FCM_TOKEN_MUTATION,
    variables: { token, plateforme: 'WEB' },
  });
}
