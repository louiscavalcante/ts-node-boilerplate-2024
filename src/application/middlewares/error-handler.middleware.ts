import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { Logger } from 'traceability'

import { ICustomError } from '@application/middlewares/interfaces/error-handler.interface'
import * as env from '@configs/env-constants'
import { DomainError } from '@shared/custom-errors'

export default class ErrorHandler {
	public static middleware(): ErrorRequestHandler {
		return (error: ICustomError, req: Request, res: Response, _next: NextFunction) => {
			error.stack = error.status === 404 || error instanceof DomainError ? '' : error.stack

			Logger.error({
				status: error.status || 500,
				name: error.name,
				message: error.message,
				stack: error.stack,
			})

			if (env.NODE_ENV === 'production') {
				if (error instanceof DomainError) {
					return res.status(error.status || 500).send({
						message: error.message,
					})
				}

				return res.status(500).send({
					message: 'Something bad happened',
				})
			}

			res.status(error.status || 500).send({
				message: error.message,
				stack: error.stack,
			})
		}
	}
}
