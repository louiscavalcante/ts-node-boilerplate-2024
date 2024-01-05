module.exports = {
	getResolverAlias: tsConfigPath => {
		const tsConfig = require(tsConfigPath)
		const tsConfigPaths = (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) || {}

		return Object.keys(tsConfigPaths)
			.map(tsKey => {
				const pathArray = tsConfigPaths[tsKey].pop()
				const key = tsKey.replace('/*', '')
				const paths = pathArray.replace('/*', '')
				return { key, paths }
			})
			.reduce((obj, cur) => {
				obj[cur.key] = cur.paths
				return obj
			}, {})
	},
}
