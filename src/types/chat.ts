export interface Message {
  memberMessageId: number;
  sessionId: number;
  createdAt: string;
  lastActiveAt: string;
  question: string;
  answer: string;
  isStreaming?: boolean;
}
