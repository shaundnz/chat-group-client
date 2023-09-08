export interface ErrorDto<T> {
	message: T;
	statusCode: number;
}
