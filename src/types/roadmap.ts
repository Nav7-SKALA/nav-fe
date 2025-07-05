export type SimilarRoadmapItem =
  | { project: SimilarRoadmapProject[] }
  | { experience: SimilarRoadmapExperience[] }
  | { certification: SimilarRoadmapCertification[] };

export type SimilarRoadmaps = SimilarRoadmapItem[];

export interface SimilarRoadmapProject {
  period: string;
  name: string;
  role: string;
  job: string;
  detail: string;
}

export interface SimilarRoadmapExperience {
  name: string;
}

export interface SimilarRoadmapCertification {
  name: string;
}

export interface Roadmaps {
  period: string;
  project: string;
  role: string;
  job: string;
  key_skills: string;
  growth_focus: string;
}
