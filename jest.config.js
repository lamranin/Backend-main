module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["dotenv/config"],
    moduleNameMapper: {
        '^database$': '<rootDir>/src/database/index.ts',
        '^middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
        '^config$': '<rootDir>/src/config',
        '^app$': '<rootDir>/src/app.ts',
        '^utils/(.*)$': '<rootDir>/src/utils/$1',
        '^modules/(.*)$': '<rootDir>/src/modules/$1',
    },
};