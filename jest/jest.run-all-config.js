const integrationConfig = require('./jest.int-config')

module.exports = {
	...integrationConfig,
	displayName: 'all-tests',
	testRegex: '.*.(test|spec).(t|j)s',
	coverageDirectory: '../coverage/',
}
