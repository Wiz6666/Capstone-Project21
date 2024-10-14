module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(mp4|webm)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testEnvironment: "jsdom", // Specify the correct test environment
};
