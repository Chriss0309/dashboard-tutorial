module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    reporters: [
      'default',
      ['jest-html-reporters', {
        publicPath: './coverage',
        filename: 'report.html',
        expand: true,
      }],
    ],
    testMatch: ['<rootDir>/src/__tests__/**/*.[jt]s?(x)'], // Adjusted pattern to match your test files
  };
  