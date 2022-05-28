export default {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "usersModule/src/**",
    "!**/I*.ts",
    "!**/*Dto.ts",
    // "!**/*Data.ts",
    "!main/**",
  ],
  coverageDirectory: "test/coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    "**/usersModule/**/test/**/*.test.ts?(x)",
  ],
};
