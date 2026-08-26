import { initDb, seedData } from './init.js';

async function main() {
  console.log('[RoofProof DB] Starting manual database seed...');
  await initDb();
  await seedData();
  console.log('[RoofProof DB] ✓ Seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[RoofProof DB] Seed failed:', err);
  process.exit(1);
});
