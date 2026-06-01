# 🩺 SénSanté - Assistant de Santé Communautaire par IA

SénSanté est une plateforme innovante conçue pour soutenir les agents de santé communautaire au Sénégal. En combinant la puissance de l'Intelligence Artificielle (Llama 3 via Groq) et une gestion rigoureuse des données patient, SénSanté facilite le triage et le pré-diagnostic médical dans les zones reculées.

## 🚀 Fonctionnalités Clés

- **Gestion des Patients** : Enregistrement et suivi complet des dossiers patients (nom, âge, région, antécédents).
- **Consultations Digitalisées** : Saisie structurée des symptômes et notes cliniques.
- **IA de Pré-diagnostic** : Intégration de l'API **Groq (Llama 3.3 70B)** pour fournir des analyses basées sur le contexte épidémiologique local (Paludisme, Dengue, etc.).
- **Triage Intelligent** : Classification automatique de l'urgence (Faible, Moyen, Urgent) et score de confiance de l'IA.
- **Tableau de Bord Statistique** : Visualisation en temps réel des indicateurs de santé via des graphiques interactifs (**Recharts**).
- **Système de Rôles (RBAC)** : Accès sécurisé différencié pour les **Agents**, **Médecins** et **Administrateurs**.

## 🛠 Stack Technique

- **Frontend** : [Next.js 16](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Backend & BDD** : [Prisma ORM](https://www.prisma.io/) avec [PostgreSQL](https://www.postgresql.org/)
- **IA** : [Groq SDK](https://groq.com/) (Modèle Llama 3.3 70B)
- **Authentification** : [NextAuth.js](https://next-auth.js.org/)
- **Visualisation** : [Lucide React](https://lucide.dev/) (Icons) & [Recharts](https://recharts.org/)

## 🐳 Dockerisation

Le projet est entièrement dockerisé pour garantir un environnement de développement et de déploiement cohérent.

### Pré-requis
- Docker et Docker Compose installés sur votre machine.

### Lancement avec Docker
1. Clonez le dépôt.
2. Créez un fichier `.env` à la racine (voir section Environnement).
3. Lancez les services :
   ```bash
   docker-compose up --build
   ```
L'application sera disponible sur `http://localhost:3000`.

## 💻 Installation Locale (sans Docker)

Si vous préférez lancer le projet manuellement :

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer l'environnement** :
   Copiez `.env.example` en `.env` et remplissez les variables nécessaires.

3. **Préparer la base de données** :
   ```bash
   npx prisma db push
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```

## 🔑 Variables d'Environnement

Le fichier `.env` doit contenir :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/sensante"

# Authentification
NEXTAUTH_SECRET="votre_secret_ici"
NEXTAUTH_URL="http://localhost:3000"

# IA (Groq)
GROQ_API_KEY="votre_cle_api_groq"
```

## 👥 L'Équipe et les Rôles

Le projet est porté par une équipe organisée autour de rôles stratégiques :

- **Mouhamed DIOP** **🏗️ L’Architecte** : Chef de projet et Git Master. Il assure la coordination globale, la planification des jalons et la cohérence technique (gestion du dépôt, revue des PR et merge).
- **El Hadj Abdourahmane Diop**  **🛡️ Le Gardien** : Responsable du module Patients. Il conçoit et implémente la fondation de l'application (modèle de données, APIs et interfaces de gestion des patients).
- **Manétou Dramé** **🔐 Le Bouclier** : Responsable Sécurité et Authentification. Il garantit l'accès sécurisé à la plateforme via la gestion des sessions et des rôles (Agent, Médecin, Admin).
- **Coumba Gueye** **🩺 Le Médecin** : Responsable du module Consultations. Il développe le cœur métier de SénSanté (saisie des symptômes, suivi clinique et historique des consultations).
- **Mame Saye Fall** **🔮 L’Oracle** : Responsable de l'IA. Il orchestre l'intelligence de l'application (intégration de Groq, ingénierie du prompt médical et restitution des pré-diagnostics).
- **Amadou Habib Kane** **📊 Le Pilote** : Responsable Dashboard et Déploiement. Il assure la visibilité des données (statistiques et graphiques) et la robustesse de l'infrastructure via Docker.

---
*Projet réalisé dans le cadre de la **Licence 3 GLSI - ESP/UCAD** (Année 2025-2026).*
