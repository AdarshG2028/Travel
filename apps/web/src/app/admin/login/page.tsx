import type { Metadata } from "next";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

async function login(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirectTo: "/admin" });
  } catch (e) {
    if (e instanceof AuthError) redirect("/admin/login?error=1");
    throw e; // redirects are thrown and must propagate
  }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if ((await auth())?.user?.role === "ADMIN") redirect("/admin");
  const { error } = await searchParams;
  const input = "mt-1 w-full min-h-12 rounded-md border border-slate-300 bg-white px-4";
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 font-sans text-slate-900">
      <form action={login} className="w-full max-w-sm space-y-5 rounded-lg border border-slate-200 bg-white p-8">
        <div>
          <h1 className="text-xl font-semibold">Admin sign in</h1>
          <p className="text-sm text-slate-500">{site.name}</p>
        </div>
        {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">Incorrect email or password.</p>}
        <label className="block text-sm">Email<input name="email" type="email" autoComplete="username" required className={input} /></label>
        <label className="block text-sm">Password<input name="password" type="password" autoComplete="current-password" required className={input} /></label>
        <button className="min-h-12 w-full rounded-md bg-slate-900 font-medium text-white hover:bg-slate-700">Sign in</button>
      </form>
    </main>
  );
}
