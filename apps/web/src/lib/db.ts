import "server-only";
import { PrismaClient } from "@prisma/client";

// One client per server instance; reused across hot reloads in dev.
const g = globalThis as unknown as { prisma?: PrismaClient };
export const db = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = db;
