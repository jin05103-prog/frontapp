export interface MaternalSharingSetting {
  pregnancy_id: number;
  doctor_id: number;
  doctor_name: string;
  doctor_hospital: string;
  pregnancy_status: string;
  share_symptoms: boolean;
  share_guardian_contacts: boolean;
  version: number;
  updated_at: string | null;
}
export interface GuardianSharingSetting {
  pregnancy_id: number;
  share_contact: boolean;
  version: number;
  updated_at: string | null;
}
export interface SharingSettings {
  maternal: MaternalSharingSetting[];
  guardian: GuardianSharingSetting[];
}
