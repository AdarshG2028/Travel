import type { NextAuthConfig } from "next-auth";

/** Edge-safe half of the auth setup (no database or bcrypt), used by middleware. */
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (!pathname.startsWith("/admin") || pathname === "/admin/login") return true;
      return auth?.user?.role === "ADMIN";
    },
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.role = token.role as string | undefined;
      return session;
    },
  },
};
