import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load backend .env file first
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3001),
  db: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/roofproof',
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') ? { rejectUnauthorized: false } : false,
  },
  midnight: {
    contractAddress: process.env.CONTRACT_ADDRESS ?? '94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf',
    networkId: 'preview',
    indexerHttp: process.env.INDEXER_HTTP_URL ?? 'https://indexer.preview.midnight.network/api/v3/graphql',
    deployTx: 'e44df905f615c8937636bb4b2bce9abf8c45da116c4ad2c8742d71942150b81c',
  },
};
