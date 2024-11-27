module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Transform JavaScript/JSX files
    "^.+\\.tsx?$": "babel-jest"  // Transform TypeScript/TSX files
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js" // Mock image imports
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios)/)" // Ensure Axios and other ES modules are transformed
  ]
};
