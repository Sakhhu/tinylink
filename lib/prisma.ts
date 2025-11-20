// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// PASTE YOUR FULL, SINGLE-LINE CONNECTION STRING HERE, WRAPPED IN QUOTES
// Note: This temporarily hardcodes the URL to bypass .env corruption issues.
const DATABASE_URL = "postgresql://neondb_owner:npg_F9tb4xpowRL0@ep-wandering-water-a12p2d6v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

let prisma: PrismaClient;

// Standard way to handle global Prisma instance to prevent memory leaks/crashes
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
    log: ["query", "info", "warn", "error"],
  });
} else {
  // Use 'global' to hold the Prisma client in development
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: { db: { url: DATABASE_URL } },
      log: ["query", "info", "warn", "error"],
    });
  }
  prisma = global.prisma;
}

export default prisma;