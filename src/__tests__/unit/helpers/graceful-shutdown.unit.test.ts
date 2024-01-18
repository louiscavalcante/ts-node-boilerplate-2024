import { Server } from 'node:http'
import { Logger } from 'traceability'

import { gracefulShutdown } from '@helpers/graceful-shutdown.helper'
import { EExitReason } from '@helpers/interfaces/graceful-shutdown.helper.interface'

jest.mock('traceability', () => ({
	Logger: {
		error: jest.fn(),
		warn: jest.fn(),
	},
}))

describe('Gracefulshutdown helper', () => {
	let server: Server
	let exitSpy: jest.SpyInstance
	const error = new Error('Test error')
	const signalCode = 0

	beforeEach(() => {
		server = new Server()
		server.close = jest.fn(callback => callback()) as jest.Mock
		exitSpy = jest.spyOn(process, 'exit').mockImplementation()
	})

	afterEach(() => {
		exitSpy.mockRestore()
	})

	it('should log error if error is instance of Error', () => {
		const handler = gracefulShutdown(server, { coredump: false, timeout: 500 })
		handler(signalCode, EExitReason.SIGTERM)(error, null)

		expect(Logger.error).toHaveBeenCalledWith({
			exitReason: EExitReason.SIGTERM,
			signalCode: signalCode,
			message: error.message,
			stack: error.stack,
		})
	})

	it('should call process.exit with signal code', async () => {
		const handler = gracefulShutdown(server, { coredump: false, timeout: 500 })
		handler(signalCode, EExitReason.SIGTERM)(error, null)

		expect(process.exit).toHaveBeenCalledWith(signalCode)
	})

	it('should call process.abort if coredump is true', async () => {
		const abortSpy = jest.spyOn(process, 'abort').mockImplementation()
		const handler = gracefulShutdown(server, { coredump: true, timeout: 500 })
		handler(signalCode, EExitReason.SIGTERM)(error, null)

		expect(process.abort).toHaveBeenCalled()
		abortSpy.mockRestore()
	})

	it('should log warning if server stopped receiving connections', async () => {
		const handler = gracefulShutdown(server, { coredump: false, timeout: 500 })
		handler(signalCode, EExitReason.SIGTERM)(error, null)

		expect(Logger.warn).toHaveBeenCalledWith('Graceful shutdown - Server stopped receiving connections')
		expect(server.close).toHaveBeenCalledTimes(1)
	})

	it('should log warning if timeout reached', async () => {
		const handler = gracefulShutdown(server, { coredump: false, timeout: 500 })
		handler(signalCode, EExitReason.SIGTERM)(error, null)
		jest.advanceTimersByTime(500)

		expect(Logger.warn).toHaveBeenCalledWith('Graceful shutdown - Timeout reached: 500ms')
	})

	it('should log warning on process exit', async () => {
		const handler = gracefulShutdown(server, { coredump: false, timeout: 500 })
		handler(signalCode, EExitReason.SIGTERM)(error, null)
		process.emit('exit', signalCode)

		expect(Logger.warn).toHaveBeenCalledWith(
			`Graceful shutdown - Completed with signal code: ${signalCode}`
		)
	})
})
