import { Request, Response, NextFunction } from 'express'
import { Writable } from 'node:stream'
import { Logger, LoggerTraceability } from 'traceability'
import winston from 'winston'

import ErrorHandler from '@application/middlewares/error-handler.middleware'
import { loggerConfiguration } from '@configs/logger.config'
import { AxiosRequestError, DomainError } from '@shared/custom-errors.shared'

const getLoggerOutput = () => {
	const loggerOutputData: string[] = []
	const stream = new Writable()
	stream._write = (chunk, encoding, next) => {
		loggerOutputData.push(chunk.toString())
		next()
	}
	const streamTransport = new winston.transports.Stream({ stream })
	loggerConfiguration.transports = [streamTransport]
	LoggerTraceability.configure(loggerConfiguration)

	return { loggerOutputData, streamTransport }
}

describe('ErrorHandler middleware', () => {
	let mockRequest: Request
	let mockResponse: Response
	let mockNext: NextFunction
	let loggerOutput: string[]

	beforeEach(() => {
		const { loggerOutputData } = getLoggerOutput()
		loggerOutput = loggerOutputData

		mockRequest = {} as Request
		mockResponse = {
			status: jest.fn(() => mockResponse),
			send: jest.fn(),
		} as any
		mockNext = jest.fn()
	})

	it('should log an error and send a generic message in production mode for non-DomainError', () => {
		process.env.NODE_ENV = 'production'

		const error = {
			name: 'TestError',
			message: 'Test error message',
			stack: 'Test error stack',
			status: 500,
		}

		ErrorHandler.middleware()(error, mockRequest, mockResponse, mockNext)

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[31m2024-01-20T13:00:00.000Z - error:\\u001b[39m Test error message name: TestError status: 500 stack: \\"Test error stack\\" \\n"]'
		)
		expect(mockResponse.status).toHaveBeenCalledWith(500)
		expect(mockResponse.send).toHaveBeenCalledWith({
			message: 'Something bad happened',
		})
	})

	it('should log a warning and send a custom error message in production mode for DomainError', () => {
		process.env.NODE_ENV = 'production'

		const error = new DomainError('Test error message')

		ErrorHandler.middleware()(error, mockRequest, mockResponse, mockNext)

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[33m2024-01-20T13:00:00.000Z - warn:\\u001b[39m Test error message name: DomainError status: 422 \\n"]'
		)
		expect(mockResponse.status).toHaveBeenCalledWith(error.status)
		expect(mockResponse.send).toHaveBeenCalledWith({
			message: error.message,
		})
	})

	it('should log an error and send error details in non-production mode', () => {
		process.env.NODE_ENV = 'development'

		const error = new DomainError('Test error message')

		ErrorHandler.middleware()(error, mockRequest, mockResponse, mockNext)

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[33m2024-01-20T13:00:00.000Z - warn:\\u001b[39m Test error message name: DomainError status: 422 \\n"]'
		)
		expect(mockResponse.status).toHaveBeenCalledWith(error.status)
		expect(mockResponse.send).toHaveBeenCalledWith({
			message: error.message,
			stack: error.stack,
		})
	})

	test('should log status 500 if no status is passed', () => {
		jest.mock('traceability').spyOn(Logger, 'error')

		const error = new Error('Custom error')

		ErrorHandler.middleware()(error, mockRequest as Request, mockResponse as Response, mockNext)

		expect(Logger.error).toHaveBeenCalledWith(
			expect.objectContaining({
				status: 500,
			})
		)
	})

	test('should send axiosError to the client if not in production environment', () => {
		const error = new AxiosRequestError({
			name: 'axiosRequestError',
			message: 'axios message',
			isAxiosError: true,
			toJSON: () => {
				return {}
			},
		})

		error.stack = 'Custom stack trace'

		ErrorHandler.middleware()(error, mockRequest as Request, mockResponse as Response, mockNext)

		expect(mockResponse.send).toHaveBeenCalledWith({
			message: 'axios message',
			axiosError: expect.any(Object),
			stack: 'Custom stack trace',
		})
	})
})
