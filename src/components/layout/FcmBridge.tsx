import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { registerOpsPushToken } from '../../lib/fcm';

export const FcmBridge: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    void registerOpsPushToken().catch((err) => {
      console.warn('[FCM] enregistrement token web:', err);
    });
  }, [isAuthenticated, token]);

  return null;
};
