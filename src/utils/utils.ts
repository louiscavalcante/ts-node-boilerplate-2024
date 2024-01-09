import { Server } from 'http'
import { Logger } from 'traceability'

import { IExit, IExitHandler } from '@utils/interfaces/utils.interface'

export function terminateApp(server: Server, options = { coredump: false, timeout: 500 }): IExitHandler {
	const exit = (exitCode: number): void => {
		options.coredump ? process.abort() : process.exit(exitCode)
	}

	return (exitCode, reason) => (error, _promise) => {
		if (error && error instanceof Error) {
			Logger.error({
				reason,
				exitCode,
				message: error.message,
				stack: error.stack,
			})
		}

		gracefulShutdown(server, exitCode, options.timeout, exit)
	}
}

export function gracefulShutdown(server: Server, exitCode: number, timeout: number, exit?: IExit): void {
	Logger.warn('Server stopped receiving connections!')
	server.close(async () => {
		//todo Close database here.
		exit ? exit(exitCode) : process.exit(exitCode)
	})

	setTimeout(() => {
		Logger.warn('Graceful shutdown timeout reached!')
		exit ? exit(exitCode) : process.exit(exitCode)
	}, timeout).unref()

	Logger.warn('Graceful shutdown complete!')
}

export function fakeDbCrash(): Promise<Error> {
	return Promise.reject(new Error('Could not connect to DB'))
}
