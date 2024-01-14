import { Request, Response, NextFunction } from 'express'
import { Writable } from 'node:stream'
import { LoggerTraceability } from 'traceability'
import winston from 'winston'

import ErrorHandler from '@application/middlewares/error-handler.middleware'
import { loggerConfiguration } from '@configs/logger.config'
import { DomainError } from '@shared/custom-errors.shared'

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
	let req: Request
	let res: Response
	let next: NextFunction
	let loggerOutput: string[]

	beforeEach(() => {
		const { loggerOutputData } = getLoggerOutput()
		loggerOutput = loggerOutputData

		req = {} as Request
		res = {
			status: jest.fn(() => res),
			send: jest.fn(),
		} as any
		next = jest.fn()
	})

	it('should log an error and send a generic message in production mode for non-DomainError', () => {
		process.env.NODE_ENV = 'production'

		const error = {
			name: 'TestError',
			message: 'Test error message',
			stack: 'Test error stack',
			status: 500,
		}

		ErrorHandler.middleware()(error, req, res, next)

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[31m2024-01-20T13:00:00.000Z - error:\\u001b[39m Test error message name: TestError status: 500 stack: \\"Test error stack\\" \\n"]'
		)
		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.send).toHaveBeenCalledWith({
			message: 'Something bad happened',
		})
	})

	it('should log a warning and send a custom error message in production mode for DomainError', () => {
		process.env.NODE_ENV = 'production'

		const error = new DomainError('Test error message')

		ErrorHandler.middleware()(error, req, res, next)

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[33m2024-01-20T13:00:00.000Z - warn:\\u001b[39m Test error message name: DomainError status: 422 \\n"]'
		)
		expect(res.status).toHaveBeenCalledWith(error.status)
		expect(res.send).toHaveBeenCalledWith({
			message: error.message,
		})
	})

	it('should log an error and send error details in non-production mode', () => {
		process.env.NODE_ENV = 'development'

		const error = new DomainError('Test error message')

		ErrorHandler.middleware()(error, req, res, next)

		expect(JSON.stringify(loggerOutput)).toEqual(
			'["\\u001b[33m2024-01-20T13:00:00.000Z - warn:\\u001b[39m Test error message name: DomainError status: 422 \\n"]'
		)
		expect(res.status).toHaveBeenCalledWith(error.status)
		expect(res.send).toHaveBeenCalledWith({
			message: error.message,
			stack: error.stack,
		})
	})
})
