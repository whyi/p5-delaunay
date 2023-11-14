import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  modulePathIgnorePatterns: [
    "dist/"
  ],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy"
  },
  coverageReporters: [
    "text",
    "lcov"
  ],
  coverageDirectory: ".",
  transform: {
    ".(js|jsx)": "babel-jest",
    ".(ts|tsx)": "ts-jest"
  }
};
export default config