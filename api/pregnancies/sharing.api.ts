import { pregnancyRequest } from "./care-request.api";
import type { SharingSettings } from "@/types/pregnancies/sharing.type";
export const getSharingSettingsApi = (signal?: AbortSignal) =>
  pregnancyRequest<SharingSettings>(
    "/sharing-settings",
    "GET",
    undefined,
    signal,
  );
export const updateMaternalSharingApi = (
  pregnancyId: number,
  doctorId: number,
  values: {
    share_symptoms: boolean;
    share_guardian_contacts: boolean;
    expected_version: number;
  },
) =>
  pregnancyRequest(`/${pregnancyId}/doctor-sharing/${doctorId}`, "PUT", values);
export const updateGuardianSharingApi = (
  pregnancyId: number,
  values: { share_contact: boolean; expected_version: number },
) =>
  pregnancyRequest(`/${pregnancyId}/guardian-contact-sharing`, "PUT", values);
