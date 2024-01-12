import { IUsersService } from '@domain/services/interfaces/users.service.interface'
import UsersService from '@domain/services/users.service'

export default class UsersServiceFactory {
	static create(): IUsersService {
		return new UsersService()
	}
}
