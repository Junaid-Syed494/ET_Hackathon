import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./schema.prisma",
  datasource: {
    url: "postgresql://postgres:ET_Intelligence@2026@db.skzugjsmnimzituwlfxd.supabase.co:5432/postgres",
  },
});