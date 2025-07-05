export interface RoleModel {
  years?: number;
  careerTitle?: string;
  name?: string;
}

export interface RoleModelGroup {
  greetingMessage?: string;
  group_id: string;
  group_name: string;
  current_position: string;
  experience_years: string;
  main_domains: string[];
  advice_message: string;
  common_skill_set: string[];
  common_career_path: string[];
  common_project: string[];
  common_experience: string[];
  common_cert: string[];
}
