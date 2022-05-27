export default {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "eventsModule/src/**",
    "!**/I*.ts",
    "!**/*Dto.ts",
    "!**/*Data.ts",
    "!main/**",
  ],
  coverageDirectory: "test/coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: [
    // "**/Event.test.ts",
    // "**/EditEventUseCase.test.ts",
    "**/test/**/*.test.ts?(x)",
  ],
};
