import { NextResponse } from "next/server";
import { inquirySchema } from "@travel/validation";
import { db } from "@/lib/db";

// Best-effort per-instance throttle; swap for a shared store (Upstash) if abuse appears.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX = 5;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const body = await req.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const row = await db.inquiry.create({ data: parsed.data });
  return NextResponse.json({ id: row.id }, { status: 201 });
}
