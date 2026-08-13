import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// SQLite "file:" relative paths in DATABASE_URL resolve against
// process.cwd() at runtime, which varies across hosts (and, on Hostinger,
// across every versioned deploy directory). Resolving it here instead
// keeps it correct regardless of where the process actually runs from.
const dbPath = path.join(process.cwd(), "prisma", "dev.db");

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: `file:${dbPath}` } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
