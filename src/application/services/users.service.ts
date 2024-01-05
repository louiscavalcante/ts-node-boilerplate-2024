import { IUsersService } from '@application/services/interfaces/users.service.interface'

export default class UsersService implements IUsersService {
	public async getUsers(): Promise<any> {
		return ['Luiz', 'Jose']
	}
}
