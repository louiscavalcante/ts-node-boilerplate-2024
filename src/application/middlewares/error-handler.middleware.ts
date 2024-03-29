import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { Logger } from 'traceability'

import { ICustomError } from '@application/middlewares/interfaces/error-handler.middleware.interface'
import { DomainError } from '@shared/custom-errors.shared'

export default class ErrorHandler {
	public static middleware(): ErrorRequestHandler {
		return (error: ICustomError, _req: Request, res: Response, _next: NextFunction) => {
			error.stack = error.status === 404 || error instanceof DomainError ? '' : error.stack

			const logLevel = error instanceof DomainError ? 'warn' : 'error'

			Logger[`${logLevel}`]({
				status: error.status || 500,
				name: error.name,
				message: error.message,
				axiosError: error.axiosError,
				stack: error.stack,
			})

			if (process.env.NODE_ENV === 'production') {
				if (error instanceof DomainError) {
					return res.status(error.status).send({
						message: error.message,
					})
				}

				return res.status(500).send({
					message: 'Something bad happened',
				})
			}

			return res.status(error.status || 500).send({
				message: error.message,
				...(error.axiosError ? { axiosError: error.axiosError } : {}),
				stack: error.stack,
			})
		}
	}
}
