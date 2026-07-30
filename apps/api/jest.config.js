/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts'],
  coverageDirectory: 'coverage',
};
