import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'OPERATEUR' | 'CITOYEN' | 'MEMBRE_EQUIPE';

export type User = {
  id: string;
  nom: string;
  prenom?: string | null;
  email?: string | null;
  telephone?: string | null;
  role: Role;
  photoUrl?: string | null;
  adresse?: string | null;
  contactUrgenceNom?: string | null;
  contactUrgenceTel?: string | null;
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, refreshToken, user) =>
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
        }),
      updateUser: (updated) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : null,
        })),
      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'baraka_security_admin_auth',
    }
  )
);
