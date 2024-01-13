describe('Users Unit Tests', () => {
	const originalEnv = process.env
	let env: { PORT: string } | NodeJS.ProcessEnv

	beforeAll(() => {
		jest.useFakeTimers({ advanceTimers: true })
		jest.setSystemTime(new Date('2024-01-20T13:00:00.000Z'))
	})

	beforeEach(() => {
		env = originalEnv
	})

	afterEach(() => {
		jest.clearAllMocks()
		process.env = originalEnv
	})

	it('Should pass', () => {
		expect(Number(env.PORT)).toEqual(3000)
	})
})
