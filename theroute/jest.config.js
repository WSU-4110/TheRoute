module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest', // Transpile JS/JSX files using Babel
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios|some-other-esm-module)/)', // Transpile axios or other ESM dependencies
    ],
    moduleNameMapper: {
      '\\.(css|scss|less)$': 'identity-obj-proxy', // Mock CSS imports
    },
  };
  