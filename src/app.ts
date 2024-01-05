import express, { Express, Request, Response } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { Server } from 'http'
import path from 'path'
import { ContextAsyncHooks } from 'traceability'

import { IControllers } from '@application/controllers/interfaces/controllers.interface'
import ErrorHandler from '@application/middlewares/error-handler.middleware'
import * as env from '@configs/env-constants'
import UsersControllerFactory from '@infrastructure/factory/users/users.controller.factory'
import { rootApiPath } from '@shared/constants'

export default class App {
	private readonly app: Express

	constructor() {
		this.app = express()
	}

	public async start(): Promise<void> {
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

	public server(): Server {
		return this.app
			.listen(env.PORT, () => {
				console.log('Current environment:', env.NODE_ENV)
				console.log(`Health route: http://localhost:${env.PORT}/_health`)
				console.log(`App listening on: http://localhost:${env.PORT}`)
				console.log(`Try running this: http://localhost:${env.PORT}${rootApiPath}/users`)
			})
			.setTimeout(30000)
	}
}

async function bootstrap(): Promise<void> {
	const app = new App()

	// Start database here.
	await app.start()
	app.server()
}

bootstrap()
