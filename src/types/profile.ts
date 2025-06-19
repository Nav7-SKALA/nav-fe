export interface Profile {
  profileId: number;
  years: number | null;
  careerTitle: string | null;
  profileImg: string | null;
  skillInfos: string[];
}

export interface ProfileFormDto {
  years: number;
  skillSetIds: (string | number)[];
  profileImg: string;
}
