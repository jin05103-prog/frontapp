// 원본 CSV의 종별과 백엔드 HospitalTypeEnum.value를 그대로 사용합니다.
export const HOSPITAL_TYPES = [
  "상급종합병원",
  "종합병원",
  "병원",
  "의원",
  "조산원",
] as const;
export type HospitalType = (typeof HOSPITAL_TYPES)[number];

// 백엔드 src/app/schema/hospital_schema.py의 HospitalVO와 필드명을 맞춥니다.
export interface HospitalVO {
  // 병원 DB의 기본키입니다. Python int는 JSON에서 숫자로 전달됩니다.
  id: number;
  // 백엔드 float 좌표를 소수점까지 그대로 전달받습니다.
  hospital_latitude: number;
  hospital_longitude: number;
  // 백엔드 HospitalTypeEnum의 값과 동일하게 사용합니다.
  hospital_type: HospitalType;
  // 기관명입니다.
  hospital_name: string;
  // 주소입니다.
  hospital_address: string;
  // 현재 VO는 null을 허용하지 않습니다.
  hospital_phone: string;
  // 현재 VO는 true 또는 false만 받습니다.
  hospital_night_service: boolean;
}

// API에서 검사한 데이터를 화면에 전달할 때 사용하는 프론트 내부 타입입니다.
export interface HospitalList {
  items: HospitalVO[];
  total_count: number;
}

// 지도 SDK에 전달할 좌표입니다. 백엔드 VO와 화면용 좌표를 구분합니다.
export interface MapPosition {
  latitude: number;
  longitude: number;
}

// 현재 지도에 보이는 사각 영역입니다. 받은 병원 목록을 이 범위로 걸러냅니다.
export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

// 지도와 상세 카드에서만 쓰는 타입입니다. hospital에 원본 VO를 보관합니다.
export interface MapFacility extends MapPosition {
  key: string;
  name: string;
  address: string;
  hospital: HospitalVO;
}
