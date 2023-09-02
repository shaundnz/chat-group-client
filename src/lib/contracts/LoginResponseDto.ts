import type { UserDto } from './UserDto';

export interface LoginResponseDto {
	accessToken: string;
	user: UserDto;
}
