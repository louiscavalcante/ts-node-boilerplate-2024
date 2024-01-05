import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit'

export default class Middlewares {
	public static rateLimiter(seconds: number, maxRequest: number): RateLimitRequestHandler {
		return rateLimit({
			windowMs: seconds * 1000, // X seconds
			max: maxRequest, // Limit each IP to Y requests per `window` (here, per X seconds)
			standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
			legacyHeaders: false, // Disable the `X-RateLimit-*` headers
			keyGenerator: (req: any) => req.headers['x-forwarded-for'] || req.socket.remoteAddress, // Use the IP address of the client as the key
		})
	}
}
