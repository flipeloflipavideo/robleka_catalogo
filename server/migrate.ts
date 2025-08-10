import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';

// This will run migrations on the database, skipping a
async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'migrations' });
  console.log('Migrations ran successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
