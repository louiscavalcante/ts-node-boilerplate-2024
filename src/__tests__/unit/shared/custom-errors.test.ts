import { AxiosError } from 'axios'

import { AxiosRequestError, DomainError } from '@shared/custom-errors.shared'

describe('DomainError', () => {
	test('should create an instance with the name "DomainError"', () => {
		const domainError = new DomainError('Error message')
		expect(domainError.name).toBe('DomainError')
	})

	test('should set the provided message as the error message', () => {
		const domainError = new DomainError('Custom error message')
		expect(domainError.message).toBe('Custom error message')
	})

	test('should set status to 422', () => {
		const domainError = new DomainError('Error message')
		expect(domainError.status).toBe(422)
	})
})

describe('AxiosRequestError', () => {
	test('should create an instance with the name "AxiosRequestError"', () => {
		const axiosError = { message: 'Axios error message' } as AxiosError
		const axiosRequestError = new AxiosRequestError(axiosError)
		expect(axiosRequestError.name).toBe('AxiosRequestError')
	})

	test('should set axiosError as the axiosError property', () => {
		const axiosError = { message: 'Axios error message' } as AxiosError
		const axiosRequestError = new AxiosRequestError(axiosError)
		expect(axiosRequestError.axiosError).toBe(axiosError)
	})

	test('should set status to 500 by default', () => {
		const axiosError = { message: 'Axios error message' } as AxiosError
		const axiosRequestError = new AxiosRequestError(axiosError)
		expect(axiosRequestError.status).toBe(500)
	})
})
