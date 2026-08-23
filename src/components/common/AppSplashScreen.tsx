import React from 'react';
import logoUrl from '../../assets/logo.png';

type Props = {
  exiting?: boolean;
};

export const AppSplashScreen: React.FC<Props> = ({ exiting = false }) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-gradient overflow-hidden ${
        exiting ? 'animate-splash-exit pointer-events-none' : 'animate-fade-in'
      }`}
      aria-hidden={exiting}
      aria-label="Chargement de l'application"
    >
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[var(--color-brand-gold)]/10 rounded-full blur-3xl animate-splash-orb" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-[var(--color-brand-gold)]/5 rounded-full blur-3xl animate-splash-orb-delayed" />

      <div className="relative flex flex-col items-center gap-6 sm:gap-8 px-6">
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
          <div className="absolute inset-0 rounded-full border border-[var(--color-brand-gold)]/20 animate-splash-ring" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[var(--color-brand-gold)] border-r-[var(--color-brand-gold)]/40 animate-splash-spin" />
          <div className="absolute inset-5 rounded-full border border-[var(--color-brand-gold)]/30 animate-splash-ring-reverse" />

          <div className="relative z-10 animate-splash-logo">
            <div className="absolute -inset-3 rounded-2xl bg-[var(--color-brand-gold)]/20 blur-xl animate-splash-glow" />
            <img
              src={logoUrl}
              alt="BARAKA SECURITY"
              className="relative w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-xl shadow-2xl ring-1 ring-[var(--color-brand-gold)]/30"
            />
          </div>
        </div>

        <div className="text-center space-y-2 animate-splash-text">
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-[0.2em] text-[var(--color-brand-cream)]">
            BARAKA SECURITY
          </h1>
          <p className="text-[10px] sm:text-xs font-semibold text-[var(--color-brand-gold)] tracking-[0.35em] uppercase">
            Centrale de Supervision
          </p>
        </div>

        <div className="w-48 sm:w-56 h-1 rounded-full bg-[var(--color-brand-border)] overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-gold-gradient animate-splash-progress" />
        </div>

        <p className="text-[11px] text-[var(--color-brand-muted)] tracking-widest uppercase animate-splash-dots">
          Chargement
        </p>
      </div>
    </div>
  );
};
