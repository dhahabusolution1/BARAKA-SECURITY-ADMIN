import React from 'react';
import { NavLink } from 'react-router';
import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import {
  LayoutDashboard,
  AlertTriangle,
  MapPin,
  Shield,
  BarChart3,
  Users,
  X,
} from 'lucide-react';
import logoUrl from '../../assets/logo.png';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { isMobileSidebarOpen, closeMobileSidebar } = useUiStore();
  const isAdminOrSuper = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const navItems = [
    {
      to: '/',
      label: 'Tableau de Bord',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/alertes',
      label: 'Alertes SOS',
      icon: AlertTriangle,
    },
    {
      to: '/carte',
      label: 'Carte des Incidents',
      icon: MapPin,
    },
    {
      to: '/equipes',
      label: 'Équipes d’Intervention',
      icon: Shield,
    },
    {
      to: '/stats',
      label: 'Statistiques & Rapports',
      icon: BarChart3,
    },
    ...(isAdminOrSuper
      ? [
          {
            to: '/utilisateurs',
            label: 'Utilisateurs & Accès',
            icon: Users,
          },
        ]
      : []),
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-brand-black)] border-r border-[var(--color-brand-border)]">
      {/* Brand & Logo Header */}
      <div className="p-4 sm:p-5 border-b border-[var(--color-brand-border)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="BARAKA SECURITY Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-md shrink-0"
          />
          <div>
            <h1 className="font-display text-sm sm:text-base font-bold text-[var(--color-brand-cream)] tracking-wider leading-tight">
              BARAKA
            </h1>
            <p className="text-[10px] text-[var(--color-brand-gold)] font-semibold tracking-widest uppercase">
              SECURITY OPS
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={closeMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-[var(--color-brand-muted)] hover:text-white hover:bg-[var(--color-brand-charcoal)] transition cursor-pointer"
          title="Fermer le menu"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-[var(--color-brand-muted)] uppercase">
          SUPERVISION
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--color-brand-elevated)] text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/30 font-semibold shadow-sm'
                    : 'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[var(--color-brand-charcoal)] border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)] opacity-0 group-[.active]:opacity-100" />
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-[var(--color-brand-border)] text-xs text-[var(--color-brand-muted)] flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between">
          <span>Centrale v1.0</span>
          <span className="text-[var(--color-brand-gold)] font-medium">Août 2026</span>
        </div>
        <div className="text-[11px] text-neutral-500 truncate">
          Système Haute Disponibilité
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col h-full shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
