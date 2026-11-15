// Safe fallback proxy for deployments without an active PostgreSQL instance
export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      return () => {
        throw new Error(
          `Prisma was invoked on '${String(prop)}' but DineDesk is running in standalone Vercel Zero-Config mode.`
        );
      };
    },
  }
) as any;

export default prisma;
