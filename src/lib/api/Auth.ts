import type { LoginRequestDto, LoginResponseDto, SignUpRequestDto, UserDto } from '$lib/contracts';
import { UserMapper } from '$lib/mappers';
import type { User } from '$lib/types';
import { get, post } from './fetchWrapper';

export class AuthApi {
	static async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
		const loginRes = await post<LoginRequestDto, LoginResponseDto>('/auth/login', loginRequestDto);
		return loginRes;
	}

	static async signUp(signUpRequestDto: SignUpRequestDto): Promise<User> {
		const signUpRes = await post<SignUpRequestDto, UserDto>('/auth/signup', signUpRequestDto);
		return UserMapper.DtoToObject(signUpRes);
	}

	static async getLoggedInUser(): Promise<User> {
		const res = await get<UserDto>('/auth/me');
		return UserMapper.DtoToObject(res);
	}
}
