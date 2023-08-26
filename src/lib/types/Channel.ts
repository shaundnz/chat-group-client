import type { ChannelDto } from '$lib/contracts';

export interface Channel extends ChannelDto {
	members: string[];
}
