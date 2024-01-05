const { getResolverAlias } = require('./babel.utils')

module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
		'@babel/preset-typescript',
	],
	plugins: [
		[
			'module-resolver',
			{
				alias: getResolverAlias('./tsconfig.json'),
			},
		],
	],
	ignore: ['**/*.test.ts', '**/*.spec.ts'],
}
