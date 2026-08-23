import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALERTES_QUERY } from '../../graphql/operations';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import {
  Search,
  RefreshCw,
  Phone,
  Mic,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router';

export const AlertesList: React.FC = () => {
  const navigate = useNavigate();
  const [statut, setStatut] = useState<string>('');
  const [priorite, setPriorite] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(0);
  const limit = 15;

  const { data, loading, refetch } = useQuery<any>(GET_ALERTES_QUERY, {
    variables: {
      statut: statut || undefined,
      priorite: priorite || undefined,
      search: search || undefined,
      limit,
      offset: page * limit,
    },
    fetchPolicy: 'cache-and-network',
  });

  const alertes = data?.alertes?.items || [];
  const totalCount = data?.alertes?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-brand-cream)] tracking-wide">
            Gestion des Alertes & Signaux SOS
          </h2>
          <p className="text-xs text-[var(--color-brand-muted)] mt-0.5 sm:mt-1">
            Historique complet, suivi des interventions et enregistrements audio
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="self-start sm:self-auto"
          icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          onClick={() => refetch()}
        >
          Actualiser
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 sm:p-4 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl flex flex-col md:flex-row gap-3 md:items-center justify-between shadow-md">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--color-brand-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par citoyen, téléphone, lieu..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-3 py-2 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-xs text-[var(--color-brand-cream)] placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statut}
              onChange={(e) => {
                setStatut(e.target.value);
                setPage(0);
              }}
              className="flex-1 sm:flex-initial px-3 py-2 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-xs text-[var(--color-brand-cream)] focus:outline-none cursor-pointer"
            >
              <option value="">Tous les statuts</option>
              <option value="NOUVELLE">🚨 Nouvelle</option>
              <option value="RECUE">📥 Reçue</option>
              <option value="EN_COURS">⏳ En cours</option>
              <option value="EQUIPE_EN_ROUTE">🚔 Équipe en route</option>
              <option value="RESOLUE">✅ Résolue</option>
              <option value="ANNULEE">❌ Annulée</option>
              <option value="FAUSSE_ALERTE">⚠️ Fausse alerte</option>
            </select>

            <select
              value={priorite}
              onChange={(e) => {
                setPriorite(e.target.value);
                setPage(0);
              }}
              className="flex-1 sm:flex-initial px-3 py-2 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-xs text-[var(--color-brand-cream)] focus:outline-none cursor-pointer"
            >
              <option value="">Toutes les priorités</option>
              <option value="CRITIQUE">🔴 Critique</option>
              <option value="HAUTE">🟠 Haute</option>
              <option value="NORMALE">⚪ Normale</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[var(--color-brand-muted)] font-medium self-end md:self-center">
          {totalCount} alerte(s) trouvée(s)
        </div>
      </div>

      {/* Table with responsive horizontal scrolling container */}
      <div className="bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[700px]">
            <thead>
              <tr className="bg-[var(--color-brand-elevated)] text-[var(--color-brand-muted)] border-b border-[var(--color-brand-border)] uppercase tracking-wider font-semibold">
                <th className="p-3.5 sm:p-4">Priorité / Statut</th>
                <th className="p-3.5 sm:p-4">Citoyen</th>
                <th className="p-3.5 sm:p-4">Localisation & Message</th>
                <th className="p-3.5 sm:p-4">Équipe Affectée</th>
                <th className="p-3.5 sm:p-4">Date & Heure</th>
                <th className="p-3.5 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)]">
              {loading && alertes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--color-brand-muted)]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[var(--color-brand-gold)] border-t-transparent rounded-full animate-spin" />
                      Chargement des alertes...
                    </div>
                  </td>
                </tr>
              ) : alertes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[var(--color-brand-muted)]">
                    Aucune alerte ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                alertes.map((a: any) => (
                  <tr
                    key={a.id}
                    onClick={() => navigate(`/alertes/${a.id}`)}
                    className="hover:bg-[var(--color-brand-elevated)] transition cursor-pointer"
                  >
                    <td className="p-3.5 sm:p-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <Badge variant={a.priorite} size="sm" />
                        <Badge variant={a.statut} size="sm" />
                      </div>
                    </td>

                    <td className="p-3.5 sm:p-4">
                      <div className="font-semibold text-sm text-[var(--color-brand-cream)]">
                        {a.citoyen.prenom} {a.citoyen.nom}
                      </div>
                      {a.citoyen.telephone && (
                        <a
                          href={`tel:${a.citoyen.telephone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[var(--color-brand-gold)] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          {a.citoyen.telephone}
                        </a>
                      )}
                    </td>

                    <td className="p-3.5 sm:p-4 max-w-xs">
                      {a.adresseApproximative ? (
                        <div className="text-[var(--color-brand-cream)] flex items-center gap-1 font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="truncate">{a.adresseApproximative}</span>
                        </div>
                      ) : (
                        <div className="text-[var(--color-brand-muted)] font-mono text-[11px]">
                          Lat: {a.latitude.toFixed(4)}, Lng: {a.longitude.toFixed(4)}
                        </div>
                      )}

                      {a.messageTexte && (
                        <p className="text-[var(--color-brand-muted)] truncate italic mt-1">
                          "{a.messageTexte}"
                        </p>
                      )}

                      {a.audios && a.audios.length > 0 && (
                        <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
                          <Mic className="w-3 h-3 animate-pulse" />
                          {a.audios.length} Message(s) Vocal
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 sm:p-4">
                      {a.equipe ? (
                        <div>
                          <div className="font-semibold text-[var(--color-brand-cream)]">
                            {a.equipe.nom}
                          </div>
                          <Badge variant={a.equipe.statut} size="sm" />
                        </div>
                      ) : (
                        <span className="text-[var(--color-brand-muted)] italic">
                          Non affectée
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 sm:p-4 text-[var(--color-brand-muted)] font-mono whitespace-nowrap">
                      <div>
                        {new Date(a.declencheeAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-[var(--color-brand-gold)]">
                        {new Date(a.declencheeAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="p-3.5 sm:p-4 text-right">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/alertes/${a.id}`);
                        }}
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Gérer
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-3.5 sm:p-4 border-t border-[var(--color-brand-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-brand-muted)]">
            <span>
              Page {page + 1} sur {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
