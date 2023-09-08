import type { ErrorDto } from './ErrorDto';

export type SignUpBadRequestDto = ErrorDto<{ property: string; error: string }[]>;
