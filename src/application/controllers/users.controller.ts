import express, { Router, Request, Response, NextFunction } from 'express'

import { IControllers } from '@application/controllers/interfaces/controllers.interface'
import { IUsersService } from '@application/services/interfaces/users.service.interface'

export default class UsersController implements IControllers {
	private readonly router: Router = express.Router()

	constructor(private readonly service: IUsersService) {
		this.getRoutes()
	}

	public initRouter(): Router {
		return this.router
	}

	private getRoutes(): void {
		this.router.get('/users', this.getUsers)
	}

	private getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const results = await this.service.getUsers()

			// The line below tests timeouts.
			// await new Promise(resolve => setTimeout(resolve, 5000))

			if (req.timedout) return
			res.status(200).send(results)
		} catch (error) {
			next(error)
		}
	}
}
