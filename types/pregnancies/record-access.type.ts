export interface ClinicalAccessRequest {
  id: number;
  pregnancy_id: number;
  status:
    "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "REVOKED" | "EXPIRED";
  scope_version: string;
  purpose: string;
  requested_at: string;
  decided_at: string | null;
  decision_note: string;
  expires_at: string | null;
  revoked_at: string | null;
  doctor_name: string;
  doctor_hospital: string;
  last_access_at: string | null;
}
export interface ClinicalAccessRequests {
  requests: ClinicalAccessRequest[];
  total: number;
  page: number;
  page_size: number;
}
