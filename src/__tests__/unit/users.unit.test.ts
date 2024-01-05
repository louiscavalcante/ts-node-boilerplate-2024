import { PORT } from '@configs/env-constants'

describe('Users Unit Tests', () => {
	it('Should pass', () => {
		expect(PORT).toEqual(3000)
	})
})
