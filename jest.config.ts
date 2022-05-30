export default {
  bail: 1,
  clearMocks: true,
  // collectCoverage: true,
  collectCoverageFrom: [
    "modules/users/src/**",
    "!**/I*.ts",
    "!**/*Dto.ts",
    // "!**/*Data.ts",
    "!main/**",
  ],
  coverageDirectory: "test/coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    // "**/modules/users/test/integration/**/*.test.ts?(x)",
    "**/ChangePasswordUseCase.test.ts",
    // "**/users/test/**/*.test.ts?(x)",
  ],
};
