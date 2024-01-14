const jestConfig = require('./jest.config')

module.exports = {
	...jestConfig,
	displayName: 'int',
	testRegex: '.*.int.(test|spec).(t|j)s',
	coverageDirectory: '../coverage/int',
	globalSetup: '../jest/global-setup.ts',
	globalTeardown: '../jest/global-teardown.ts',
}
