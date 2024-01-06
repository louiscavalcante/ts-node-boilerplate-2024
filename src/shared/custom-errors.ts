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
 * It should not be used as a throw.
 *
 * This is just a group class for extensions of infrastructure errors.
 *
 * Can be used as an instanceof InfrastructureError
 */
export class InfrastructureError extends Error {
	status: number

	constructor(message: string) {
		super(message)
		this.status = 500
	}
}

/**
 * It should be used for axios request error.
 *
 * e.g. Inside the catch of a try with an axios request.
 * @param error - Pass on the error from the catch.
 */
export class AxiosRequestError extends InfrastructureError {
	constructor(error: AxiosError) {
		super(error.message)
		this.name = 'AxiosRequestError'
	}
}
