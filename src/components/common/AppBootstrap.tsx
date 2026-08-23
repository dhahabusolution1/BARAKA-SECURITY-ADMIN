import React, { useEffect, useState } from 'react';
import { App } from '../../App';
import { useAuthStore } from '../../stores/authStore';
import { AppSplashScreen } from './AppSplashScreen';
import logoUrl from '../../assets/logo.png';

const MIN_SPLASH_MS = 2000;
const EXIT_ANIMATION_MS = 650;

export const AppBootstrap: React.FC = () => {
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());
  const [assetsReady, setAssetsReady] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const unsubHydration = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    const img = new Image();
    img.src = logoUrl;
    img.onload = () => setAssetsReady(true);
    img.onerror = () => setAssetsReady(true);

    const minTimer = window.setTimeout(() => setMinTimeDone(true), MIN_SPLASH_MS);

    return () => {
      unsubHydration();
      window.clearTimeout(minTimer);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !assetsReady || !minTimeDone || exiting) return;

    setExiting(true);
    const hideTimer = window.setTimeout(() => setHidden(true), EXIT_ANIMATION_MS);
    return () => window.clearTimeout(hideTimer);
  }, [hydrated, assetsReady, minTimeDone, exiting]);

  return (
    <>
      {!hidden && <AppSplashScreen exiting={exiting} />}
      <App />
    </>
  );
};
