export default {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    // "modules/users/src/**",
    "!**/I*.ts",
    "!**/*Dto.ts",
    "!**/domain/types/*Data.ts",
    "!*.*",
    "!main/server.ts",
    "!**/*.mock.ts",
  ],
  coverageDirectory: "test/coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    // "**/modules/users/test/integration/**/*.test.ts?(x)",
    // "**/CreateUserUseCase.test.ts",
    "**/**/*.test.ts?(x)",
  ],
};
