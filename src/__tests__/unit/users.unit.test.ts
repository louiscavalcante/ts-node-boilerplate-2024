import { PORT } from '@configs/env-constants.config'

describe('Users Unit Tests', () => {
	it('Should pass', () => {
		expect(PORT).toEqual(3000)
	})
})
