export default {
  bail: 1,
  clearMocks: true,
  // collectCoverage: true,
  collectCoverageFrom: [
    "!**/I*.ts",
    "!**/*Dto.ts",
    "!**/domain/types/*Data.ts",
    "!*.*",
    "!src/main/server.ts",
    "!**/*.mock.ts",
  ],
  coverageDirectory: "test/coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    "**/**/*.test.ts?(x)",
  ],
};
