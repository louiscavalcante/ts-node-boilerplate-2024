import { Server } from 'node:http'
import { Logger } from 'traceability'

import { IExitHandler } from '@helpers/interfaces/graceful-shutdown.helper.interface'

export function gracefulShutdown(server: Server, options = { coredump: false, timeout: 500 }): IExitHandler {
	return (signalCode, exitReason) => (error, _promise) => {
		if (error && error instanceof Error) {
			Logger.error({
				exitReason,
				signalCode,
				message: error.message,
				stack: error.stack,
			})
		}

		const exit = (signalCode: number): void => {
			options.coredump ? process.abort() : process.exit(signalCode)
		}

		const shutdownPhases = async () => {
			//TODO Close database here.
			exit(signalCode)
		}

		Logger.warn('Graceful shutdown - Server stopped receiving connections')
		server.close(async () => {
			await shutdownPhases()
		})

		setTimeout(async () => {
			Logger.warn(`Graceful shutdown - Timeout reached: ${options.timeout}ms`)
			await shutdownPhases()
		}, options.timeout).unref()

		process.on('exit', signalCode => {
			Logger.warn(`Graceful shutdown - Completed with signal code: ${signalCode}`)
		})
	}
}
