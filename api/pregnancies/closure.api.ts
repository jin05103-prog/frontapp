import { pregnancyRequest } from "./care-request.api";
import type { PregnancyClosureRequest } from "@/types/pregnancies/closure.type";
export const getClosureRequestsApi = (signal?: AbortSignal) =>
  pregnancyRequest<{ requests: PregnancyClosureRequest[]; limit: number }>(
    "/closure-requests",
    "GET",
    undefined,
    signal,
  );
export const decideClosureApi = (
  pregnancyId: number,
  id: number,
  decision: "ACCEPT" | "REJECT",
  note: string,
) =>
  pregnancyRequest<PregnancyClosureRequest>(
    `/${pregnancyId}/closure-requests/${id}/decision`,
    "POST",
    { decision, note },
  );
