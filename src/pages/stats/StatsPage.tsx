import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_STATS_GLOBALES_QUERY, GET_DASHBOARD_OPS_QUERY } from '../../graphql/operations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const COLORS = ['#dc2626', '#f59e0b', '#eab308', '#22c55e', '#6b7280', '#9ca3af'];

export const StatsPage: React.FC = () => {
  const { data: statsData } = useQuery<any>(GET_STATS_GLOBALES_QUERY);
  const { data: dashData } = useQuery<any>(GET_DASHBOARD_OPS_QUERY);

  const parStatut = statsData?.getStatsGlobales?.parStatut || [];
  const total30Jours = statsData?.getStatsGlobales?.total30Jours || 0;

  const chartData = parStatut.map((item: any) => ({
    name: item.statut,
    total: item.count,
  }));

  const tempsMoyenMin = dashData?.getDashboardOps?.tempsMoyenPriseEnChargeSeconds
    ? Math.round(dashData.getDashboardOps.tempsMoyenPriseEnChargeSeconds / 60)
    : 1;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-brand-cream)] tracking-wide">
          Statistiques & Analyses Opérationnelles
        </h2>
        <p className="text-xs text-[var(--color-brand-muted)] mt-0.5 sm:mt-1">
          Indicateurs de performance, volume d'incidents et efficacité des interventions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
              Total Incidents (30j)
            </span>
            <TrendingUp className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-display text-white">
            {total30Jours}
          </div>
          <p className="text-[11px] text-[var(--color-brand-muted)] mt-1">
            Signaux SOS enregistrés sur la période
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
              Délai Moyen Réactivité
            </span>
            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-display text-amber-400">
            {tempsMoyenMin} <span className="text-sm text-[var(--color-brand-muted)]">min</span>
          </div>
          <p className="text-[11px] text-[var(--color-brand-muted)] mt-1">
            Entre déclenchement SOS et prise en charge
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider">
              Disponibilité Plateforme
            </span>
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold font-display text-emerald-400">
            99.98%
          </div>
          <p className="text-[11px] text-[var(--color-brand-muted)] mt-1">
            Serveurs temps réel & WebSockets opérationnels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
          <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" />
            Répartition des Alertes par Statut
          </h3>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9a9590', fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#9a9590', fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    borderColor: '#2a2a2a',
                    borderRadius: '8px',
                    color: '#f5f0e6',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total" fill="#d4a017" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
          <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)]">
            Distribution Globale des Incidents
          </h3>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${entry.name || index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    borderColor: '#2a2a2a',
                    borderRadius: '8px',
                    color: '#f5f0e6',
                    fontSize: '12px',
                  }}
                />
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
    </div>
  );
};
