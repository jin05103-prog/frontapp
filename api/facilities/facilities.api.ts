import type { HospitalList, HospitalVO, PageResponseDTO } from "@/types/facilities/facilities.type";

// 백엔드 조회 함수가 아직 없으므로, 확정된 상대 경로를 환경변수로 받습니다.
export function isHospitalApiConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() &&
    process.env.NEXT_PUBLIC_HOSPITALS_API_PATH?.trim(),
  );
}

// 응답은 외부 데이터라서 실제 필드를 검사하기 전까지 unknown으로 취급합니다.
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// 현재 HospitalVO의 모든 필수 필드를 검사합니다. 백엔드가 주지 않는 필드는 요구하지 않습니다.
function isHospitalVO(value: unknown): value is HospitalVO {
  if (!isObject(value)) return false;
  return (
    typeof value.id === "number" && Number.isSafeInteger(value.id) &&
    typeof value.hospital_latitude === "number" && Number.isFinite(value.hospital_latitude) &&
    value.hospital_latitude >= -90 && value.hospital_latitude <= 90 &&
    typeof value.hospital_longitude === "number" && Number.isFinite(value.hospital_longitude) &&
    value.hospital_longitude >= -180 && value.hospital_longitude <= 180 &&
    typeof value.hospital_registration_file_key === "string" &&
    typeof value.hospital_name === "string" &&
    typeof value.hospital_address === "string" &&
    typeof value.hospital_phone === "string" &&
    typeof value.hospital_night_service === "boolean"
  );
}

// 백엔드에 정의된 PageResponseDTO를 반환하는 경우에도 필드를 검사합니다.
function isHospitalPage(value: unknown): value is PageResponseDTO<HospitalVO> {
  if (!isObject(value)) return false;
  return (
    typeof value.total_count === "number" && Number.isSafeInteger(value.total_count) && value.total_count >= 0 &&
    typeof value.total_pages === "number" && Number.isSafeInteger(value.total_pages) && value.total_pages >= 0 &&
    typeof value.offset === "number" && Number.isSafeInteger(value.offset) && value.offset >= 0 &&
    typeof value.limit === "number" && Number.isSafeInteger(value.limit) && value.limit >= 0 &&
    (value.items === null || (Array.isArray(value.items) && value.items.every(isHospitalVO)))
  );
}

// 백엔드의 ApiResponseDTO 안에 HospitalVO 배열 또는 PageResponseDTO가 오는 경우를 처리합니다.
export async function getHospitals(signal: AbortSignal): Promise<HospitalList> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  const path = process.env.NEXT_PUBLIC_HOSPITALS_API_PATH?.trim();
  if (!baseUrl || !path) throw new Error("의료기관 조회 연결을 준비하고 있습니다.");
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error("병원 조회 경로는 /로 시작하는 상대 경로로 설정해 주세요.");
  }

  // 현재 API에 지도 범위 파라미터가 정의되지 않아, 응답을 받은 뒤 프론트에서 범위를 거릅니다.
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) throw new Error("의료기관 정보를 불러오지 못했습니다.");

  const body: unknown = await response.json();
  // 백엔드 common_schema.py의 ApiResponseDTO 외형과 맞춥니다.
  if (!isObject(body) || body.success !== true || typeof body.message !== "string") {
    throw new Error("의료기관 응답을 확인할 수 없습니다.");
  }

  // ApiResponseDTO<HospitalVO[]> 형식이면 배열을 그대로 사용합니다.
  if (Array.isArray(body.data) && body.data.every(isHospitalVO)) {
    return { items: body.data, total_count: body.data.length };
  }

  // ApiResponseDTO<PageResponseDTO<HospitalVO>> 형식이면 현재 받은 페이지 항목을 사용합니다.
  // 다음 페이지 조회 매개변수는 실제 API가 확정된 뒤 연결해야 합니다.
  if (isHospitalPage(body.data)) {
    if (body.data.items === null && body.data.total_count > 0) {
      throw new Error("병원 목록 항목이 응답에서 빠져 있습니다.");
    }
    return { items: body.data.items ?? [], total_count: body.data.total_count };
  }

  throw new Error("병원 목록이 현재 HospitalVO 형식과 맞지 않습니다.");
}
