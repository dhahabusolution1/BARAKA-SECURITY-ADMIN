import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_STATS_GLOBALES_QUERY } from '../../graphql/operations';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Headphones,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

const STATUT_LABELS: Record<string, string> = {
  NOUVELLE: 'Nouvelle',
  RECUE: 'Reçue',
  EN_COURS: 'En cours',
  EQUIPE_EN_ROUTE: 'Équipe en route',
  RESOLUE: 'Résolue',
  ANNULEE: 'Annulée',
  FAUSSE_ALERTE: 'Fausse alerte',
};

const STATUT_COLORS: Record<string, string> = {
  NOUVELLE: '#dc2626',
  RECUE: '#ea580c',
  EN_COURS: '#f59e0b',
  EQUIPE_EN_ROUTE: '#eab308',
  RESOLUE: '#22c55e',
  ANNULEE: '#6b7280',
  FAUSSE_ALERTE: '#9ca3af',
};

const PRIORITE_LABELS: Record<string, string> = {
  CRITIQUE: 'Critique',
  HAUTE: 'Haute',
  NORMALE: 'Normale',
};

const PRIORITE_COLORS: Record<string, string> = {
  CRITIQUE: '#dc2626',
  HAUTE: '#f59e0b',
  NORMALE: '#6b7280',
};

