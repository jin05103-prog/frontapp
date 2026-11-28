export interface AvailableDoctorDTO {
  id: number;
  doctor_name: string;
  doctor_hospital: string;
}

export type CareRequestStatus =
  "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVOKED";

export interface MaternalCareRequestDTO {
  id: number;
  pregnancy_id: number;
  doctor_id: number;
  doctor_name: string;
  doctor_hospital: string;
  status: CareRequestStatus;
  requested_at: string;
  approved_at: string | null;
}

export interface MaternalCareContextDTO {
  pregnancies: { id: number; baby_names: string[]; due_date: string | null }[];
  requests: MaternalCareRequestDTO[];
}
