export interface ChannelDto {
	id: string;
	title: string;
	description: string;
}

export interface Channel {
	id: string;
	title: string;
	description: string;
	members: string[];
	messages: string[];
}

export interface CreateChannelDto {
	title: string;
	description: string;
}
