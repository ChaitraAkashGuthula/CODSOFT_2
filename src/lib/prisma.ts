import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Safe fallback for deployments without an active PostgreSQL instance
export const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL
    ? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : (new Proxy(
        {},
        {
          get(_target, prop) {
            return () => {
              throw new Error(
                `Prisma was invoked on '${String(prop)}' but DATABASE_URL is not configured. DineDesk is running in standalone Vercel Zero-Config mode.`
              );
            };
          },
        }
      ) as unknown as PrismaClient));

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
