import type { MessageDto } from './MessageDto';

export type SendMessageEventRequestDto = Omit<MessageDto, 'id' | 'createdAt' | 'user'>;
