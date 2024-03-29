import { Logger } from 'traceability'

import { getLoggerOutput } from '@tests/tests.utils'

jest.mock('traceability').spyOn(Logger, 'error')

describe('Logger config', () => {
	let loggerOutput: string[]

	beforeEach(() => {
		const { loggerOutputData } = getLoggerOutput()
		loggerOutput = loggerOutputData
	})
	it('should output all values from all msg properties', () => {
		Logger.error({
			cid: '123',
			message: 'message',
			name: 'name',
			status: 404,
			signalCode: 1,
			exitReason: 'exitReason',
			axiosError: 'axiosError message',
			stack: 'stack message',
		})

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[31m2024-01-20T13:00:00.000Z - error:\\u001b[39m cid: 123 message name: name status: 404 signalCode: 1 exitReason: exitReason axiosError: \\"axiosError message\\" stack: \\"stack message\\" \\n"]'
		)
	})

	it('should output empty values for all msg properties besides level and timestamp', () => {
		Logger.error('')

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[31m2024-01-20T13:00:00.000Z - error:\\u001b[39m \\n"]'
		)
	})
})
