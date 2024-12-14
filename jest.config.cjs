module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|scss)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};