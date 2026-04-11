import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./config/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: `postgresql://${process.env.DB_USER || "postgres"}:${process.env.DB_PASSWORD || "your_secure_password"}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "woreda_db"}`,
  },
});
