import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Navigate, useNavigate } from 'react-router';
import { LOGIN_OPS_MUTATION } from '../../graphql/operations';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/common/Button';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import logoUrl from '../../assets/logo.png';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const [loginOps, { loading }] = useMutation(LOGIN_OPS_MUTATION, {
    onCompleted: (data: any) => {
      const { accessToken, refreshToken, user } = data.loginOps;
      setAuth(accessToken, refreshToken, user);
      toast.success(`Bienvenue, ${user.prenom || ''} ${user.nom}`);
      navigate('/');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Erreur d’authentification');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !motDePasse) {
      toast.error('Veuillez renseigner tous les champs');
      return;
    }
    loginOps({ variables: { email, motDePasse } });
  };

  const fillQuick = (testEmail: string) => {
    setEmail(testEmail);
    setMotDePasse('Baraka@2026');
  };

  return (
    <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-3.5 sm:p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[var(--color-brand-gold)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-2xl shadow-2xl p-5 sm:p-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <img
            src={logoUrl}
            alt="BARAKA SECURITY Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl shadow-lg mb-3 sm:mb-4"
          />
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-wider text-[var(--color-brand-cream)]">
            BARAKA SECURITY
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold text-[var(--color-brand-gold)] tracking-widest uppercase mt-1">
            Centrale de Supervision — Lubumbashi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1.5 uppercase tracking-wider">
              Email Professionnel
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-brand-muted)]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operateur@barakasecurity.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] placeholder-neutral-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1.5 uppercase tracking-wider">
              Mot de Passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-brand-muted)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] placeholder-neutral-500 focus:outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] transition cursor-pointer"
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={loading}
          >
            Se Connecter à la Centrale
          </Button>
        </form>

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[var(--color-brand-border)] text-center">
          <p className="text-[11px] sm:text-xs text-[var(--color-brand-muted)] mb-3">
            Comptes de démonstration (Mot de passe: <code className="text-amber-400 font-mono">Baraka@2026</code>)
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => fillQuick('superadmin@barakasecurity.com')}
              className="px-2.5 py-1 text-xs bg-[var(--color-brand-elevated)] hover:bg-neutral-800 border border-[var(--color-brand-border)] hover:border-[var(--color-brand-gold)] rounded text-[var(--color-brand-cream)] transition cursor-pointer"
            >
              👑 SuperAdmin
            </button>
            <button
              type="button"
              onClick={() => fillQuick('operateur1@barakasecurity.com')}
              className="px-2.5 py-1 text-xs bg-[var(--color-brand-elevated)] hover:bg-neutral-800 border border-[var(--color-brand-border)] hover:border-[var(--color-brand-gold)] rounded text-[var(--color-brand-cream)] transition cursor-pointer"
            >
              🎧 Opérateur 1
            </button>
            <button
              type="button"
              onClick={() => fillQuick('admin@barakasecurity.com')}
              className="px-2.5 py-1 text-xs bg-[var(--color-brand-elevated)] hover:bg-neutral-800 border border-[var(--color-brand-border)] hover:border-[var(--color-brand-gold)] rounded text-[var(--color-brand-cream)] transition cursor-pointer"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
