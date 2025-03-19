export class HTTPError extends Error {
	constructor(
		message: string,
		public status: number,
		public data?: unknown
	) {
		super(message)
		this.name = 'HTTPError'
		Object.setPrototypeOf(this, HTTPError.prototype)
	}
}
