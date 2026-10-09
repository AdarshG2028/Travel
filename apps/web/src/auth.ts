import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface Session { user: { role?: string } & import("next-auth").DefaultSession["user"] }
}

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
// Compared against when the user does not exist, so response time does not reveal which emails are admins.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !ok || user.role !== "ADMIN") return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
