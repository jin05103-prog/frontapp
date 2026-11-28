import { getCurrentUserApi } from "@/api/auth/auth.api";
import type {
  AvailableDoctorDTO,
  MaternalCareContextDTO,
} from "@/types/pregnancies/care-request.type";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

export class CareRequestApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  method = "GET",
  data?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  if (!BACKEND) throw new Error("백엔드 연결 설정이 필요합니다.");
  const send = async () => {
    try {
      return await fetch(`${BACKEND}/pregnancies${path}`, {
        method,
        credentials: "include",
        cache: "no-store",
        signal,
        ...(data === undefined
          ? {}
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }),
      });
    } catch (cause) {
      if (signal?.aborted) throw cause;
      throw new Error(
        "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }
  };
  let response = await send();
  if (response.status === 401) {
    // 기존 사용자 로그인 흐름과 같이 갱신을 한 번만 시도합니다.
    const user = await getCurrentUserApi(signal);
    if (!user) throw new CareRequestApiError(401, "로그인 후 이용해 주세요.");
    response = await send();
  }
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new CareRequestApiError(
      response.status,
      typeof body?.detail === "string"
        ? body.detail
        : "연결 요청을 처리하지 못했습니다.",
    );
  if (!body?.success || body.data == null)
    throw new Error("연결 정보를 확인하지 못했습니다.");
  return body.data;
}

export const getMaternalCareContextApi = (signal?: AbortSignal) =>
  request<MaternalCareContextDTO>("/care-context", "GET", undefined, signal);
export const searchAvailableDoctorsApi = (
  query: string,
  signal?: AbortSignal,
) =>
  request<AvailableDoctorDTO[]>(
    `/doctors?query=${encodeURIComponent(query)}`,
    "GET",
    undefined,
    signal,
  );
export const createCareRequestApi = (pregnancyId: number, doctorId: number) =>
  request<{ id: number; status: "PENDING" }>(
    `/${pregnancyId}/care-requests`,
    "POST",
    { doctor_id: doctorId },
  );
export const cancelCareRequestApi = (pregnancyId: number, requestId: number) =>
  request<{ id: number; status: "CANCELLED" }>(
    `/${pregnancyId}/care-requests/${requestId}`,
    "DELETE",
  );
