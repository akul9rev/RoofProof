import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env.preview') });

export const config = {
  port: Number(process.env.PORT ?? 4000),
  db: {
    host: process.env.PGHOST ?? '127.0.0.1',
    port: Number(process.env.PGPORT ?? 5432),
    database: process.env.PGDATABASE ?? 'roofproof',
    user: process.env.PGUSER ?? 'postgres',
    password: process.env.PGPASSWORD ?? 'postgres',
  },
  midnight: {
    contractAddress: process.env.CONTRACT_ADDRESS ?? '94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf',
    networkId: 'preview',
    indexerHttp: process.env.INDEXER_HTTP_URL ?? 'https://indexer.preview.midnight.network/api/v3/graphql',
    deployTx: 'e44df905f615c8937636bb4b2bce9abf8c45da116c4ad2c8742d71942150b81c',
  },
};
