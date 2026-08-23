# 🛡️ BARAKA SECURITY — Web Administration & Supervision

Interface web moderne de commandement et de supervision opérationnelle en temps réel pour la centrale d'urgence **BARAKA SECURITY**. Conçue pour permettre aux opérateurs et administrateurs de coordonner les interventions d'urgence, écouter les messages vocaux SOS, suivre les déploiements sur carte interactive et piloter les équipes d'intervention.

---

## 🎨 Identité Visuelle & Design System

L'application intègre le **Design System BARAKA SECURITY** inspiré du logo officiel :
* **Noir Profond / Encre** (`#000000`, `#0a0a0a`, `#141414`) : Fond immersif haute concentration pour salle de supervision
* **Or Impérial** (`#d4a017`, `#e8b923`, `#a67c0f`) : Identité de marque, accentuation noble et sélective
* **Crème / Blanc Chaud** (`#f5f0e6`) : Typographie haute lisibilité et confort visuel
* **Rouge Signal / Alerte** (`#dc2626`) : Alertes critiques SOS et indicateurs de priorité
* **Typographies** : *Cinzel* (titres et emblème de marque) & *Sora* (interface et données techniques)

---

## 🚀 Stack Technique & Versions (Août 2026)

* **Framework UI** : React 19.2.x (`react`, `react-dom`)
* **Bundler & Dev Server** : Vite 8.2.x (avec `@vitejs/plugin-react`)
* **Styling & Design System** : Tailwind CSS 4.3.x (`@tailwindcss/vite`)
* **Client API & Temps Réel** : Apollo Client 4.2.x (`@apollo/client/react`) + `graphql-ws` 6.2.x
* **Routage** : React Router 7.18.x
* **Cartographie Tactique** : React-Leaflet 5.0.x + Leaflet 1.9.x (Thème sombre CartoDB)
* **Visualisation & Graphiques** : Recharts 3.8.x
* **Gestion d'État** : Zustand 5.0.x (avec persistance locale `localStorage`)
* **Iconographie** : Lucide React 1.31.x
* **Notifications Toast** : React Hot Toast 2.6.x
* **Typage** : TypeScript 6.0.x (Target `ES2024`, mode strict)

---

## 📁 Structure du Projet

```
app/admin/
├── src/
│   ├── assets/
│   │   └── logo.jpg            # Emblème officiel BARAKA SECURITY
│   ├── components/
│   │   ├── common/
│   │   │   ├── AudioPlayer.tsx # Lecteur audio SOS interactif (Wave/timeline, volume, timecode)
│   │   │   ├── Badge.tsx       # Badges colorés de statut (NOUVELLE, EN_COURS, RESOLUE...), priorité et rôle
│   │   │   ├── Button.tsx      # Boutons avec variantes design system (Or, Danger, Sombre, Outline)
│   │   │   └── Modal.tsx       # Modale accessible et stylisée
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Barre supérieure avec indicateur de flux temps réel en direct
│   │   │   ├── Sidebar.tsx     # Navigation latérale avec emblème BARAKA SECURITY
│   │   │   ├── Layout.tsx      # Structure générale de l'interface
│   │   │   └── ProtectedRoute.tsx # Gardien de route avec contrôle des rôles (RBAC)
│   │   └── map/
│   │       └── IncidentMap.tsx # Carte Leaflet dark mode, marqueurs animés et popups audios
│   ├── graphql/
│   │   ├── client.ts           # Configuration Apollo Client 4.2 (HTTP + WebSocket split link)
│   │   └── operations.ts       # Requêtes, Mutations & Abonnements GraphQL
│   ├── pages/
│   │   ├── auth/Login.tsx              # Écran de connexion avec raccourcis de démonstration
│   │   ├── dashboard/Dashboard.tsx     # Vue principale : KPIs, alertes récentes, toasts temps réel
│   │   ├── alertes/AlertesList.tsx     # Liste complète filtrable des alertes SOS
│   │   ├── alertes/AlerteDetail.tsx    # Détails incident : GPS, lecteur vocal SOS, équipe, historique
│   │   ├── carte/CartePage.tsx         # Carte tactique plein écran avec filtres en direct
│   │   ├── equipes/EquipesPage.tsx     # Gestion des unités d'intervention et agents de terrain
│   │   ├── stats/StatsPage.tsx         # Tableaux de bord analytiques et graphiques
│   │   └── utilisateurs/UtilisateursPage.tsx # Gestion des comptes opérateurs & droits
│   ├── stores/
│   │   └── authStore.ts        # État d'authentification Zustand avec persistance
│   ├── App.tsx                 # Déclaration des routes
│   ├── main.tsx                # Point d'entrée React & Toaster
│   └── index.css               # Import Google Fonts & tokens Tailwind v4
├── .env.example                # Exemple de variables d'environnement
├── vite.config.ts              # Configuration Vite 8 + Tailwind 4 + Proxies
├── tsconfig.json               # Configuration TypeScript 6
└── package.json
```

---

## ⚡ Fonctionnalités Clés

1. **Dashboard Opérationnel en Direct** :
   * Métriques en temps réel (Alertes actives, unités disponibles, délai moyen de prise en charge).
   * Réception instantanée des nouveaux SOS via WebSocket avec notifications sonores/visuelles (Toasts interactifs).
2. **Lecteur Audio SOS Intégré** :
   * Écoute instantanée des messages vocaux transmis par les citoyens en détresse.
   * Contrôle de la lecture, curseur temporel, gestion du volume et horodatage précis.
3. **Fiche Incident & Prise de Décision** :
   * Positionnement GPS exact et adresse approximative.
   * Accès rapide aux informations du citoyen et de son contact d'urgence déclaré.
   * Affectation ou réaffectation d'une équipe d'intervention mobile.
   * Historique complet et horodaté des transitions de statut.
4. **Carte Tactique des Incidents** :
   * Affichage cartographique sur fond sombre avec pulsation visuelle des incidents critiques.
   * Popups enrichies avec aperçu vocal et lien d'ouverture Google Maps.
5. **Gestion des Équipes & Effectifs** :
   * Suivi des statuts (Disponible, En mission, Hors service).
   * Composition des effectifs par équipe (Chef d'équipe, Paramédic, Sécurité).
6. **Statistiques & Administration RBAC** :
   * Graphiques de répartition par statut et volume d'incidents.
   * Création et gestion des comptes opérateurs, réinitialisation de mot de passe et contrôle des accès.

---

## ⚙️ Installation & Démarrage

### 1. Installation des dépendances
```bash
cd app/admin
npm install
```

### 2. Configuration d'environnement
Copiez le fichier d'exemple si besoin :
```bash
cp .env.example .env
```

Valeurs par défaut :
```env
VITE_API_URL="http://localhost:4000/graphql"
VITE_WS_URL="ws://localhost:4000/graphql"
VITE_API_BASE_URL="http://localhost:4000"
# Optionnel — FCM web (tokens ops hors onglet). Sans ces clés, l’admin fonctionne déjà via WebSocket.
```

### 3. Lancer en développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

### 4. Build de Production
```bash
npm run build
npm run preview
```

---

## 🔑 Comptes de Test Rapides

Sur la page de connexion (`/login`), des boutons d'accès rapide permettent de se connecter immédiatement :

* 👑 **Super Admin** : `superadmin@barakasecurity.com` / `Baraka@2026`
* 🎧 **Opérateur 1** : `operateur1@barakasecurity.com` / `Baraka@2026`
* 🛡️ **Admin** : `admin@barakasecurity.com` / `Baraka@2026`
