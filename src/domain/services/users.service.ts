import { IUsersService } from '@domain/services/interfaces/users.service.interface'

export default class UsersService implements IUsersService {
	public async getUsers(): Promise<any> {
		return ['Luiz', 'Jose']
	}
}
