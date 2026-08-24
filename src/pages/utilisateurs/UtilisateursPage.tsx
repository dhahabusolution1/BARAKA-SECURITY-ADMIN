import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_UTILISATEURS_QUERY,
  CREER_USER_INTERNE_MUTATION,
  CHANGER_ROLE_USER_MUTATION,
  MODIFIER_UTILISATEUR_MUTATION,
  REINITIALISER_MDP_MUTATION,
  SUPPRIMER_USER_MUTATION,
} from '../../graphql/operations';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useAuthStore } from '../../stores/authStore';
import {
  UserPlus,
  Search,
  KeyRound,
  Trash2,
  Mail,
  Phone,
  Pencil,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UtilisateursPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const [roleFilter, setRoleFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(0);
  const limit = 15;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPwdModalOpen, setIsResetPwdModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('Baraka@2026');
  const [newRole, setNewRole] = useState<'OPERATEUR' | 'ADMIN'>('OPERATEUR');

  const [editNom, setEditNom] = useState('');
  const [editPrenom, setEditPrenom] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTelephone, setEditTelephone] = useState('');
  const [editAdresse, setEditAdresse] = useState('');
  const [editContactNom, setEditContactNom] = useState('');
  const [editContactTel, setEditContactTel] = useState('');

  const [resetPwd, setResetPwd] = useState('Baraka@2026');

  const { data, loading, refetch } = useQuery<any>(GET_UTILISATEURS_QUERY, {
    variables: {
      role: roleFilter || undefined,
      search: search || undefined,
      limit,
      offset: page * limit,
    },
    fetchPolicy: 'cache-and-network',
  });

  const [creerUser, { loading: loadingCreate }] = useMutation<any>(
    CREER_USER_INTERNE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Compte créé avec succès');
        setIsCreateModalOpen(false);
        setNom('');
        setPrenom('');
        setEmail('');
        setTelephone('');
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const [changerRole] = useMutation<any>(CHANGER_ROLE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('Rôle modifié avec succès');
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const [modifierUtilisateur, { loading: loadingEdit }] = useMutation<any>(
    MODIFIER_UTILISATEUR_MUTATION,
    {
      onCompleted: () => {
        toast.success('Utilisateur modifié avec succès');
        setIsEditModalOpen(false);
        refetch();
      },
      onError: (err: Error) => toast.error(err.message),
    },
  );

  const [reinitialiserMdp, { loading: loadingReset }] = useMutation<any>(
    REINITIALISER_MDP_MUTATION,
    {
      onCompleted: () => {
        toast.success('Mot de passe réinitialisé');
        setIsResetPwdModalOpen(false);
      },
      onError: (err: Error) => toast.error(err.message),
    }
  );

  const [supprimerUser] = useMutation<any>(SUPPRIMER_USER_MUTATION, {
    onCompleted: () => {
      toast.success('Utilisateur désactivé');
      refetch();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !email || !motDePasse) {
      toast.error('Veuillez renseigner tous les champs obligatoires');
      return;
    }
    creerUser({
      variables: {
        nom,
        prenom: prenom || undefined,
        email,
        telephone: telephone || undefined,
        motDePasse,
        role: newRole,
      },
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !resetPwd) return;
    reinitialiserMdp({
      variables: {
        userId: selectedUser.id,
        nouveauMotDePasse: resetPwd,
      },
    });
  };

  const openEditModal = (u: any) => {
    setSelectedUser(u);
    setEditNom(u.nom ?? '');
    setEditPrenom(u.prenom ?? '');
    setEditEmail(u.email ?? '');
    setEditTelephone(u.telephone ?? '');
    setEditAdresse(u.adresse ?? '');
    setEditContactNom(u.contactUrgenceNom ?? '');
    setEditContactTel(u.contactUrgenceTel ?? '');
    setIsEditModalOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !editNom.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }
    modifierUtilisateur({
      variables: {
        userId: selectedUser.id,
        input: {
          nom: editNom.trim(),
          prenom: editPrenom.trim() || null,
          email: editEmail.trim() || null,
          telephone: editTelephone.trim() || null,
          adresse: editAdresse.trim() || null,
          contactUrgenceNom: editContactNom.trim() || null,
          contactUrgenceTel: editContactTel.trim() || null,
        },
      },
    });
  };

  const users = data?.utilisateurs?.items || [];
  const totalCount = data?.utilisateurs?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-brand-cream)] tracking-wide">
            Comptes Utilisateurs & Droits d'Accès
          </h2>
          <p className="text-xs text-[var(--color-brand-muted)] mt-0.5 sm:mt-1">
            Administration des opérateurs de la centrale, administrateurs et citoyens enregistrés
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Créer un Opérateur / Admin
        </Button>
      </div>

      <div className="p-3.5 sm:p-4 bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl flex flex-col md:flex-row gap-3 md:items-center justify-between shadow-md">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--color-brand-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-3 py-2 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-xs text-[var(--color-brand-cream)] placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-xs text-[var(--color-brand-cream)] focus:outline-none cursor-pointer"
          >
            <option value="">Tous les rôles</option>
            <option value="OPERATEUR">🎧 Opérateur</option>
            <option value="ADMIN">🛡️ Admin</option>
            <option value="SUPER_ADMIN">👑 Super Admin</option>
            <option value="CITOYEN">📱 Citoyen</option>
            <option value="MEMBRE_EQUIPE">🛡️ Agent terrain</option>
          </select>
        </div>

        <div className="text-xs text-[var(--color-brand-muted)] font-medium self-end md:self-center">
          {totalCount} utilisateur(s)
        </div>
      </div>

      <div className="bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[650px]">
            <thead>
              <tr className="bg-[var(--color-brand-elevated)] text-[var(--color-brand-muted)] border-b border-[var(--color-brand-border)] uppercase tracking-wider font-semibold">
                <th className="p-3.5 sm:p-4">Utilisateur</th>
                <th className="p-3.5 sm:p-4">Coordonnées</th>
                <th className="p-3.5 sm:p-4">Rôle</th>
                <th className="p-3.5 sm:p-4">Inscrit le</th>
                <th className="p-3.5 sm:p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)]">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-brand-muted)]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[var(--color-brand-gold)] border-t-transparent rounded-full animate-spin" />
                      Chargement des comptes...
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-[var(--color-brand-elevated)] transition">
                    <td className="p-3.5 sm:p-4">
                      <div className="font-semibold text-sm text-[var(--color-brand-cream)]">
                        {u.prenom} {u.nom}
                      </div>
                      {u.adresse && (
                        <div className="text-[11px] text-[var(--color-brand-muted)] truncate max-w-xs">
                          {u.adresse}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 sm:p-4 space-y-1">
                      {u.email && (
                        <div className="text-[var(--color-brand-cream)] flex items-center gap-1.5 truncate max-w-[200px]">
                          <Mail className="w-3 h-3 text-[var(--color-brand-muted)] shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                      )}
                      {u.telephone && (
                        <div className="text-[var(--color-brand-gold)] flex items-center gap-1.5">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{u.telephone}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 sm:p-4">
                      {isSuperAdmin && u.id !== currentUser?.id ? (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            changerRole({
                              variables: { userId: u.id, role: e.target.value },
                            })
                          }
                          className="px-2.5 py-1 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] rounded text-xs text-[var(--color-brand-cream)] cursor-pointer"
                        >
                          <option value="OPERATEUR">Opérateur</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                          <option value="CITOYEN">Citoyen</option>
                        </select>
                      ) : (
                        <Badge variant={u.role} size="sm" />
                      )}
                    </td>

                    <td className="p-3.5 sm:p-4 text-[var(--color-brand-muted)] font-mono whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>

                    <td className="p-3.5 sm:p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 hover:bg-[var(--color-brand-charcoal)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] rounded transition cursor-pointer"
                          title="Modifier l'utilisateur"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsResetPwdModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-[var(--color-brand-charcoal)] text-[var(--color-brand-muted)] hover:text-[var(--color-brand-gold)] rounded transition cursor-pointer"
                          title="Réinitialiser le mot de passe"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Désactiver le compte de ${u.nom} ?`)) {
                                supprimerUser({ variables: { userId: u.id } });
                              }
                            }}
                            className="p-1.5 hover:bg-[var(--color-brand-charcoal)] text-neutral-500 hover:text-red-400 rounded transition cursor-pointer"
                            title="Supprimer le compte"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un Compte Opérateur / Admin"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Nom *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: MUTOMBO"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Prénom
              </label>
              <input
                type="text"
                placeholder="Ex: Eric"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Email Professionnel *
            </label>
            <input
              type="email"
              required
              placeholder="e.mutombo@barakasecurity.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Téléphone
            </label>
            <input
              type="tel"
              placeholder="+243..."
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Rôle initial
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
              >
                <option value="OPERATEUR">🎧 Opérateur Centrale</option>
                <option value="ADMIN">🛡️ Administrateur</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Mot de Passe Initial
              </label>
              <input
                type="text"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-xs text-[var(--color-brand-cream)] focus:outline-none font-mono"
              />
            </div>
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
              Créer le Compte
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier l'Utilisateur"
        maxWidth="lg"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <p className="text-xs text-[var(--color-brand-muted)]">
            Mettre à jour les informations de {selectedUser?.prenom} {selectedUser?.nom}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Nom *
              </label>
              <input
                type="text"
                required
                value={editNom}
                onChange={(e) => setEditNom(e.target.value)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Prénom
              </label>
              <input
                type="text"
                value={editPrenom}
                onChange={(e) => setEditPrenom(e.target.value)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Email
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                Téléphone
              </label>
              <input
                type="tel"
                value={editTelephone}
                onChange={(e) => setEditTelephone(e.target.value)}
                className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Adresse
            </label>
            <input
              type="text"
              value={editAdresse}
              onChange={(e) => setEditAdresse(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
            />
          </div>

          {selectedUser?.role === 'CITOYEN' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--color-brand-border)]">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                  Contact d'urgence
                </label>
                <input
                  type="text"
                  value={editContactNom}
                  onChange={(e) => setEditContactNom(e.target.value)}
                  placeholder="Nom du contact"
                  className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
                  Tél. contact d'urgence
                </label>
                <input
                  type="tel"
                  value={editContactTel}
                  onChange={(e) => setEditContactTel(e.target.value)}
                  placeholder="+243..."
                  className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-brand-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={loadingEdit}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isResetPwdModalOpen}
        onClose={() => setIsResetPwdModalOpen(false)}
        title="Réinitialiser le Mot de Passe"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-xs text-[var(--color-brand-muted)]">
            Définir un nouveau mot de passe pour {selectedUser?.nom} :
          </p>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-brand-muted)] mb-1 uppercase">
              Nouveau Mot de Passe
            </label>
            <input
              type="text"
              required
              value={resetPwd}
              onChange={(e) => setResetPwd(e.target.value)}
              className="w-full p-2.5 bg-[var(--color-brand-elevated)] border border-[var(--color-brand-border)] focus:border-[var(--color-brand-gold)] rounded-lg text-sm text-[var(--color-brand-cream)] focus:outline-none font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-brand-border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetPwdModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loadingReset}
            >
              Sauvegarder le Mot de Passe
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
