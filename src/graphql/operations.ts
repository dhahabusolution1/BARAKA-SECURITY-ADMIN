import { gql } from '@apollo/client';

export const LOGIN_OPS_MUTATION = gql`
  mutation LoginOps($email: String!, $motDePasse: String!) {
    loginOps(email: $email, motDePasse: $motDePasse) {
      accessToken
      refreshToken
      user {
        id
        nom
        prenom
        email
        telephone
        role
        photoUrl
        adresse
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        id
        nom
        prenom
        email
        telephone
        role
        photoUrl
        adresse
        contactUrgenceNom
        contactUrgenceTel
      }
    }
  }
`;

export const UPDATE_FCM_TOKEN_MUTATION = gql`
  mutation UpdateFcmToken($token: String!, $plateforme: Plateforme!) {
    updateFcmToken(token: $token, plateforme: $plateforme)
  }
`;

export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      nom
      prenom
      email
      telephone
      role
      photoUrl
    }
  }
`;

export const GET_DASHBOARD_OPS_QUERY = gql`
  query GetDashboardOps {
    getDashboardOps {
      alertesActives
      alertesCritiques
      alertesAujourdhui
      equipesDisponibles
      equipesEnMission
      tempsMoyenPriseEnChargeSeconds
      alertesRecentes {
        id
        latitude
        longitude
        adresseApproximative
        messageTexte
        statut
        priorite
        declencheeAt
        citoyen {
          id
          nom
          prenom
          telephone
        }
        equipe {
          id
          nom
        }
        audios {
          id
          url
          dureeSecondes
        }
      }
      activitesRecentes {
        id
        action
        entite
        entiteId
        details
        createdAt
        acteur {
          id
          nom
          role
        }
      }
    }
  }
`;

export const GET_STATS_GLOBALES_QUERY = gql`
  query GetStatsGlobales($periodeJours: Int) {
    getStatsGlobales(periodeJours: $periodeJours) {
      periodeJours
      totalPeriode
      total30Jours
      alertesAujourdhui
      alertesHier
      moyenneParJour
      tempsMoyenPriseEnChargeSeconds
      tempsMoyenResolutionSeconds
      tempsMoyenAffectationEquipeSeconds
      tauxResolution
      tauxFaussesAlertes
      alertesCritiques
      tauxResolutionCritiques
      alertesAvecAudio
      citoyensActifs
      totalCitoyens
      equipesDisponibles
      equipesEnMission
      equipesTotal
      parStatut {
        statut
        count
      }
      parPriorite {
        priorite
        count
      }
      volumeParJour {
        date
        count
      }
      volumeParHeure {
        heure
        count
      }
      equipesPerformance {
        equipeId
        nom
        interventions
        tempsMoyenResolutionMinutes
      }
      operateursActifs {
        operateurId
        nom
        prenom
        prisesEnCharge
      }
    }
  }
`;

export const GET_ALERTES_QUERY = gql`
  query GetAlertes(
    $statut: StatutAlerte
    $priorite: PrioriteAlerte
    $search: String
    $dateDebut: DateTime
    $dateFin: DateTime
    $limit: Int
    $offset: Int
  ) {
    alertes(
      statut: $statut
      priorite: $priorite
      search: $search
      dateDebut: $dateDebut
      dateFin: $dateFin
      limit: $limit
      offset: $offset
    ) {
      totalCount
      hasMore
      items {
        id
        latitude
        longitude
        precisionMetres
        adresseApproximative
        messageTexte
        statut
        priorite
        declencheeAt
        priseEnChargeAt
        resolueAt
        citoyen {
          id
          nom
          prenom
          telephone
          email
          adresse
          contactUrgenceNom
          contactUrgenceTel
        }
        equipe {
          id
          nom
          telephone
          statut
        }
        operateurPriseEnCharge {
          id
          nom
          role
        }
        audios {
          id
          url
          publicId
          dureeSecondes
          mimeType
          uploadedAt
        }
        historiqueStatuts {
          id
          statut
          note
          createdAt
          auteur {
            id
            nom
            role
          }
        }
      }
    }
  }
`;

export const GET_ALERTE_BY_ID_QUERY = gql`
  query GetAlerteById($id: ID!) {
    alerte(id: $id) {
      id
      latitude
      longitude
      precisionMetres
      adresseApproximative
      messageTexte
      statut
      priorite
      declencheeAt
      priseEnChargeAt
      resolueAt
      citoyen {
        id
        nom
        prenom
        telephone
        email
        adresse
        contactUrgenceNom
        contactUrgenceTel
      }
      equipe {
        id
        nom
        telephone
        statut
        membres {
          id
          nom
          telephone
          roleDansEquipe
        }
      }
      operateurPriseEnCharge {
        id
        nom
        email
        role
      }
      audios {
        id
        url
        publicId
        dureeSecondes
        mimeType
        uploadedAt
      }
      historiqueStatuts {
        id
        statut
        note
        createdAt
        auteur {
          id
          nom
          role
        }
      }
    }
  }
`;

export const PRENDRE_EN_CHARGE_MUTATION = gql`
  mutation PrendreEnCharge($alerteId: ID!) {
    prendreEnCharge(alerteId: $alerteId) {
      id
      statut
      operateurPriseEnCharge {
        id
        nom
      }
    }
  }
`;

export const AFFECTER_EQUIPE_MUTATION = gql`
  mutation AffecterEquipe($alerteId: ID!, $equipeId: ID!) {
    affecterEquipe(alerteId: $alerteId, equipeId: $equipeId) {
      id
      statut
      equipe {
        id
        nom
      }
    }
  }
