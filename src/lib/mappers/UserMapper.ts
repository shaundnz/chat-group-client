import type { UserDto } from '$lib/contracts';
import type { User } from '$lib/types';

export class UserMapper {
	static DtoToObject(userDto: UserDto): User {
		return {
			username: userDto.username
		};
	}
}
