import type {
	ChannelDto,
	CreateChannelDto,
	LoginRequestDto,
	SendMessageEventRequestDto,
	SignUpRequestDto
} from '$lib/contracts';
import { expect, type APIRequestContext } from '@playwright/test';
import { Socket, io } from 'socket.io-client';

export class ChatApiContext {
	readonly apiContext: APIRequestContext;

	constructor(apiContext: APIRequestContext) {
		this.apiContext = apiContext;
	}

	async login(loginRequestDto: LoginRequestDto): Promise<string> {
		const loginRes = await this.apiContext.post('./auth/login', { data: loginRequestDto });
		expect(loginRes.ok()).toBeTruthy();
		const accessToken = (await loginRes.json()).accessToken;
		expect(accessToken).toBeTruthy();
		return accessToken;
	}

	async signUp(signUpRequestDto: SignUpRequestDto) {
		const signUpRes = await this.apiContext.post('./auth/signup', {
			data: signUpRequestDto
		});
		expect(signUpRes.ok()).toBeTruthy();
	}

	async getDefaultChannel(accessToken: string) {
		const defaultChannelRes = await this.apiContext.get('./channels/default', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		expect(defaultChannelRes.ok()).toBeTruthy();
		const defaultChannel: ChannelDto = await defaultChannelRes.json();
		return defaultChannel;
	}

	async getAllChannels(accessToken: string) {
		const allChannelsRes = await this.apiContext.get('./channels', {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		expect(allChannelsRes.ok()).toBeTruthy();
		const allChannels: ChannelDto[] = await allChannelsRes.json();
		return allChannels;
	}

	async createChannel(createChannelDto: CreateChannelDto, accessToken: string) {
		const newChannelRes = await this.apiContext.post('./channels', {
			data: createChannelDto,
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const newChannelJson: ChannelDto = await newChannelRes.json();
		return newChannelJson;
	}

	createSocket(socketUrl: string, accessToken: string): Socket {
		const socketClient = io(socketUrl, {
			auth: { token: accessToken }
		});
		return socketClient;
	}

	sendMessage(socket: Socket, sendMessageEventRequestDto: SendMessageEventRequestDto) {
		socket.emit('message:send', sendMessageEventRequestDto);
	}
}
