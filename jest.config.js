const config = {
  testEnvironment: 'jsdom',

  testMatch: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: [],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transformIgnorePatterns: ['/node_modules/'],

  transform: {
    '.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        sourceMaps: true,
        module: { type: 'commonjs' },
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
  globals: {
    'ts-jest': { tsconfig: './tsconfig.json' },
  },
}

module.exports = config
