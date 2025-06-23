import { RoleModel } from './roleModel';
export interface Message {
  memberMessageId: number;
  sessionId: string;
  createdAt: string;
  lastActiveAt: string;
  question: string;
  answer: string;
  isStreaming?: boolean;
  roleModels?: RoleModel[];

  type?: 'normal' | 'intro' | 'modelMessage';
  roleModelInfo?: {
    name: string;
    careerTitle: string;
    skillSet: string;
    tenure: number;
    profileImage: string;
  };
}
