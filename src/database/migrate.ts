import { migrator } from './migrator';

async function run() {
  const migrations = await migrator.up();
  migrations.forEach((m: { name: string }) => console.log('Migrated:', m.name));
  process.exit(0);
}

run().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});



