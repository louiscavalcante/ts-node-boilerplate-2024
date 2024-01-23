import { IControllers } from '@application/controllers/interfaces/controllers.interface'
import UsersController from '@application/controllers/users.controller'
import UsersServiceFactory from '@infrastructure/factory/users/users.service.factory'

export default class UsersControllerFactory {
	static create(): IControllers {
		const service = UsersServiceFactory.create()

		return new UsersController(service)
	}
}
