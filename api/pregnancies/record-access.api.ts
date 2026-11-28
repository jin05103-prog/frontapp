import { pregnancyRequest } from "./care-request.api";
import type {
  ClinicalAccessRequest,
  ClinicalAccessRequests,
} from "@/types/pregnancies/record-access.type";
export const getRecordAccessRequestsApi = (page = 1, signal?: AbortSignal) =>
  pregnancyRequest<ClinicalAccessRequests>(
    `/record-access-requests?page=${page}`,
    "GET",
    undefined,
    signal,
  );
export const decideRecordAccessApi = (
  pregnancyId: number,
  accessId: number,
  decision: "APPROVED" | "REJECTED",
  duration_days: 1 | 7 | 30,
  note: string,
) =>
  pregnancyRequest<ClinicalAccessRequest>(
    `/${pregnancyId}/record-access-requests/${accessId}/decision`,
    "POST",
    { decision, duration_days, note },
  );
export const revokeRecordAccessApi = (pregnancyId: number, accessId: number) =>
  pregnancyRequest<ClinicalAccessRequest>(
    `/${pregnancyId}/record-access-requests/${accessId}/revoke`,
    "POST",
    {},
  );
