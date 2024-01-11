export interface IExit {
	(exitCode: number): void
}

export interface IExitHandler {
	(exitCode: number, exitReason: EExitReason): (error: Error, _promise: any) => void
}

export enum EExitReason {
	UNEXPECTED_ERROR = 'Unexpected Error',
	UNHANDLED_PROMISE = 'Unhandled Promise',
	SIGINT = 'SIGINT',
	SIGTERM = 'SIGTERM',
}
