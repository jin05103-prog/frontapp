import { ExternalLink, MapPin, Phone } from "lucide-react";
import type { MapFacility } from "@/types/facilities/facilities.type";

export default function FacilityDetails({ facility }: { facility: MapFacility | null }) {
  if (!facility) {
    return (
      <section className="flex min-h-44 items-center justify-center gap-3 rounded-3xl border border-[#DFE9E7] bg-white text-[#6E817B]" aria-live="polite">
        <MapPin size={22} aria-hidden="true" />
        <p>지도에서 의료기관을 선택하면 상세 정보가 표시됩니다.</p>
      </section>
    );
  }

  // 백엔드 HospitalVO 필드명을 그대로 읽습니다.
  const hospital = facility.hospital;
  const phone = hospital.hospital_phone;
  const directions = `https://map.kakao.com/link/to/${encodeURIComponent(facility.name)},${facility.latitude},${facility.longitude}`;

  return (
    <section className="rounded-3xl border border-[#DFE9E7] bg-white p-8" aria-live="polite" aria-label="선택한 의료기관 정보">
      <div className="flex items-start justify-between gap-6">
        <div>
          <span className="mb-3 inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-[#007D68]">
            {hospital.hospital_registration_file_key || "의료기관"}
          </span>
          <h2 className="text-2xl font-bold text-[#24362F]">{hospital.hospital_name}</h2>
          <p className="mt-2 text-[#687C76]">{hospital.hospital_address}</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-[#526A62]">
            <Phone size={16} aria-hidden="true" />
            {phone ? <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="underline-offset-4 hover:underline">{phone}</a> : "전화번호 정보 없음"}
          </div>
        </div>
        <a href={directions} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#DBE8E2] px-5 py-3 text-sm font-medium text-[#405E52] hover:bg-[#F5F9F7]">
          카카오맵 길찾기 <ExternalLink size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6 border-t border-[#E5EDE9] pt-6">
        <div>
          <h3 className="font-semibold text-[#30493F]">의료기관 정보</h3>
          <dl className="mt-3 grid grid-cols-[100px_1fr] gap-y-2 text-sm">
            <dt className="text-[#7B8B85]">종별</dt>
            <dd>{hospital.hospital_registration_file_key || "정보 없음"}</dd>
            <dt className="text-[#7B8B85]">야간 운영</dt>
            <dd>{hospital.hospital_night_service ? "야간 운영" : "야간 운영 표시 없음"}</dd>
          </dl>
          <p className="mt-4 text-xs text-[#7B8B85]">방문 전 기관에 진료 시간과 분만 가능 여부를 확인해 주세요.</p>
        </div>
        <div>
          <h3 className="font-semibold text-[#30493F]">응급실 현황</h3>
          <p className="mt-3 text-sm text-[#7B8B85]">실시간 가용 병상 정보는 연결 준비 중입니다.</p>
        </div>
      </div>
    </section>
  );
}
