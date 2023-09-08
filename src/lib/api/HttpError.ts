import type { ErrorDto } from '$lib/contracts';

export class HttpError<T> {
	readonly statusCode: number;
	readonly message: T;

	constructor({ message, statusCode }: ErrorDto<T>) {
		this.message = message;
		this.statusCode = statusCode;
	}
}
