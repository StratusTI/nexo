import "dotenv/config";
import { defineConfig } from "prisma/config";

const isElo = process.env.SELECTED_SCHEMA === 'elo';

const databaseUrl = isElo
  ? process.env.DATABASE_ELO_URL
  : process.env.DATABASE_STEEL_URL;

export default defineConfig({
  schema: isElo
      ? './prisma/elo/schema.prisma'
      : './prisma/steel/schema.prisma',
  migrations: {
    path: isElo ? './prisma/elo/migrations' : './prisma/steel/migrations',
  },
  datasource: {
    url: databaseUrl ?? '',
  },
});
