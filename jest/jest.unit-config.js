const jestConfig = require('./jest.config')

module.exports = {
	...jestConfig,
	displayName: 'unit',
	testRegex: '.*.unit.(test|spec).(t|j)s',
	coverageDirectory: '../coverage/unit',
}
