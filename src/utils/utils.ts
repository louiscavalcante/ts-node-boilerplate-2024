import { Server } from 'http'
import { Logger } from 'traceability'

import { IExit, IExitHandler } from '@utils/interfaces/utils.interface'

export function terminateApp(server: Server, options = { coredump: false, timeout: 500 }): IExitHandler {
	const exit: IExit = (code: number): void => {
		options.coredump ? process.abort() : process.exit(code)
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

export async function gracefulShutdown(
	server: Server,
	exitCode: number,
	timeout: number,
	exit?: IExit
): Promise<void> {
	server.close(() => exit || process.exit(exitCode))
	//todo Close database here.

	setTimeout(() => exit || process.exit(exitCode), timeout).unref()
	console.log('\nGraceful shutdown complete!')
}

export function fakeDbCrash(): Promise<Error> {
	return Promise.reject(new Error('Could not connect to DB'))
}
