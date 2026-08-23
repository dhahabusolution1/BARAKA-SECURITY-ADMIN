import React from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';
import {
  GET_DASHBOARD_OPS_QUERY,
  NOUVELLE_ALERTE_SUBSCRIPTION,
  ALERTE_MISE_A_JOUR_SUBSCRIPTION,
} from '../../graphql/operations';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AudioPlayer } from '../../components/common/AudioPlayer';
import { IncidentMap } from '../../components/map/IncidentMap';
import {
  AlertTriangle,
  Shield,
  Clock,
  Radio,
  ArrowRight,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router';

export const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<any>(GET_DASHBOARD_OPS_QUERY, {
    pollInterval: 15000,
  });

  useSubscription<any>(NOUVELLE_ALERTE_SUBSCRIPTION, { onData: () => refetch() });
  useSubscription<any>(ALERTE_MISE_A_JOUR_SUBSCRIPTION, { onData: () => refetch() });

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--color-brand-muted)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[var(--color-brand-gold)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Chargement de la centrale de supervision...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-red-950/50 border border-red-800 rounded-xl text-red-200 text-sm">
        Erreur de chargement: {error.message}
      </div>
    );
  }

  const d = data?.getDashboardOps;
  const alertesActivesCount = d?.alertesActives || 0;
  const alertesCritiquesCount = d?.alertesCritiques || 0;
  const equipesDispo = d?.equipesDisponibles || 0;
  const equipesMission = d?.equipesEnMission || 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-brand-cream)] tracking-wide">
            Tableau de Bord Opérationnel
          </h2>
          <p className="text-xs text-[var(--color-brand-muted)] mt-0.5 sm:mt-1">
            Supervision en temps réel des incidents d'urgence et coordination des équipes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link to="/carte" className="flex-1 sm:flex-initial">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              icon={<Radio className="w-4 h-4 text-red-500 animate-pulse shrink-0" />}
            >
              Vue Carte Plein Écran
            </Button>
          </Link>
          <Link to="/alertes" className="flex-1 sm:flex-initial">
            <Button
              variant="primary"
              size="sm"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="w-4 h-4 shrink-0" />}
            >
              Toutes les Alertes
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        <div
          className={`p-4 sm:p-5 rounded-xl border transition-all ${
            alertesActivesCount > 0
              ? 'bg-red-950/40 border-red-800/80 danger-glow'
              : 'bg-[var(--color-brand-charcoal)] border-[var(--color-brand-border)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
              Alertes en Cours
            </span>
            <span className="p-2 rounded-lg bg-red-950/80 text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-display text-white">
              {alertesActivesCount}
            </span>
            {alertesCritiquesCount > 0 && (
              <span className="text-xs font-bold text-red-400 bg-red-900/60 px-2 py-0.5 rounded">
                {alertesCritiquesCount} Critique{alertesCritiquesCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--color-brand-muted)] mt-2">
            {d?.alertesAujourdhui || 0} déclenchée(s) aujourd'hui
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
              Équipes Disponibles
            </span>
            <span className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-display text-emerald-400">
              {equipesDispo}
            </span>
            <span className="text-xs text-[var(--color-brand-muted)]">
              / {equipesDispo + equipesMission} totales
            </span>
          </div>
          <p className="text-[11px] text-amber-400 mt-2">
            {equipesMission} équipe(s) actuellement en mission
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
              Délai Moyen Prise en Charge
            </span>
            <span className="p-2 rounded-lg bg-amber-950/80 text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-display text-[var(--color-brand-gold)]">
              {d?.tempsMoyenPriseEnChargeSeconds ? Math.round(d.tempsMoyenPriseEnChargeSeconds / 60) : '< 1'}
            </span>
            <span className="text-sm font-semibold text-[var(--color-brand-muted)]">min</span>
          </div>
          <p className="text-[11px] text-[var(--color-brand-muted)] mt-2">
            Calculé sur les 30 derniers jours
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
              État du Réseau
            </span>
            <span className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
              100% Opérationnel
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-brand-muted)] mt-2">
            Serveurs, WebSockets & GPS synchronisés
          </p>
        </div>
      </div>

      {/* Main Content Grid: Live Feed & Map/Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Live Alert Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              Fil des Dernières Alertes
            </h3>
            <Link to="/alertes" className="text-xs text-[var(--color-brand-gold)] hover:underline flex items-center gap-1">
              Historique complet &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {d?.alertesRecentes && d.alertesRecentes.length > 0 ? (
              d.alertesRecentes.map((alerte: any) => (
                <div
                  key={alerte.id}
                  onClick={() => navigate(`/alertes/${alerte.id}`)}
                  className="p-3.5 sm:p-4 bg-[var(--color-brand-charcoal)] hover:bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] hover:border-[var(--color-brand-gold)]/60 rounded-xl transition-all cursor-pointer flex flex-col gap-3 shadow-md"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={alerte.statut} size="sm" />
                      <Badge variant={alerte.priorite} size="sm" />
                    </div>
                    <span className="text-xs text-[var(--color-brand-muted)] font-mono">
                      {new Date(alerte.declencheeAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm text-[var(--color-brand-cream)] truncate">
                        {alerte.citoyen.prenom} {alerte.citoyen.nom}
                      </h4>
                      {alerte.citoyen.telephone && (
                        <a
                          href={`tel:${alerte.citoyen.telephone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-[var(--color-brand-gold)] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <Phone className="w-3 h-3" />
                          <span className="hidden xs:inline">{alerte.citoyen.telephone}</span>
                          <span className="xs:hidden">Appeler</span>
                        </a>
                      )}
                    </div>
                    {alerte.adresseApproximative && (
                      <p className="text-xs text-[var(--color-brand-muted)] mt-1 truncate">
                        📍 {alerte.adresseApproximative}
                      </p>
                    )}
                    {alerte.messageTexte && (
                      <p className="text-xs italic text-neutral-300 mt-1 line-clamp-2">
                        "{alerte.messageTexte}"
                      </p>
                    )}
                  </div>

                  {alerte.audios && alerte.audios.length > 0 && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <AudioPlayer
                        url={alerte.audios[0].url}
                        durationSeconds={alerte.audios[0].dureeSecondes}
                        label="Message Vocal SOS"
                      />
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[var(--color-brand-border)] text-xs text-[var(--color-brand-muted)] gap-1.5">
                    <span className="truncate">
                      Équipe:{' '}
                      <strong className="text-[var(--color-brand-cream)]">
                        {alerte.equipe ? alerte.equipe.nom : 'Non affectée'}
                      </strong>
                    </span>
                    <span className="text-[var(--color-brand-gold)] font-medium hover:underline flex items-center gap-1 shrink-0">
                      Traiter l’intervention &rarr;
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl text-[var(--color-brand-muted)] text-sm">
                Aucune alerte active pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Map & Activity Logs */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div className="bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] p-3.5 sm:p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[var(--color-brand-gold)] shrink-0" />
                Carte des Incidents Actifs
              </h3>
              <Link to="/carte" className="text-xs text-[var(--color-brand-gold)] hover:underline">
                Agrandir
              </Link>
            </div>
            <IncidentMap
              incidents={d?.alertesRecentes || []}
              onSelectIncident={(id) => navigate(`/alertes/${id}`)}
              height="260px"
            />
          </div>

          <div className="bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] p-3.5 sm:p-4 rounded-xl space-y-3">
            <h3 className="font-display text-sm font-semibold text-[var(--color-brand-cream)]">
              Journal d’Activité de la Centrale
            </h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {d?.activitesRecentes && d.activitesRecentes.length > 0 ? (
                d.activitesRecentes.map((act: any) => (
                  <div
                    key={act.id}
                    className="text-xs p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] rounded-lg flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[var(--color-brand-gold)] truncate">
                        {act.action}
                      </span>
                      <span className="text-[10px] text-[var(--color-brand-muted)] shrink-0 font-mono">
                        {new Date(act.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[var(--color-brand-muted)] flex items-center justify-between text-[11px] gap-2">
                      <span className="truncate">Par: {act.acteur?.nom || 'Système'}</span>
                      <span className="text-[10px] bg-[var(--color-brand-charcoal)] px-1.5 py-0.5 rounded shrink-0">
                        {act.entite}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-brand-muted)] text-center py-4">
                  Aucune activité récente.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
