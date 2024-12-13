module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|scss)$': 'identity-obj-proxy',
        '\\.svg$': 'jest-transform-stub',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};