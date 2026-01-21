import { migrator } from './migrator';

async function run() {
  const [executed, pending] = await Promise.all([
    migrator.executed(),
    migrator.pending(),
  ]);
  console.log('Executed migrations:', executed.map((m: { name: any; }) => m.name));
  console.log('Pending migrations:', pending.map((m: { name: any; }) => m.name));
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});



