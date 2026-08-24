import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_EQUIPES_QUERY,
  CREER_EQUIPE_MUTATION,
  MODIFIER_EQUIPE_MUTATION,
  SUPPRIMER_EQUIPE_MUTATION,
  AJOUTER_MEMBRE_EQUIPE_MUTATION,
  RETIRER_MEMBRE_EQUIPE_MUTATION,
  ACTIVER_ACCES_MEMBRE_EQUIPE_MUTATION,
} from '../../graphql/operations';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuthStore } from '../../stores/authStore';
import {
  Shield,
  Plus,
  Phone,
  MapPin,
  Users,
  Trash2,
  UserPlus,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EquipesPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [activeEquipeId, setActiveEquipeId] = useState<string | null>(null);
  const [accessMembreId, setAccessMembreId] = useState<string | null>(null);
  const [accessPassword, setAccessPassword] = useState('Baraka@2026');

  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [zoneCouverture, setZoneCouverture] = useState('');

  const [membreNom, setMembreNom] = useState('');
  const [membreTel, setMembreTel] = useState('');
  const [membreRole, setMembreRole] = useState('');

  const { data, loading, refetch } = useQuery<any>(GET_EQUIPES_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const [creerEquipe, { loading: loadingCreate }] = useMutation<any>(
    CREER_EQUIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Équipe créée avec succès');
        setIsCreateModalOpen(false);
        setNom('');
        setTelephone('');
        setZoneCouverture('');
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const [modifierEquipe] = useMutation<any>(MODIFIER_EQUIPE_MUTATION, {
    onCompleted: () => {
      toast.success('Statut équipe mis à jour');
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const [supprimerEquipe] = useMutation<any>(SUPPRIMER_EQUIPE_MUTATION, {
    onCompleted: () => {
      toast.success('Équipe supprimée');
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const [ajouterMembre, { loading: loadingAddMembre }] = useMutation<any>(
    AJOUTER_MEMBRE_EQUIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Membre ajouté à l’équipe');
        setIsAddMemberModalOpen(false);
        setMembreNom('');
        setMembreTel('');
        setMembreRole('');
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const [retirerMembre] = useMutation<any>(RETIRER_MEMBRE_EQUIPE_MUTATION, {
    onCompleted: () => {
      toast.success('Membre retiré');
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const [activerAcces, { loading: loadingAccess }] = useMutation<any>(
    ACTIVER_ACCES_MEMBRE_EQUIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Accès app mobile activé pour cet agent');
        setIsAccessModalOpen(false);
        setAccessMembreId(null);
        setAccessPassword('Baraka@2026');
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const handleCreateEquipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom) {
      toast.error('Le nom de l’équipe est obligatoire');
      return;
    }
    creerEquipe({
      variables: {
        input: {
          nom,
          telephone: telephone || undefined,
          zoneCouverture: zoneCouverture || undefined,
        },
      },
    });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEquipeId || !membreNom) {
      toast.error('Le nom du membre est requis');
      return;
    }
    ajouterMembre({
      variables: {
        equipeId: activeEquipeId,
        input: {
          nom: membreNom,
          telephone: membreTel || undefined,
          roleDansEquipe: membreRole || undefined,
        },
      },
    });
  };

  const equipes = data?.equipes || [];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-brand-cream)] tracking-wide">
            Équipes d'Intervention & Secours
          </h2>
          <p className="text-xs text-[var(--color-brand-muted)] mt-0.5 sm:mt-1">
            Gestion des unités mobiles d'intervention sur le terrain et de leurs effectifs
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Créer une Nouvelle Équipe
          </Button>
        )}
      </div>

      {loading && equipes.length === 0 ? (
        <div className="p-8 text-center text-[var(--color-brand-muted)]">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[var(--color-brand-gold)] border-t-transparent rounded-full animate-spin" />
            Chargement des équipes...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {equipes.map((equipe: any) => (
            <div
              key={equipe.id}
              className="p-4 sm:p-5 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl flex flex-col justify-between gap-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base text-[var(--color-brand-cream)] flex items-center gap-2 truncate">
                      <Shield className="w-4 h-4 text-[var(--color-brand-gold)] shrink-0" />
                      <span className="truncate">{equipe.nom}</span>
                    </h3>
                    {equipe.zoneCouverture && (
                      <p className="text-xs text-[var(--color-brand-muted)] flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{equipe.zoneCouverture}</span>
                      </p>
                    )}
                  </div>
                  <Badge variant={equipe.statut} size="sm" />
                </div>

                {equipe.telephone && (
                  <div className="text-xs text-[var(--color-brand-gold)] flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <a href={`tel:${equipe.telephone}`} className="hover:underline truncate">
                      {equipe.telephone}
                    </a>
                  </div>
                )}

                <div className="pt-2 border-t border-[var(--color-brand-border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[var(--color-brand-muted)] uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      Membres ({equipe.membres?.length || 0})
                    </span>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveEquipeId(equipe.id);
                          setIsAddMemberModalOpen(true);
                        }}
                        className="text-xs text-[var(--color-brand-gold)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        Ajouter
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {equipe.membres && equipe.membres.length > 0 ? (
                      equipe.membres.map((m: any) => (
                        <div
                          key={m.id}
                          className="p-2 bg-[var(--color-brand-elevated)] rounded-md flex items-center justify-between text-xs gap-2"
                        >
                          <div className="min-w-0">
                            <span className="font-medium text-[var(--color-brand-cream)] block truncate">
                              {m.nom}
                            </span>
                            <span className="text-[10px] text-[var(--color-brand-muted)] block truncate">
                              {m.roleDansEquipe || 'Agent'} {m.telephone && `· ${m.telephone}`}
                              {m.hasAccesApp ? ' · App OK' : ''}
                            </span>
                          </div>

                          {isAdmin && (
                            <div className="flex items-center shrink-0">
                              {!m.hasAccesApp && (
                                <button
                                  onClick={() => {
                                    setAccessMembreId(m.id);
                                    setAccessPassword('Baraka@2026');
                                    setIsAccessModalOpen(true);
                                  }}
                                  className="text-[var(--color-brand-gold)] hover:text-white p-1 cursor-pointer"
                                  title="Activer l’accès app mobile"
                                >
                                  <Smartphone className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => retirerMembre({ variables: { membreId: m.id } })}
                                className="text-[var(--color-brand-muted)] hover:text-red-400 p-1 cursor-pointer"
                                title="Retirer ce membre"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-[var(--color-brand-muted)] italic py-1">
                        Aucun agent affecté à cette équipe.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-brand-border)] flex items-center justify-between gap-2">
                <select
                  value={equipe.statut}
                  onChange={(e) =>
                    modifierEquipe({
                      variables: { id: equipe.id, input: { statut: e.target.value } },
                    })
                  }
                  className="px-2.5 py-1 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] rounded text-xs text-[var(--color-brand-cream)] cursor-pointer"
                >
                  <option value="DISPONIBLE">🟢 Disponible</option>
                  <option value="EN_MISSION">🟡 En mission</option>
                  <option value="HORS_SERVICE">⚪ Hors service</option>
                </select>

                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer l'équipe "${equipe.nom}" ?`)) {
                        supprimerEquipe({ variables: { id: equipe.id } });
                      }
                    }}
                    className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-[var(--color-brand-elevated)] transition cursor-pointer"
                    title="Supprimer l'équipe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer une Nouvelle Équipe"
      >
        <form onSubmit={handleCreateEquipe} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Nom de l'équipe *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Équipe Echo - Brigade Rapide"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Téléphone / Radio de liaison
            </label>
            <input
              type="tel"
              placeholder="+243820000..."
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Zone de Couverture
            </label>
            <input
              type="text"
              placeholder="Ex: Commune de Limete - Quartier Résidentiel"
              value={zoneCouverture}
              onChange={(e) => setZoneCouverture(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-brand-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loadingCreate}
            >
              Créer l'Équipe
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Ajouter un Membre à l'Équipe"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Nom & Prénom de l'agent *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Agent KABEYA"
              value={membreNom}
              onChange={(e) => setMembreNom(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Téléphone
            </label>
            <input
              type="tel"
              placeholder="+243810000..."
              value={membreTel}
              onChange={(e) => setMembreTel(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Rôle dans l'équipe
            </label>
            <input
              type="text"
              placeholder="Ex: Chef d'équipe, Paramédic, Chauffeur..."
              value={membreRole}
              onChange={(e) => setMembreRole(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-brand-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddMemberModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loadingAddMembre}
            >
              Ajouter le Membre
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        title="Activer l’accès app mobile"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!accessMembreId || !accessPassword) {
              toast.error('Mot de passe requis');
              return;
            }
            activerAcces({
              variables: { membreId: accessMembreId, motDePasse: accessPassword },
            });
          }}
          className="space-y-4"
        >
          <p className="text-xs text-[var(--color-brand-muted)]">
            L’agent se connectera sur l’app Flutter avec son numéro de téléphone et ce mot de passe.
          </p>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Mot de passe initial *
            </label>
            <input
              type="text"
              required
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-brand-border)]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAccessModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={loadingAccess}>
              Activer l’accès
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
