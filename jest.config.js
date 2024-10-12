module.exports = {
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    },
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        "\\.(css|less)$": "identity-obj-proxy"
    }
};
