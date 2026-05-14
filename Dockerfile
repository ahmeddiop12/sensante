# 1. Image de base : Node.js 20 sur Alpine Linux
FROM node:20-alpine

# 2. Répertoire de travail dans le conteneur
WORKDIR /app

# 3. Copier les fichiers de dépendances EN PREMIER
COPY package.json package-lock.json ./

# 4. Installer les dépendances
RUN npm ci

# 5. Copier le reste du code source
COPY . .

# 6. Générer le client Prisma
RUN npx prisma generate

# 7. Variables nécessaires au build
ARG GROQ_API_KEY
ENV GROQ_API_KEY=$GROQ_API_KEY

# 8. Compiler Next.js pour la production
RUN npm run build

# 9. Déclarer le port utilisé
EXPOSE 3000

# 10. Commande de démarrage
CMD ["npm", "start"]
