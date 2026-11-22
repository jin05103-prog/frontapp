import type {
  HospitalVO,
  MapBounds,
  MapFacility,
} from "@/types/facilities/facilities.type";

// 현재 위치를 확인하지 못했을 때 사용할 기본 중심 좌표입니다.
export const GANGNAM_STATION = { latitude: 37.49795, longitude: 127.02762 };

// 백엔드 필드명은 그대로 유지하고, 지도에서 쓰는 짧은 이름으로 화면 데이터를 만듭니다.
export function toMapFacility(hospital: HospitalVO): MapFacility {
  return {
    // 현재 VO에는 hpid가 없으므로 DB 기본키만 기관 식별자로 사용합니다.
    key: `hospital:${hospital.id}`,
    name: hospital.hospital_name,
    address: hospital.hospital_address,
    latitude: hospital.hospital_latitude,
    longitude: hospital.hospital_longitude,
    // 상세 화면에서 종별·전화번호·야간 여부를 읽을 수 있게 원본 VO를 보관합니다.
    hospital,
  };
}

// 지도 이동 때마다 새 API를 추정해 호출하지 않고, 받은 목록에서 현재 영역의 기관을 찾습니다.
export function getVisibleFacilities(
  hospitals: HospitalVO[],
  bounds: MapBounds,
): MapFacility[] {
  return hospitals
    .filter(
      (hospital) =>
        hospital.hospital_latitude >= bounds.south &&
        hospital.hospital_latitude <= bounds.north &&
        hospital.hospital_longitude >= bounds.west &&
        hospital.hospital_longitude <= bounds.east,
    )
    .map(toMapFacility);
}

// 브라우저의 콜백 방식 위치 API를 await로 사용할 수 있도록 Promise로 감쌉니다.
export function getDevicePosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    // 브라우저가 위치 기능을 지원하지 않으면 화면에서 강남역으로 대체할 수 있게 실패를 전달합니다.
    if (!navigator.geolocation) {
      reject(new Error("위치 확인을 지원하지 않습니다."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      // 고정밀 측정을 강제하지 않습니다.
      enableHighAccuracy: false,
      // 최대 8초 동안 위치 확인을 기다립니다.
      timeout: 8000,
      // 최대 1분 전 위치를 재사용할 수 있습니다.
      maximumAge: 60000,
    });
  });
}