`;

export const CHANGER_STATUT_ALERTE_MUTATION = gql`
  mutation ChangerStatutAlerte($alerteId: ID!, $statut: StatutAlerte!, $note: String) {
    changerStatutAlerte(alerteId: $alerteId, statut: $statut, note: $note) {
      id
      statut
      resolueAt
    }
  }
`;

export const CHANGER_PRIORITE_MUTATION = gql`
  mutation ChangerPriorite($alerteId: ID!, $priorite: PrioriteAlerte!) {
    changerPriorite(alerteId: $alerteId, priorite: $priorite) {
      id
      priorite
    }
  }
`;

export const GET_EQUIPES_QUERY = gql`
  query GetEquipes($statut: StatutEquipe) {
    equipes(statut: $statut) {
      id
      nom
      telephone
      zoneCouverture
      statut
      membres {
        id
        nom
        telephone
        roleDansEquipe
        hasAccesApp
        userId
      }
      alertes {
        id
        statut
      }
    }
  }
`;

export const CREER_EQUIPE_MUTATION = gql`
  mutation CreerEquipe($input: CreateEquipeInput!) {
    creerEquipe(input: $input) {
      id
      nom
      statut
    }
  }
`;

export const MODIFIER_EQUIPE_MUTATION = gql`
  mutation ModifierEquipe($id: ID!, $input: UpdateEquipeInput!) {
    modifierEquipe(id: $id, input: $input) {
      id
      nom
      telephone
      zoneCouverture
      statut
    }
  }
`;

export const SUPPRIMER_EQUIPE_MUTATION = gql`
  mutation SupprimerEquipe($id: ID!) {
    supprimerEquipe(id: $id)
  }
`;

export const AJOUTER_MEMBRE_EQUIPE_MUTATION = gql`
  mutation AjouterMembreEquipe($equipeId: ID!, $input: MembreEquipeInput!) {
    ajouterMembreEquipe(equipeId: $equipeId, input: $input) {
      id
      nom
      telephone
      roleDansEquipe
    }
  }
`;

export const RETIRER_MEMBRE_EQUIPE_MUTATION = gql`
  mutation RetirerMembreEquipe($membreId: ID!) {
    retirerMembreEquipe(membreId: $membreId)
  }
`;

export const ACTIVER_ACCES_MEMBRE_EQUIPE_MUTATION = gql`
  mutation ActiverAccesMembreEquipe($membreId: ID!, $motDePasse: String!) {
    activerAccesMembreEquipe(membreId: $membreId, motDePasse: $motDePasse) {
      id
      nom
      telephone
      hasAccesApp
      userId
    }
  }
`;

export const GET_UTILISATEURS_QUERY = gql`
  query GetUtilisateurs($role: Role, $search: String, $limit: Int, $offset: Int) {
    utilisateurs(role: $role, search: $search, limit: $limit, offset: $offset) {
      totalCount
      hasMore
      items {
        id
        nom
        prenom
        email
        telephone
        role
        adresse
        contactUrgenceNom
        contactUrgenceTel
        createdAt
      }
    }
  }
`;

export const CREER_USER_INTERNE_MUTATION = gql`
  mutation CreerUtilisateurInterne(
    $email: String!
    $motDePasse: String!
    $nom: String!
    $prenom: String
    $telephone: String
    $role: Role!
  ) {
    creerUtilisateurInterne(
      email: $email
      motDePasse: $motDePasse
      nom: $nom
      prenom: $prenom
      telephone: $telephone
      role: $role
    ) {
      id
      nom
      email
      role
    }
  }
`;

export const CHANGER_ROLE_USER_MUTATION = gql`
  mutation ChangerRoleUtilisateur($userId: ID!, $role: Role!) {
    changerRoleUtilisateur(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

export const MODIFIER_UTILISATEUR_MUTATION = gql`
  mutation ModifierUtilisateur($userId: ID!, $input: UpdateUtilisateurInput!) {
    modifierUtilisateur(userId: $userId, input: $input) {
      id
      nom
      prenom
      email
      telephone
      adresse
      role
    }
  }
`;

export const REINITIALISER_MDP_MUTATION = gql`
  mutation ReinitialiserMotDePasse($userId: ID!, $nouveauMotDePasse: String!) {
    reinitialiserMotDePasse(userId: $userId, nouveauMotDePasse: $nouveauMotDePasse)
  }
`;

export const SUPPRIMER_USER_MUTATION = gql`
  mutation SupprimerUtilisateur($userId: ID!) {
    supprimerUtilisateur(userId: $userId)
  }
`;

export const NOUVELLE_ALERTE_SUBSCRIPTION = gql`
  subscription OnNouvelleAlerte {
    nouvelleAlerte {
      id
      latitude
      longitude
      adresseApproximative
      messageTexte
      statut
      priorite
      declencheeAt
      citoyen {
        id
        nom
        prenom
        telephone
      }
      equipe {
        id
        nom
      }
      audios {
        id
        url
        dureeSecondes
      }
    }
  }
`;

export const ALERTE_MISE_A_JOUR_SUBSCRIPTION = gql`
  subscription OnAlerteMiseAJour($alerteId: ID) {
    alerteMiseAJour(alerteId: $alerteId) {
      id
      statut
      priorite
      priseEnChargeAt
      resolueAt
      equipe {
        id
        nom
        statut
      }
      operateurPriseEnCharge {
        id
        nom
      }
      audios {
        id
        url
        dureeSecondes
        uploadedAt
      }
      historiqueStatuts {
        id
        statut
        note
        createdAt
        auteur {
          id
          nom
          role
        }
      }
    }
  }
`;
