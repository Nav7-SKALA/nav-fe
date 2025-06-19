export interface Project {
  id: number;
  title: string;
  period: string;
  domain: string;
  projectSize: string;
  role: string[];
  skills: string[];
}

export interface ProjectFormDto {
  domainId: (string | number) | null;
  projectName: string;
  projectDescribe: string;
  startYear: number;
  endYear: number;
  projectSize: (string | number) | null;
  role: (string | number)[];
  skillSetIds: (string | number)[];
  isTurningPoint: boolean;
}
