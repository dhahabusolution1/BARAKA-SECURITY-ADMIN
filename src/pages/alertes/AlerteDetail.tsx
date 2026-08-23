import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery, useMutation, useSubscription } from '@apollo/client/react';
import {
  GET_ALERTE_BY_ID_QUERY,
  GET_EQUIPES_QUERY,
  PRENDRE_EN_CHARGE_MUTATION,
  AFFECTER_EQUIPE_MUTATION,
  CHANGER_STATUT_ALERTE_MUTATION,
  CHANGER_PRIORITE_MUTATION,
  ALERTE_MISE_A_JOUR_SUBSCRIPTION,
} from '../../graphql/operations';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AudioPlayer } from '../../components/common/AudioPlayer';
import { IncidentMap } from '../../components/map/IncidentMap';
import { Modal } from '../../components/common/Modal';
import {
  ArrowLeft,
  Phone,
  MapPin,
  ExternalLink,
  Shield,
  Clock,
  User,
  AlertTriangle,
  Mic,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AlerteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isAffectModalOpen, setIsAffectModalOpen] = useState(false);
  const [selectedEquipeId, setSelectedEquipeId] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('RESOLUE');
  const [statusNote, setStatusNote] = useState('');

  const { data, loading, error, refetch } = useQuery<any>(GET_ALERTE_BY_ID_QUERY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  const { data: equipesData } = useQuery<any>(GET_EQUIPES_QUERY);

  // Subscriptions
  const { data: subData } = useSubscription<any>(ALERTE_MISE_A_JOUR_SUBSCRIPTION, {
    variables: { alerteId: id },
  });

  useEffect(() => {
    if (subData) {
      refetch();
    }
  }, [subData]);

  // Mutations
  const [prendreEnCharge, { loading: loadingPEC }] = useMutation<any>(
    PRENDRE_EN_CHARGE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Alerte prise en charge');
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const [affecterEquipe, { loading: loadingAffect }] = useMutation<any>(
    AFFECTER_EQUIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Équipe affectée avec succès');
        setIsAffectModalOpen(false);
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const [changerStatut, { loading: loadingStatut }] = useMutation<any>(
    CHANGER_STATUT_ALERTE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Statut mis à jour');
        setIsStatusModalOpen(false);
        setStatusNote('');
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const [changerPriorite] = useMutation<any>(CHANGER_PRIORITE_MUTATION, {
    onCompleted: () => {
      toast.success('Priorité modifiée');
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (loading && !data) {
    return (
      <div className="p-8 text-center text-[var(--color-brand-muted)]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-[var(--color-brand-gold)] border-t-transparent rounded-full animate-spin" />
          <span>Chargement de l'incident...</span>
        </div>
      </div>
    );
  }

  if (error || !data?.alerte) {
    return (
      <div className="p-4 sm:p-6 bg-red-950/50 border border-red-800 rounded-xl text-red-200">
        Alerte introuvable ou erreur de chargement.
        <div className="mt-4">
          <Link to="/alertes">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Retour aux alertes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const alerte = data.alerte;
  const equipes = equipesData?.equipes || [];
  const isClosed = ['RESOLUE', 'ANNULEE', 'FAUSSE_ALERTE'].includes(alerte.statut);

  const handleAffecter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipeId) {
      toast.error('Veuillez sélectionner une équipe');
      return;
    }
    affecterEquipe({ variables: { alerteId: alerte.id, equipeId: selectedEquipeId } });
  };

  const handleStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    changerStatut({
      variables: {
        alerteId: alerte.id,
        statut: newStatus,
        note: statusNote || undefined,
      },
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top back link & Status tags */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-[var(--color-brand-muted)] hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-[11px] sm:text-xs text-[var(--color-brand-muted)] font-mono truncate max-w-[150px] sm:max-w-none">
            ID: {alerte.id}
          </span>
          <Badge variant={alerte.priorite} size="sm" />
          <Badge variant={alerte.statut} size="sm" />
        </div>
      </div>

      {/* Operator Action Bar */}
      <div className="p-3.5 sm:p-4 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider w-full sm:w-auto mb-1 sm:mb-0">
            Actions Opérateur:
          </span>

          {alerte.statut === 'NOUVELLE' && (
            <Button
              variant="primary"
              size="sm"
              isLoading={loadingPEC}
              onClick={() => prendreEnCharge({ variables: { alerteId: alerte.id } })}
            >
              Prendre en Charge
            </Button>
          )}

          {!isClosed && (
            <Button
              variant="outline"
              size="sm"
              icon={<Shield className="w-4 h-4 text-amber-400" />}
              onClick={() => {
                setSelectedEquipeId(alerte.equipe?.id || '');
                setIsAffectModalOpen(true);
              }}
            >
              {alerte.equipe ? 'Réaffecter l’équipe' : 'Affecter une équipe'}
            </Button>
          )}

          {!isClosed && (
            <Button
              variant="dark"
              size="sm"
              onClick={() => setIsStatusModalOpen(true)}
            >
              Changer Statut / Clôturer
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--color-brand-border)] w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xs text-[var(--color-brand-muted)]">Priorité:</span>
          <select
            value={alerte.priorite}
            onChange={(e) =>
              changerPriorite({
                variables: { alerteId: alerte.id, priorite: e.target.value },
              })
            }
            className="px-2.5 py-1 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] rounded text-xs text-[var(--color-brand-cream)] cursor-pointer"
          >
            <option value="CRITIQUE">🔴 Critique</option>
            <option value="HAUTE">🟠 Haute</option>
            <option value="NORMALE">⚪ Normale</option>
          </select>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left column: Signal details, Audios, GPS */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
            <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              Détails du Signalement
            </h3>

            {alerte.messageTexte ? (
              <div className="p-3.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] rounded-lg text-sm text-[var(--color-brand-cream)]">
                <span className="text-xs font-semibold text-[var(--color-brand-muted)] block mb-1 uppercase">
                  Message d'urgence :
                </span>
                "{alerte.messageTexte}"
              </div>
            ) : (
              <p className="text-xs text-[var(--color-brand-muted)] italic">
                Aucun message texte fourni lors du déclenchement SOS.
              </p>
            )}

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                Messages Vocaux SOS ({alerte.audios?.length || 0})
              </h4>

              {alerte.audios && alerte.audios.length > 0 ? (
                <div className="space-y-2">
                  {alerte.audios.map((audio: any, idx: number) => (
                    <AudioPlayer
                      key={audio.id}
                      url={audio.url}
                      durationSeconds={audio.dureeSecondes}
                      label={`Enregistrement Vocal #${idx + 1}`}
                      uploadedAt={audio.uploadedAt}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center bg-[var(--color-brand-elevated)] rounded-lg border border-[var(--color-brand-border)] text-xs text-[var(--color-brand-muted)]">
                  Aucun message vocal enregistré pour cette alerte.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400 shrink-0" />
                Position Géographique GPS
              </h3>
              <a
                href={`https://www.google.com/maps?q=${alerte.latitude},${alerte.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[var(--color-brand-gold)] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                Ouvrir dans Google Maps
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

            {alerte.adresseApproximative && (
              <p className="text-xs font-medium text-[var(--color-brand-cream)]">
                📍 {alerte.adresseApproximative}
              </p>
            )}

            <div className="text-xs text-[var(--color-brand-muted)] font-mono break-all">
              Latitude: {alerte.latitude} · Longitude: {alerte.longitude}
              {alerte.precisionMetres && ` (Précision: ±${alerte.precisionMetres}m)`}
            </div>

            <IncidentMap
              incidents={[alerte]}
              center={[alerte.latitude, alerte.longitude]}
              zoom={15}
              height="280px"
            />
          </div>
        </div>

        {/* Right column: Citizen, Team, Timeline */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-4">
            <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" />
              Informations du Citoyen
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[var(--color-brand-border)] gap-2">
                <span className="text-[var(--color-brand-muted)] shrink-0">Nom complet:</span>
                <span className="font-semibold text-[var(--color-brand-cream)] text-right truncate">
                  {alerte.citoyen.prenom} {alerte.citoyen.nom}
                </span>
              </div>

              {alerte.citoyen.telephone && (
                <div className="flex items-center justify-between py-1.5 border-b border-[var(--color-brand-border)] gap-2">
                  <span className="text-[var(--color-brand-muted)] shrink-0">Téléphone:</span>
                  <a
                    href={`tel:${alerte.citoyen.telephone}`}
                    className="font-bold text-[var(--color-brand-gold)] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    {alerte.citoyen.telephone}
                  </a>
                </div>
              )}

              {alerte.citoyen.email && (
                <div className="flex items-center justify-between py-1.5 border-b border-[var(--color-brand-border)] gap-2">
                  <span className="text-[var(--color-brand-muted)] shrink-0">Email:</span>
                  <span className="text-[var(--color-brand-cream)] text-right truncate max-w-[200px]">
                    {alerte.citoyen.email}
                  </span>
                </div>
              )}

              {alerte.citoyen.adresse && (
                <div className="flex items-center justify-between py-1.5 border-b border-[var(--color-brand-border)] gap-2">
                  <span className="text-[var(--color-brand-muted)] shrink-0">Adresse:</span>
                  <span className="text-[var(--color-brand-cream)] text-right max-w-[200px] truncate">
                    {alerte.citoyen.adresse}
                  </span>
                </div>
              )}

              {(alerte.citoyen.contactUrgenceNom || alerte.citoyen.contactUrgenceTel) && (
                <div className="p-3 bg-[var(--color-brand-elevated)] rounded-lg border border-[var(--color-brand-border)] mt-2">
                  <span className="text-[11px] font-bold text-amber-400 block uppercase">
                    Contact d'urgence désigné :
                  </span>
                  <div className="mt-1 font-semibold text-[var(--color-brand-cream)]">
                    {alerte.citoyen.contactUrgenceNom || 'Non renseigné'}
                  </div>
                  {alerte.citoyen.contactUrgenceTel && (
                    <a
                      href={`tel:${alerte.citoyen.contactUrgenceTel}`}
                      className="text-[var(--color-brand-gold)] text-xs hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3 shrink-0" />
                      {alerte.citoyen.contactUrgenceTel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-3">
            <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400 shrink-0" />
              Équipe d'Intervention
            </h3>

            {alerte.equipe ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--color-brand-cream)]">
                    {alerte.equipe.nom}
                  </span>
                  <Badge variant={alerte.equipe.statut} size="sm" />
                </div>

                {alerte.equipe.telephone && (
                  <div className="flex items-center gap-1 text-[var(--color-brand-gold)]">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <a href={`tel:${alerte.equipe.telephone}`} className="hover:underline truncate">
                      Liaison: {alerte.equipe.telephone}
                    </a>
                  </div>
                )}

                {alerte.equipe.membres && alerte.equipe.membres.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[11px] text-[var(--color-brand-muted)] uppercase font-semibold">
                      Membres déployés:
                    </span>
                    {alerte.equipe.membres.map((m: any) => (
                      <div
                        key={m.id}
                        className="p-1.5 bg-[var(--color-brand-elevated)] rounded flex items-center justify-between gap-2"
                      >
                        <span className="text-[var(--color-brand-cream)] truncate">{m.nom}</span>
                        <span className="text-[10px] text-[var(--color-brand-muted)] shrink-0">
                          {m.roleDansEquipe || 'Agent'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center bg-[var(--color-brand-elevated)] rounded-lg text-xs text-[var(--color-brand-muted)]">
                Aucune équipe n'a encore été assignée à cette urgence.
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl space-y-3">
            <h3 className="font-display text-base font-semibold text-[var(--color-brand-cream)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-brand-muted)] shrink-0" />
              Historique de l'Intervention
            </h3>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {alerte.historiqueStatuts && alerte.historiqueStatuts.length > 0 ? (
                alerte.historiqueStatuts.map((h: any, idx: number) => (
                  <div
                    key={h.id || idx}
                    className="text-xs p-3 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] rounded-lg space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={h.statut} size="sm" />
                      <span className="text-[10px] text-[var(--color-brand-muted)] font-mono shrink-0">
                        {new Date(h.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                    {h.note && (
                      <p className="text-[11px] text-[var(--color-brand-cream)] italic mt-1">
                        "{h.note}"
                      </p>
                    )}
                    <div className="text-[10px] text-[var(--color-brand-muted)] text-right">
                      Par : {h.auteur?.nom || 'Opérateur Centrale'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-brand-muted)]">
                  Aucun historique disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAffectModalOpen}
        onClose={() => setIsAffectModalOpen(false)}
        title="Affecter une Équipe d'Intervention"
      >
        <form onSubmit={handleAffecter} className="space-y-4">
          <p className="text-xs text-[var(--color-brand-muted)]">
            Sélectionnez l'équipe à dépêcher sur les lieux de l'incident :
          </p>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {equipes.map((eq: any) => (
              <label
                key={eq.id}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                  selectedEquipeId === eq.id
                    ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-elevated)]'
                    : 'border-[var(--color-brand-border)] hover:bg-[var(--color-brand-elevated)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="equipe"
                    value={eq.id}
                    checked={selectedEquipeId === eq.id}
                    onChange={() => setSelectedEquipeId(eq.id)}
                    className="accent-[var(--color-brand-gold)]"
                  />
                  <div>
                    <div className="font-semibold text-sm text-[var(--color-brand-cream)]">
                      {eq.nom}
                    </div>
                    {eq.zoneCouverture && (
                      <div className="text-[11px] text-[var(--color-brand-muted)]">
                        Zone : {eq.zoneCouverture}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={eq.statut} size="sm" />
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-brand-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAffectModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loadingAffect}
            >
              Confirmer l’Affectation
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Changer le Statut de l'Alerte"
      >
        <form onSubmit={handleStatusChange} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Nouveau Statut
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            >
              <option value="EN_COURS">⏳ En cours d'analyse</option>
              <option value="EQUIPE_EN_ROUTE">🚔 Équipe en route</option>
              <option value="RESOLUE">✅ Résolue (Mission accomplie)</option>
              <option value="FAUSSE_ALERTE">⚠️ Fausse alerte</option>
              <option value="ANNULEE">❌ Annulée</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Note d'intervention / Rapport rapide
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Ex: Équipe arrivée sur place, situation maîtrisée, citoyen sécurisé..."
              rows={3}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-brand-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loadingStatut}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
