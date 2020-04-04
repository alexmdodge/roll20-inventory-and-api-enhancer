module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'node_modules',
    'build',
    '__tests__/data',
    '__tests__/mocks'
  ]
};