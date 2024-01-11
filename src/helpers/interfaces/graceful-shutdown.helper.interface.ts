export interface IExitHandler {
	(signalCode: number, exitReason: EExitReason): (error: Error, _promise: any) => void
}

export enum EExitReason {
	UNEXPECTED_ERROR = 'Unexpected Error',
	UNHANDLED_PROMISE = 'Unhandled Promise',
	SIGINT = 'SIGINT',
	SIGTERM = 'SIGTERM',
}
