import { HTTPError } from './http-error'

export type ErrorHandler = (error: unknown) => void

export type ErrorHandlingSystem = {
	registerHandler: (handler: ErrorHandler) => () => void
	handleError: (error: unknown) => void
	isHttpError: (error: unknown) => error is HTTPError
}

let instance: ErrorHandlingSystem | null = null

export const createErrorHandler = (): ErrorHandlingSystem => {
	if (instance) {
		return instance
	}

	const handlers = new Set<ErrorHandler>()

	instance = {
		registerHandler: (handler: ErrorHandler) => {
			handlers.add(handler)
			return () => handlers.delete(handler)
		},

		handleError: (error: unknown) => {
			if (handlers.size === 0) {
				console.error('Unhandled error:', error)
				return
			}

			handlers.forEach((handler) => {
				try {
					handler(error)
				} catch (handlerError) {
					console.error('Error in error handler:', handlerError)
				}
			})
		},

		isHttpError: (error: unknown): error is HTTPError => {
			return error instanceof HTTPError
		},
	}

	return instance
}

export const errorHandler = createErrorHandler()
