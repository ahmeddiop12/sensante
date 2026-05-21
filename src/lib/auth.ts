import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) return null;

        try {
          console.info('🔐 authorize – email reçu :', email);
          const user = await prisma.user.findUnique({ where: { email } });
          console.info('🔐 authorize – utilisateur trouvé :', user);
          if (!user) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          console.info('🔐 authorize – passwordMatch :', passwordMatch);
          if (!passwordMatch) return null;

          return {
            id: String(user.id),
            email: user.email,
            name: `${user.prenom} ${user.nom}`,
            role: user.role,
          };
        } catch (error) {
          console.error("Erreur authorize NextAuth:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
