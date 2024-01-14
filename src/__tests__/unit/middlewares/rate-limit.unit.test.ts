import rateLimit from 'express-rate-limit'

import RateLimit from '@application/middlewares/rate-limit.middleware'

jest.mock('express-rate-limit')

describe('RateLimit middleware', () => {
	const seconds = 60
	const maxRequest = 100

	it('should create middleware with correct configuration', () => {
		RateLimit.middleware(seconds, maxRequest)

		expect(rateLimit).toHaveBeenCalledWith({
			windowMs: seconds * 1000,
			max: maxRequest,
			standardHeaders: true,
			legacyHeaders: false,
			keyGenerator: expect.any(Function),
		})
	})

	it('should use the IP address of the client as the key', () => {
		const mockRequest = {
			headers: {
				'x-forwarded-for': '192.168.0.1',
			},
			socket: {
				remoteAddress: '192.168.0.2',
			},
		}

		RateLimit.middleware(seconds, maxRequest)
		const keyGenerator = (rateLimit as jest.Mock).mock.calls[0][0].keyGenerator as (req: any) => string

		const key = keyGenerator(mockRequest)

		expect(key).toBe('192.168.0.1')
	})

	it('should fallback to remote address if x-forwarded-for is not present', () => {
		const mockRequest = {
			headers: {},
			socket: {
				remoteAddress: '192.168.0.2',
			},
		}

		RateLimit.middleware(seconds, maxRequest)
		const keyGenerator = (rateLimit as jest.Mock).mock.calls[0][0].keyGenerator as (req: any) => string

		const key = keyGenerator(mockRequest)

		expect(key).toBe('192.168.0.2')
	})
})
