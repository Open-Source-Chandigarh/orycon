import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// Re-export all Prisma types and enums for consuming packages
export * from "@prisma/client";
