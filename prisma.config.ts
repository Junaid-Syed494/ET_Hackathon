import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        // We intentionally feed the CLI the DIRECT URL so migrations bypass the pooler!
        url: env("DIRECT_URL"),
    },
});