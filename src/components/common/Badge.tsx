import React from 'react';

type BadgeVariant =
  | 'NOUVELLE'
  | 'RECUE'
  | 'EN_COURS'
  | 'EQUIPE_EN_ROUTE'
  | 'RESOLUE'
  | 'ANNULEE'
  | 'FAUSSE_ALERTE'
  | 'CRITIQUE'
  | 'HAUTE'
  | 'NORMALE'
  | 'DISPONIBLE'
  | 'EN_MISSION'
  | 'HORS_SERVICE'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OPERATEUR'
  | 'CITOYEN'
  | 'DEFAULT';

type Props = {
  variant: BadgeVariant | string;
  children?: React.ReactNode;
  size?: 'sm' | 'md';
};

const VARIANT_CONFIGS: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot?: string }
> = {
  // Statuts Alertes
  NOUVELLE: {
    label: 'Nouvelle',
    bg: 'bg-red-950/70',
    text: 'text-red-300',
    border: 'border-red-800/80',
    dot: 'bg-red-500 animate-pulse',
  },
  RECUE: {
    label: 'Reçue',
    bg: 'bg-orange-950/70',
    text: 'text-orange-300',
    border: 'border-orange-800/80',
  },
  EN_COURS: {
    label: 'En cours',
    bg: 'bg-amber-950/70',
    text: 'text-amber-300',
    border: 'border-amber-800/80',
    dot: 'bg-amber-400 animate-pulse',
  },
  EQUIPE_EN_ROUTE: {
    label: 'Équipe en route',
    bg: 'bg-yellow-950/70',
    text: 'text-yellow-300',
    border: 'border-yellow-700/80',
    dot: 'bg-yellow-400',
  },
  RESOLUE: {
    label: 'Résolue',
    bg: 'bg-emerald-950/70',
    text: 'text-emerald-300',
    border: 'border-emerald-800/80',
  },
  ANNULEE: {
    label: 'Annulée',
    bg: 'bg-neutral-900',
    text: 'text-neutral-400',
    border: 'border-neutral-800',
  },
  FAUSSE_ALERTE: {
    label: 'Fausse alerte',
    bg: 'bg-neutral-900',
    text: 'text-neutral-400',
    border: 'border-neutral-800',
  },

  // Priorités
  CRITIQUE: {
    label: 'Critique',
    bg: 'bg-red-950/90',
    text: 'text-red-200 font-bold',
    border: 'border-red-600',
    dot: 'bg-red-500 animate-ping',
  },
  HAUTE: {
    label: 'Haute',
    bg: 'bg-amber-950/60',
    text: 'text-amber-300',
    border: 'border-amber-700/80',
  },
  NORMALE: {
    label: 'Normale',
    bg: 'bg-neutral-900',
    text: 'text-neutral-300',
    border: 'border-neutral-700',
  },

  // Statuts Equipes
  DISPONIBLE: {
    label: 'Disponible',
    bg: 'bg-emerald-950/70',
    text: 'text-emerald-300',
    border: 'border-emerald-700',
    dot: 'bg-emerald-500',
  },
  EN_MISSION: {
    label: 'En mission',
    bg: 'bg-amber-950/70',
    text: 'text-amber-300',
    border: 'border-amber-700',
    dot: 'bg-amber-500',
  },
  HORS_SERVICE: {
    label: 'Hors service',
    bg: 'bg-neutral-900',
    text: 'text-neutral-400',
    border: 'border-neutral-800',
  },

  // Rôles
  SUPER_ADMIN: {
    label: 'Super Admin',
    bg: 'bg-purple-950/70',
    text: 'text-purple-300',
    border: 'border-purple-800',
  },
  ADMIN: {
    label: 'Admin',
    bg: 'bg-blue-950/70',
    text: 'text-blue-300',
    border: 'border-blue-800',
  },
  OPERATEUR: {
    label: 'Opérateur',
    bg: 'bg-amber-950/70',
    text: 'text-amber-300',
    border: 'border-amber-700',
  },
  CITOYEN: {
    label: 'Citoyen',
    bg: 'bg-neutral-900',
    text: 'text-neutral-300',
    border: 'border-neutral-700',
  },
};

export const Badge: React.FC<Props> = ({ variant, children, size = 'sm' }) => {
  const config = VARIANT_CONFIGS[variant] || {
    label: variant,
    bg: 'bg-neutral-900',
    text: 'text-neutral-300',
    border: 'border-neutral-700',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {children || config.label}
    </span>
  );
};
