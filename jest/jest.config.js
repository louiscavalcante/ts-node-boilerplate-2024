const path = require('node:path')
const { pathsToModuleNameMapper } = require('ts-jest')

const { compilerOptions } = require('../tsconfig.json')

module.exports = {
	rootDir: '../src',
	preset: 'ts-jest',
	bail: 1,
	testTimeout: 30000,
	testEnvironment: 'node',
	setupFiles: ['../jest/setup-files.ts'],
	setupFilesAfterEnv: ['../jest/setup-files-after-env.ts'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	transform: {
		'^.+.(t|j)s$': 'ts-jest',
	},
	coverageProvider: 'v8',
	coverageReporters: ['lcov', 'html', 'cobertura', 'text-summary'],
	collectCoverageFrom: ['**/*.(t|j)s', '!**/*.example.(t|j)s', '!**/constants.shared.ts'],
	coveragePathIgnorePatterns: ['/src/app.ts', 'docs', '__tests__', 'interfaces'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: path.dirname(__dirname) }),
}
