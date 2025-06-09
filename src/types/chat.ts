export interface Message {
  memberMessageId: number;
  sessionId: string;
  createdAt: string;
  lastActiveAt: string;
  question: string;
  answer: string;
  isStreaming?: boolean;
}