export interface PregnancyClosureRequest {
  id: number;
  pregnancy_id: number;
  status: "CONSIDERING" | "ACCEPT" | "REJECT" | "CANCELLED";
  doctor_name: string;
  doctor_hospital: string;
  requested_at: string;
  note: string;
  reviewed_at: string | null;
  decision_note: string;
  items: {
    fetus_id: number;
    fetus_name: string;
    outcome: "PREMATUREBIRTH" | "ABORTION" | "FULLTERM";
    ended_on: string;
  }[];
}
