import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import { generateSlug } from "@/lib/slug";
import { eq } from "drizzle-orm";
import { portfolios } from "@/lib/db/schema";
import { sendWelcomeEmail } from "@/lib/email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Fetch role from DB
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id!),
        });
        token.role = dbUser?.role ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Auto-create a portfolio with a slug derived from GitHub username
      if (!user.id) return;
      const baseSlug = generateSlug(user.name ?? user.email ?? user.id);
      await db.insert(portfolios).values({
        userId: user.id,
        slug: baseSlug,
      }).onConflictDoNothing();

      // Send welcome email (fire-and-forget — don't block auth flow)
      if (user.email) {
        sendWelcomeEmail(user.email, user.name ?? "there").catch(() => {});
      }
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
