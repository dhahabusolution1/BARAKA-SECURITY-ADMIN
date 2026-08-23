import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { useRealtimeStore } from '../../stores/realtimeStore';
import { Badge } from '../common/Badge';
import { LogOut, Menu, Radio } from 'lucide-react';
import { useNavigate } from 'react-router';

const REALTIME_LABELS = {
  connected: { text: 'Temps réel actif', dot: 'bg-emerald-500 animate-pulse' },
  connecting: { text: 'Connexion…', dot: 'bg-amber-400 animate-pulse' },
  disconnected: { text: 'Hors ligne', dot: 'bg-red-500' },
} as const;

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleMobileSidebar } = useUiStore();
  const realtimeStatus = useRealtimeStore((s) => s.status);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const live = REALTIME_LABELS[realtimeStatus];

  return (
    <header className="h-14 sm:h-16 bg-[var(--color-brand-charcoal)] border-b border-[var(--color-brand-border)] px-3 sm:px-6 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[var(--color-brand-elevated)] rounded-lg transition cursor-pointer"
          title="Ouvrir le menu"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] rounded-full text-[11px] sm:text-xs"
          title="Statut WebSocket GraphQL (notifications SOS instantanées)"
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${live.dot}`} />
          <Radio className="w-3 h-3 text-[var(--color-brand-gold)] hidden sm:block" />
          <span className="text-[var(--color-brand-cream)] font-medium whitespace-nowrap">
            {live.text}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-5">
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs sm:text-sm font-semibold text-[var(--color-brand-cream)] leading-tight truncate max-w-[150px] lg:max-w-[200px]">
                {user.prenom} {user.nom}
              </div>
              <div className="text-[10px] sm:text-xs text-[var(--color-brand-muted)] truncate max-w-[150px] lg:max-w-[200px]">
                {user.email || user.telephone}
              </div>
            </div>
            <Badge variant={user.role} size="sm" />
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Déconnexion"
          className="p-1.5 sm:p-2 text-[var(--color-brand-muted)] hover:text-red-400 hover:bg-[var(--color-brand-elevated)] rounded-lg transition cursor-pointer flex items-center gap-1 text-xs"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline font-medium">Quitter</span>
        </button>
      </div>
    </header>
  );
};
