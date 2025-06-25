export interface Certification {
  id: number;
  name: string;
  acquisitedAt: string;
}

export interface CertificationDto {
  certificationId: number | string;
  acquisitionDate: string;
}

export interface CertificationResponse {
  certificationId: number;
  certificationName: string;
  acquisitionDate: string;
}
