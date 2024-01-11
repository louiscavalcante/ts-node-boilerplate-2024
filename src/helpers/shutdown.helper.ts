import { Server } from 'node:http'
import { Logger } from 'traceability'

import { IExit, IExitHandler } from '@helpers/interfaces/shutdown.helpers.interface'

export function shutdownApp(server: Server, options = { coredump: false, timeout: 500 }): IExitHandler {
	const exit = (exitCode: number): void => {
		options.coredump ? process.abort() : process.exit(exitCode)
	}

	return (exitCode, exitReason) => (error, _promise) => {
		if (error && error instanceof Error) {
			Logger.error({
				exitReason,
				exitCode,
				message: error.message,
				stack: error.stack,
			})
		}

		gracefulShutdown(server, exitCode, options.timeout, exit)
	}
}

export function gracefulShutdown(server: Server, exitCode: number, timeout: number, exit?: IExit): void {
	const fullShutdown = async () => {
		//todo Close database here.
		exit ? exit(exitCode) : process.exit(exitCode)
	}

	Logger.warn('Server stopped receiving connections!')
	server.close(async () => {
		await fullShutdown()
	})

	Logger.warn('Gracefully shutting down!')

	setTimeout(async () => {
		Logger.warn('Graceful shutdown timeout reached!')
		await fullShutdown()
	}, timeout).unref()
}

export function fakeDbCrash(): Promise<Error> {
	return Promise.reject(new Error('Could not connect to DB'))
}
