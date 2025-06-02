module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@octokit/core$': '<rootDir>/__tests__/__mocks__/@octokit/core.js',
    '^@octokit/plugin-rest-endpoint-methods$': '<rootDir>/__tests__/__mocks__/@octokit/plugin-rest-endpoint-methods.js'
  },
  verbose: true
}