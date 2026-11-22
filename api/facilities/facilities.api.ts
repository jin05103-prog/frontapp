import { HOSPITAL_TYPES } from "@/types/facilities/facilities.type";
import type {
  HospitalList,
  HospitalVO,
} from "@/types/facilities/facilities.type";

const hospitalsPath =
  process.env.NEXT_PUBLIC_HOSPITALS_API_PATH?.trim() || "/maps/hospitals";

export function isHospitalApiConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_BACKEND_URL?.trim());
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// API 응답을 확인한 뒤 화면에 넘깁니다. 삭제된 병원 증빙 파일 필드는 요구하지 않습니다.
function isHospitalVO(value: unknown): value is HospitalVO {
  if (!isObject(value)) return false;
  return (
    typeof value.id === "number" &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    typeof value.hospital_latitude === "number" &&
    Number.isFinite(value.hospital_latitude) &&
    value.hospital_latitude >= -90 &&
    value.hospital_latitude <= 90 &&
    typeof value.hospital_longitude === "number" &&
    Number.isFinite(value.hospital_longitude) &&
    value.hospital_longitude >= -180 &&
    value.hospital_longitude <= 180 &&
    HOSPITAL_TYPES.some((kind) => kind === value.hospital_type) &&
    typeof value.hospital_name === "string" &&
    typeof value.hospital_address === "string" &&
    typeof value.hospital_phone === "string" &&
    typeof value.hospital_night_service === "boolean"
  );
}

export async function getHospitals(signal: AbortSignal): Promise<HospitalList> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!baseUrl) throw new Error("의료기관 조회 연결을 준비하고 있습니다.");
  if (!hospitalsPath.startsWith("/") || hospitalsPath.startsWith("//")) {
    throw new Error("병원 조회 경로는 /로 시작하는 상대 경로로 설정해 주세요.");
  }

  const url = new URL(`${baseUrl.replace(/\/$/, "")}${hospitalsPath}`);
  // 저장된 분만 가능 기관을 원본 종별 구분 없이 모두 조회합니다.
  const response = await fetch(url, { signal, cache: "no-store" });
  if (!response.ok) throw new Error("의료기관 정보를 불러오지 못했습니다.");

  const body: unknown = await response.json();
  if (
    !isObject(body) ||
    body.success !== true ||
    typeof body.message !== "string" ||
    !Array.isArray(body.data) ||
    !body.data.every(isHospitalVO)
  ) {
    throw new Error("병원 목록이 현재 HospitalVO 형식과 맞지 않습니다.");
  }
  return { items: body.data, total_count: body.data.length };
}