const PERIODES = [
  { label: '7 jours', value: 7 },
  { label: '30 jours', value: 30 },
  { label: '90 jours', value: 90 },
];

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '—';
  if (seconds < 60) return `${Math.round(seconds)} s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

function formatDateLabel(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

const tooltipStyle = {
  backgroundColor: '#141414',
  borderColor: '#2a2a2a',
  borderRadius: '8px',
  color: '#f5f0e6',
  fontSize: '12px',
};

type KpiCardProps = {
  label: string;
  value: React.ReactNode;
  hint: string;
  icon: React.ReactNode;
  accent?: string;
};

const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, icon, accent = 'text-white' }) => (
  <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] sm:text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
        {label}
      </span>
      {icon}
    </div>
    <div className={`mt-2 text-2xl sm:text-3xl font-bold font-display ${accent}`}>{value}</div>
    <p className="text-[11px] text-[var(--color-brand-muted)] mt-1">{hint}</p>
  </div>
);

export const StatsPage: React.FC = () => {
  const [periode, setPeriode] = useState(30);

  const { data, loading, refetch } = useQuery<any>(GET_STATS_GLOBALES_QUERY, {
    variables: { periodeJours: periode },
    fetchPolicy: 'cache-and-network',
  });

  const stats = data?.getStatsGlobales;

  const parStatut = useMemo(
    () =>
      (stats?.parStatut || []).map((item: any) => ({
        name: STATUT_LABELS[item.statut] || item.statut,
        statut: item.statut,
        total: item.count,
      })),
    [stats?.parStatut]
  );

  const parPriorite = useMemo(
    () =>
      (stats?.parPriorite || []).map((item: any) => ({
        name: PRIORITE_LABELS[item.priorite] || item.priorite,
        priorite: item.priorite,
        total: item.count,
      })),
    [stats?.parPriorite]
  );

  const volumeParJour = useMemo(
    () =>
      (stats?.volumeParJour || []).map((item: any) => ({
        ...item,
        label: formatDateLabel(item.date),
      })),
    [stats?.volumeParJour]
  );

  const volumeParHeure = useMemo(
    () =>
      (stats?.volumeParHeure || []).map((item: any) => ({
        ...item,
        label: `${String(item.heure).padStart(2, '0')}h`,
      })),
    [stats?.volumeParHeure]
  );

  const variationJour =
    stats?.alertesHier && stats.alertesHier > 0
      ? Math.round(((stats.alertesAujourdhui - stats.alertesHier) / stats.alertesHier) * 100)
      : stats?.alertesAujourdhui > 0
        ? 100
        : 0;

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--color-brand-muted)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[var(--color-brand-gold)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Calcul des indicateurs opérationnels...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-brand-cream)] tracking-wide">
            Statistiques Opérationnelles
          </h2>
          <p className="text-xs text-[var(--color-brand-muted)] mt-0.5 sm:mt-1">
            Performance d'intervention à Lubumbashi — volumes SOS et activité des équipes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-[var(--color-brand-border)] overflow-hidden">
            {PERIODES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriode(p.value)}
                className={`px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  periode === p.value
                    ? 'bg-[var(--color-brand-gold)] text-black'
                    : 'bg-[var(--color-brand-charcoal)] text-[var(--color-brand-muted)] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiCard
          label={`SOS signalés (${periode}j)`}
          value={stats?.totalPeriode ?? 0}
          hint={`Moyenne : ${stats?.moyenneParJour ?? 0} alertes / jour`}
          icon={<AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
        />
        <KpiCard
          label="Aujourd'hui"
          value={
            <span className="flex items-baseline gap-2 flex-wrap">
              {stats?.alertesAujourdhui ?? 0}
              {variationJour !== 0 && (
                <span
                  className={`text-xs font-sans font-medium flex items-center gap-0.5 ${
                    variationJour > 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {variationJour > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {variationJour > 0 ? '+' : ''}
                  {variationJour}% vs hier
                </span>
              )}
            </span>
          }
          hint={`Hier : ${stats?.alertesHier ?? 0} alerte(s)`}
          icon={<BarChart3 className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" />}
        />
        <KpiCard
          label="Délai prise en charge"
          value={formatDuration(stats?.tempsMoyenPriseEnChargeSeconds ?? 0)}
          hint="Entre déclenchement SOS et prise en charge opérateur"
          icon={<Clock className="w-5 h-5 text-amber-400 shrink-0" />}
          accent="text-amber-400"
        />
        <KpiCard
          label="Délai résolution"
          value={formatDuration(stats?.tempsMoyenResolutionSeconds ?? 0)}
          hint="Entre déclenchement et clôture de l'incident"
          icon={<Clock className="w-5 h-5 text-emerald-400 shrink-0" />}
          accent="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiCard
          label="Délai affectation équipe"
          value={formatDuration(stats?.tempsMoyenAffectationEquipeSeconds ?? 0)}
          hint="Entre SOS et envoi d'une équipe sur les lieux"
          icon={<Shield className="w-5 h-5 text-yellow-400 shrink-0" />}
          accent="text-yellow-300"
        />
        <KpiCard
          label="Taux de résolution"
          value={`${stats?.tauxResolution ?? 0}%`}
          hint="Incidents résolus parmi les dossiers clôturés"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />}
          accent="text-emerald-400"
        />
        <KpiCard
          label="Fausses alertes"
          value={`${stats?.tauxFaussesAlertes ?? 0}%`}
          hint={`${stats?.alertesCritiques ?? 0} alertes critiques · ${stats?.tauxResolutionCritiques ?? 0}% résolues`}
          icon={<AlertTriangle className="w-5 h-5 text-neutral-400 shrink-0" />}
          accent="text-neutral-300"
        />
        <KpiCard
          label="Équipes mobilisées"
          value={
            <span>
              {stats?.equipesEnMission ?? 0}
              <span className="text-sm text-[var(--color-brand-muted)] font-sans font-normal">
                {' '}
                / {stats?.equipesTotal ?? 0}
              </span>
            </span>
          }
          hint={`${stats?.equipesDisponibles ?? 0} équipe(s) disponible(s) actuellement`}
          icon={<Shield className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <KpiCard
          label="Citoyens actifs"
          value={stats?.citoyensActifs ?? 0}
          hint={`Sur ${stats?.totalCitoyens ?? 0} citoyen(s) inscrit(s)`}
          icon={<Users className="w-5 h-5 text-blue-400 shrink-0" />}
        />
        <KpiCard
          label="Messages vocaux"
          value={stats?.alertesAvecAudio ?? 0}
          hint="Alertes accompagnées d'un enregistrement audio"
          icon={<Headphones className="w-5 h-5 text-purple-400 shrink-0" />}
        />
        <KpiCard
          label="Alertes critiques"
          value={stats?.alertesCritiques ?? 0}
          hint={`${stats?.tauxResolutionCritiques ?? 0}% résolues sur la période`}
          icon={<AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
          accent="text-red-400"
        />
      </div>

      <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
        <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)]">
          Volume d'alertes — {periode} derniers jours
        </h3>
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeParJour} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4a017" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#9a9590', fontSize: 10 }}
                interval={periode <= 7 ? 0 : Math.floor(volumeParJour.length / 6)}
              />
              <YAxis tick={{ fill: '#9a9590', fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="count"
                name="Alertes"
                stroke="#d4a017"
                fill="url(#volumeGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
          <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)]">
            Répartition par statut
          </h3>
          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parStatut} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#9a9590', fontSize: 10 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#9a9590', fontSize: 10 }}
                  width={90}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" name="Alertes" radius={[0, 4, 4, 0]}>
                  {parStatut.map((entry: any) => (
                    <Cell
                      key={entry.statut}
                      fill={STATUT_COLORS[entry.statut] || '#d4a017'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
          <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)]">
            Répartition par priorité
          </h3>
          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={parPriorite}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {parPriorite.map((entry: any) => (
                    <Cell
                      key={entry.priorite}
                      fill={PRIORITE_COLORS[entry.priorite] || '#d4a017'}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#9a9590' }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
        <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)]">
          Heures de pointe (0h – 23h)
        </h3>
        <p className="text-[11px] text-[var(--color-brand-muted)] -mt-2">
          Distribution horaire des SOS sur la période — utile pour le dimensionnement des équipes
        </p>
        <div className="h-56 sm:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeParHeure} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#9a9590', fontSize: 10 }} interval={1} />
              <YAxis tick={{ fill: '#9a9590', fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" name="Alertes" fill="#dc2626" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
          <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)]">
            Performance des équipes
          </h3>
          {(stats?.equipesPerformance || []).length === 0 ? (
            <p className="text-sm text-[var(--color-brand-muted)] py-8 text-center">
              Aucune intervention enregistrée sur cette période.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--color-brand-muted)] border-b border-[var(--color-brand-border)]">
                    <th className="pb-2 pr-3 font-semibold">Équipe</th>
                    <th className="pb-2 px-3 font-semibold text-center">Interventions</th>
                    <th className="pb-2 pl-3 font-semibold text-right">Résolution moy.</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.equipesPerformance || []).map((eq: any) => (
                    <tr
                      key={eq.equipeId}
                      className="border-b border-[var(--color-brand-border)]/60 last:border-0"
                    >
                      <td className="py-2.5 pr-3 font-medium text-[var(--color-brand-cream)]">
                        {eq.nom}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[var(--color-brand-gold)] font-semibold">
                        {eq.interventions}
                      </td>
                      <td className="py-2.5 pl-3 text-right text-[var(--color-brand-muted)]">
                        {eq.tempsMoyenResolutionMinutes != null
                          ? `${eq.tempsMoyenResolutionMinutes} min`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
          <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)]">
            Opérateurs les plus actifs
          </h3>
          {(stats?.operateursActifs || []).length === 0 ? (
            <p className="text-sm text-[var(--color-brand-muted)] py-8 text-center">
              Aucune prise en charge enregistrée sur cette période.
            </p>
          ) : (
            <div className="space-y-2">
              {(stats?.operateursActifs || []).slice(0, 8).map((op: any, index: number) => (
                <div
                  key={op.operateurId}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[var(--color-brand-gold)]/15 text-[var(--color-brand-gold)] text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-[var(--color-brand-cream)] truncate">
                      {op.prenom ? `${op.prenom} ${op.nom}` : op.nom}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--color-brand-gold)] shrink-0">
                    {op.prisesEnCharge} prise{op.prisesEnCharge > 1 ? 's' : ''} en charge
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
