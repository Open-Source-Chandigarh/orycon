import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient;

if (!(globalThis as any).prisma) {
  (globalThis as any).prisma = new PrismaClient();
}
prisma = (globalThis as any).prisma;

export default prisma;