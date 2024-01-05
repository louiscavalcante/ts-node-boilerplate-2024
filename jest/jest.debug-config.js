const integrationConfig = require('./jest.int-config')

module.exports = {
	...integrationConfig,
	displayName: 'debug',
	testRegex: '.*.(test|spec).(t|j)s',
	testTimeout: 300000,
}
