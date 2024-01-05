import { Router } from 'express'

export interface IControllers {
	initRouter(): Router
}
