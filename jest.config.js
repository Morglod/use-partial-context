module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    rootDir: "src",
    collectCoverage: true,
    // coverageReporters: ["json", "html"],
    coverageDirectory: "<rootDir>/../coverage",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        // process `*.tsx` files with `ts-jest`
    },
    moduleNameMapper: {
        "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__tests__/fileMock.js",
    },
};
