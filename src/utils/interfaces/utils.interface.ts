export interface IExit {
	(code: number): void
}

export interface IExitHandler {
	(exitCode: number, reason: string): (error: Error, _promise: any) => void
}
