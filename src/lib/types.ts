export interface Channel {
	id: string;
	title: string;
	description: string;
	members: string[];
}

export interface CreateChannelDto {
	title: string;
	description: string;
}
