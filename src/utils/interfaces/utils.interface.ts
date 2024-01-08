export interface IExit {
	(exitCode: number): void
}

export interface IExitHandler {
	(exitCode: number, reason: string): (error: Error, _promise: any) => void
}
