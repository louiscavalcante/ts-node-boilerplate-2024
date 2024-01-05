import { IUsersService } from '@application/services/interfaces/users.service.interface'
import UsersService from '@application/services/users.service'

export default class UsersServiceFactory {
	static create(): IUsersService {
		return new UsersService()
	}
}
