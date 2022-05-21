export default {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**",
    "!src/**/I*.ts",
    "!src/**/*Dto.ts",
    "!src/**/*Data.ts",
    "!src/main/**",
  ],
  coverageDirectory: "test/coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    "**/test/**/*.test.ts?(x)",
  ],
};
