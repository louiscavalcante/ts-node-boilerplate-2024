const jestConfig = require('./jest.config')

module.exports = {
	...jestConfig,
	displayName: 'int',
	testRegex: '.*.int.(test|spec).(t|j)s',
	coverageDirectory: '../coverage/int',
	setupFilesAfterEnv: ['../jest/setup-integration-tests.ts'],
	globalSetup: '../jest/global-setup.ts',
	globalTeardown: '../jest/global-teardown.ts',
}
