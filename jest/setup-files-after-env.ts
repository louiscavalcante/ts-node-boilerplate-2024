const env = process.env

beforeAll(async () => {
	jest.useFakeTimers({ advanceTimers: true })
	jest.setSystemTime(new Date('2024-01-20T13:00:00.000Z'))
})

afterAll(async () => {})

beforeEach(async () => {
	jest.resetModules()
	process.env = { ...env }
})

afterEach(async () => {
	process.env = env

	jest.clearAllMocks()
})
