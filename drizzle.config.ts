if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// Force SSL on the connection string for drizzle-kit
const dbUrl = `${process.env.DATABASE_URL}?ssl=true`;

export default {
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
};
