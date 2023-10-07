import type { MessageDto } from './MessageDto';

export type ReceivedMessageEventResponseDto = Omit<MessageDto, 'id'>;
