import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const signInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        if (email !== "admin@seguras.com" || password !== "admin123")
          return null;
        return {
          id: "1",
          email,
          name: "Admin",
          accessTokenExpiresAt: Infinity,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as Record<string, unknown>).accessToken;
        token.accessTokenExpiresAt = (
          user as Record<string, unknown>
        ).accessTokenExpiresAt;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
