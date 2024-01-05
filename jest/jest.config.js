const path = require('path')
const { pathsToModuleNameMapper } = require('ts-jest')

const { compilerOptions } = require('../tsconfig.json')

module.exports = {
	rootDir: '../src',
	preset: 'ts-jest',
	bail: 1,
	testTimeout: 30000,
	testEnvironment: 'node',
	setupFiles: ['../jest/setup-tests.ts'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	transform: {
		'^.+.(t|j)s$': 'ts-jest',
	},
	coverageProvider: 'v8',
	coverageReporters: ['lcov', 'html', 'cobertura'],
	collectCoverageFrom: ['**/*.(t|j)s', '!**/test/**'],
	coveragePathIgnorePatterns: ['/src/app.ts', '/src/contracts/', '/src/__tests__'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: path.dirname(__dirname) }),
}
