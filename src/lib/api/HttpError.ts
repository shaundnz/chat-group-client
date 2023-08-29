import type { ErrorDto } from '$lib/contracts';

export class HttpError extends Error {
	readonly statusCode: number;

	constructor({ message, statusCode }: ErrorDto) {
		super(message);
		this.statusCode = statusCode;
	}
}
