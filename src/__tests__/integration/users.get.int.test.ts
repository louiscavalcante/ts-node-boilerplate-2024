describe('Users GET integration', () => {
	it('Should pass', () => {
		expect(process.env.NODE_ENV).toEqual('test')
		expect(Number(process.env.PORT)).toEqual(3000)
	})
})
