import { AxiosError } from 'axios'

/**
 * It should be used for validations.
 *
 * e.g. User under age.
 *
 * It will be displayed to the client.
 * @param message - Input the known cause of the error.
 */
export class DomainError extends Error {
	readonly status: number

	constructor(message: string) {
		super(message)
		this.name = 'DomainError'
		this.status = 422
	}
}

/**
 * It can't be used as a new instance.
 *
 * This is just an abstract class to group extensions of infrastructure errors.
 *
 * Should be used as an instanceof InfrastructureError
 */
export abstract class InfrastructureError extends Error {
	readonly status?: number

	constructor(
		readonly axiosError?: AxiosError,
		status?: number
	) {
		super(axiosError?.message)
		this.status = status || 500
	}
}

/**
 * It should be used for axios request error.
 *
 * e.g. Inside the catch of a try with an axios request.
 * @param error - Pass on the error from the catch.
 */
export class AxiosRequestError extends InfrastructureError {
	constructor(axiosError: AxiosError) {
		super(axiosError)
		this.name = 'AxiosRequestError'
	}
}
