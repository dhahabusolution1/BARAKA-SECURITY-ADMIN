import React, { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';
import {
  GET_ALERTES_QUERY,
  NOUVELLE_ALERTE_SUBSCRIPTION,
  ALERTE_MISE_A_JOUR_SUBSCRIPTION,
} from '../../graphql/operations';
import { IncidentMap } from '../../components/map/IncidentMap';
import { Button } from '../../components/common/Button';
import { Radio, RefreshCw, Layers } from 'lucide-react';
import { useNavigate } from 'react-router';

export const CartePage: React.FC = () => {
  const navigate = useNavigate();
  const [filterActiveOnly, setFilterActiveOnly] = useState(true);

  const { data, loading, refetch } = useQuery<any>(GET_ALERTES_QUERY, {
    variables: {
      limit: 100,
    },
    fetchPolicy: 'cache-and-network',
  });

  useSubscription<any>(NOUVELLE_ALERTE_SUBSCRIPTION, { onData: () => refetch() });
  useSubscription<any>(ALERTE_MISE_A_JOUR_SUBSCRIPTION, { onData: () => refetch() });

  const allAlertes = data?.alertes?.items || [];
  const displayedAlertes = filterActiveOnly
    ? allAlertes.filter((a: any) =>
        ['NOUVELLE', 'RECUE', 'EN_COURS', 'EQUIPE_EN_ROUTE'].includes(a.statut)
      )
    : allAlertes;

  return (
    <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--color-brand-cream)] flex items-center gap-2">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse shrink-0" />
            Carte Tactique des Incidents en Direct
          </h2>
          <p className="text-xs text-[var(--color-brand-muted)]">
            Localisation instantanée des alertes SOS et suivi de déploiement
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="flex items-center gap-2 text-xs text-[var(--color-brand-cream)] bg-[var(--color-brand-charcoal)] px-3 py-1.5 sm:py-2 border border-[var(--color-brand-border)] rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={filterActiveOnly}
              onChange={(e) => setFilterActiveOnly(e.target.checked)}
              className="accent-[var(--color-brand-gold)]"
            />
            <span className="text-xs">Actives ({displayedAlertes.length})</span>
          </label>

          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            onClick={() => refetch()}
          >
            Actualiser
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden relative shadow-2xl border border-[var(--color-brand-border)]">
        <IncidentMap
          incidents={displayedAlertes}
          onSelectIncident={(id) => navigate(`/alertes/${id}`)}
          height="100%"
        />

        {/* Tactical Legend Box */}
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-[1000] bg-black/85 backdrop-blur-md p-2.5 sm:p-3.5 rounded-xl border border-[var(--color-brand-border)] space-y-1.5 text-[11px] sm:text-xs shadow-xl max-w-[220px] sm:max-w-none">
          <div className="font-semibold text-[var(--color-brand-cream)] flex items-center gap-1.5 border-b border-[var(--color-brand-border)] pb-1">
            <Layers className="w-3.5 h-3.5 text-[var(--color-brand-gold)] shrink-0" />
            Légende Tactique
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
            <span className="text-red-300">Critique / Nouvelle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-amber-300">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
            <span className="text-yellow-300">Équipe en route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-emerald-300">Résolue</span>
          </div>
        </div>
      </div>
    </div>
  );
};
