import type { MessageDto } from './MessageDto';

export type SendMessageEventResponseDto = Omit<MessageDto, 'id'>;
