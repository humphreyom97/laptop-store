module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['routes/**/*.js', 'utils/**/*.js', 'app.js', 'server.js'],
};