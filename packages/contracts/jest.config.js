export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|js|mjs)$': [
      'ts-jest',
      {
        useESM: true,
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@openzeppelin/compact-simulator|@midnight-ntwrk/compact-runtime|@midnight-ntwrk/onchain-runtime-v3)/)'
  ]
};
