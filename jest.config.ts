export default {
  bail: 1,
  clearMocks: true,
  // collectCoverage: true,
  collectCoverageFrom: [
    "src/**",
    "!src/**/I*.ts",
    "!src/**/*DTO.ts",
    "!src/**/*Data.ts",
    "!src/server.ts",
  ],
  coverageDirectory: "test/coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    "**/test/integration/**/*.test.ts?(x)",
  ],
};
