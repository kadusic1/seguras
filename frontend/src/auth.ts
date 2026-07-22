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
        const apiUrl = process.env.AUTH_API_URL;
        if (!apiUrl) return null;

        try {
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) return null;

          const data = await res.json();

          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.name,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpiresAt: data.expires_in,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as Record<string, unknown>).accessToken;
        token.refreshToken = (user as Record<string, unknown>).refreshToken;
        token.accessTokenExpiresAt = (
          user as Record<string, unknown>
        ).accessTokenExpiresAt;
        return token;
      }

      if (
        token.accessTokenExpiresAt &&
        Date.now() / 1000 >= (token.accessTokenExpiresAt as number) - 30
      ) {
        const apiUrl = process.env.AUTH_API_URL;
        if (apiUrl && token.refreshToken) {
          try {
            const res = await fetch(`${apiUrl}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: token.refreshToken }),
            });
            if (res.ok) {
              const data = await res.json();
              token.accessToken = data.access_token;
              token.accessTokenExpiresAt = data.expires_in;
            } else {
              return null;
            }
          } catch {
            return null;
          }
        }
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
