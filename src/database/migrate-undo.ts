import { migrator } from './migrator';

async function run() {
  const migrations = await migrator.down();
  migrations.forEach((m: { name: string }) => console.log('Reverted:', m.name));
  process.exit(0);
}


run().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});



