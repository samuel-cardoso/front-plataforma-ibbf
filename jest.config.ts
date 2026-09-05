import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  passWithNoTests: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(customJestConfig);
