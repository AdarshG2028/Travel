"use client";

import { useState, type FormEvent } from "react";
import { inquirySchema } from "@travel/validation";

const ENDPOINT = "/api/inquiries";
type State = { status: "idle" | "sending" | "done" | "error"; errors?: Record<string, string>; message?: string };

const field = "mt-1 w-full border border-charcoal/25 bg-transparent px-4 py-3 min-h-12 focus:border-forest";

export function InquiryForm({ defaultDestination = "" }: { defaultDestination?: string }) {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const cleaned = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== ""));
    const parsed = inquirySchema.safeParse(cleaned);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
      return setState({ status: "error", errors });
    }
    setState({ status: "sending" });
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (!res.ok) throw new Error();
      setState({ status: "done" });
    } catch {
      setState({ status: "error", message: "Could not send right now. Please try WhatsApp instead." });
    }
  }

  if (state.status === "done") {
    return <p role="status" className="font-display text-3xl">Thank you. We will call you within a working day.</p>;
  }

  const err = (k: string) => state.errors?.[k] && <span role="alert" className="mt-1 block text-sm text-accent">{state.errors[k]}</span>;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <label className="sm:col-span-2">Destination<input name="destination" defaultValue={defaultDestination} required className={field} />{err("destination")}</label>
      <label>Start date<input type="date" name="startDate" className={field} /></label>
      <label>End date<input type="date" name="endDate" className={field} /></label>
      <label>Travellers<input type="number" name="travelers" min={1} defaultValue={2} required className={field} />{err("travelers")}</label>
      <label>Budget (₹, total)<input type="number" name="budget" min={0} step={500} className={field} /></label>
      <label className="sm:col-span-2">Requirements<textarea name="requirements" rows={4} className={field} /></label>
      <label>Name<input name="name" autoComplete="name" required className={field} />{err("name")}</label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" required className={field} />{err("phone")}</label>
      <label className="sm:col-span-2">Email<input name="email" type="email" autoComplete="email" required className={field} />{err("email")}</label>
      {state.message && <p role="alert" className="text-accent sm:col-span-2">{state.message}</p>}
      <button disabled={state.status === "sending"} className="min-h-12 rounded-full bg-charcoal px-8 text-ivory transition-colors hover:bg-forest disabled:opacity-60 sm:col-span-2 sm:w-fit">
        {state.status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
