import express, { Express, Request, Response } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { Server } from 'http'
import path from 'path'
import { ContextAsyncHooks, Logger, LoggerTraceability } from 'traceability'

import { IControllers } from '@application/controllers/interfaces/controllers.interface'
import ErrorHandler from '@application/middlewares/error-handler.middleware'
import * as env from '@configs/env-constants'
import { loggerConfiguration } from '@configs/logger.config'
import UsersControllerFactory from '@infrastructure/factory/users/users.controller.factory'
import { rootApiPath } from '@shared/constants'
import { terminateApp } from '@utils/utils'

export default class App {
	private readonly app: Express

	constructor() {
		this.app = express()
	}

	public async start(): Promise<void> {
		LoggerTraceability.configure(loggerConfiguration)
		this.app.disable('x-powered-by')
		this.app.set('etag', false)
		this.app.use(ContextAsyncHooks.getExpressMiddlewareTracking())
		this.app.use(express.json({ limit: '5mb' }))
		this.app.use(express.urlencoded({ limit: '5mb', extended: true }))
		this.healthCheck()
		// Activate and configure the line bellow for public API's
		// this.app.use(Middlewares.rateLimiter(1, 10))
		this.app.use(
			OpenApiValidator.middleware({
				apiSpec: path.join(__dirname, 'docs/openapi.yaml'),
				validateRequests: true,
				validateResponses: false,
				validateSecurity: false,
			})
		)

		this.initRoutes([UsersControllerFactory.create()])

		this.app.use(ErrorHandler.middleware())
	}

	private initRoutes(controllersFactories: Array<IControllers>) {
		controllersFactories.forEach(controllerFactory =>
			this.app.use(rootApiPath, controllerFactory.initRouter())
		)
	}

	private healthCheck(): Express {
		return this.app.get('/_health', (_req: Request, res: Response) => {
			res.status(200).send('ok')
		})
	}

	public listen(): Server {
		return this.app
			.listen(env.PORT, () => {
				Logger.info(`Current environment: ${env.NODE_ENV}`)
				Logger.info(`Health route: http://localhost:${env.PORT}/_health`)
				Logger.info(`App listening on: http://localhost:${env.PORT}`)
				Logger.info(`Try running this: http://localhost:${env.PORT}${rootApiPath}/users`)
			})
			.setTimeout(30000)
	}
}

async function bootstrap(): Promise<void> {
	const app = new App()

	//todo Start database here.
	await app.start()
	const server = app.listen()

	const exitHandler = terminateApp(server, {
		coredump: false,
		timeout: 30000,
	})

	process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
	process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
	process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
	process.on('SIGINT', exitHandler(0, 'SIGINT'))

	// The line below will simulate a database crash to test unhandled rejection
	// setTimeout(async () => await fakeDbCrash(), 5000)
}

bootstrap()
