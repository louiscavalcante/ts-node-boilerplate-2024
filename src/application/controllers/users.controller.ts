import express, { Router, Request, Response, NextFunction } from 'express'

import { IControllers } from '@application/controllers/interfaces/controllers.interface'
import { GetUsersSuccessResponse } from '@application/controllers/interfaces/users.controller.interface'
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

	private getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const users: GetUsersSuccessResponse = await this.service.getUsers()

			res.status(200).send(users)
		} catch (error) {
			next(error)
		}
	}
}
