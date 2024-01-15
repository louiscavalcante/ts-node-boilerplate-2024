import express, { Router, Request, Response, NextFunction } from 'express'

import { IControllers } from '@application/controllers/interfaces/controllers.interface'
import { IUsersService } from '@domain/services/interfaces/users.service.interface'

export default class UsersController implements IControllers {
	private readonly router: Router = express.Router()

	constructor(private readonly service: IUsersService) {
		this.getRoutes()
	}

	public initRouter(): Router {
		return this.router
	}

	private getRoutes(): Router {
		return this.router.get('/users', this.getUsers)
	}

	private getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		try {
			const results = await this.service.getUsers()

			return res.status(200).send(results)
		} catch (error) {
			next(error)
		}
	}
}
