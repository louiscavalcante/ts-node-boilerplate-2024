import { AxiosError } from 'axios'

export interface ICustomError extends Error {
	status?: number
	axiosError?: AxiosError
}
