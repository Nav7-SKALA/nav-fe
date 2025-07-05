import { RoleModelGroup } from './roleModel';
import { RoleModelDtoResponse } from '../api/session';
import { SimilarRoadmaps, Roadmaps } from './roadmap';

export type MessageBlock =
  | { type: 'similar_text'; content: string }
  | { type: 'text'; content: string }
  | { type: 'similar_roadmaps'; content: SimilarRoadmaps }
  | { type: 'roadmaps'; content: Roadmaps[] }
  | { type: 'role_model'; content: RoleModelGroup[] }
  | { type: 'EXCEPTION'; content: string }
  | { type: 'career_goal'; content: string }
  | { type: 'ax_college'; content: string }
  | { type: 'role_model_chat'; content: string }
  | { type: 'role_model_card'; content: RoleModelDtoResponse };
export interface Message {
  memberMessageId: number;
  sessionId: string;
  createdAt: string;
  lastActiveAt: string;
  question: string;
  isStreaming?: boolean;
  responseType?: string;
  blocks: MessageBlock[];
}
