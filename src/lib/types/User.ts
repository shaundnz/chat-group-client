import type { UserDto } from '$lib/contracts';

export type User = Omit<UserDto, 'id'>;
