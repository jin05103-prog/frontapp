"use client";

import Link from "next/link";
import { ChevronRight, LocateFixed, Phone, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHospitals, isHospitalApiConfigured } from "@/api/facilities/facilities.api";
import { GANGNAM_STATION, getDevicePosition, getVisibleFacilities } from "@/lib/facilities";
import type { MapBounds, MapPosition } from "@/types/facilities/facilities.type";
import KakaoHospitalMap from "./KakaoHospitalMap";
import FacilityDetails from "./FacilityDetails";

const controlClass = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE8E2] bg-white px-4 py-2.5 text-sm font-medium text-[#486257] hover:bg-[#F5F9F7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-50";

export default function FacilitiesPage() {
  const [center, setCenter] = useState<MapPosition>(GANGNAM_STATION);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [locationState, setLocationState] = useState<"pending" | "device" | "fallback">("pending");
  const hospitalApiConfigured = isHospitalApiConfigured();

  useEffect(() => {
    let active = true;
    getDevicePosition().then((position) => {
      if (!active) return;
      setCenter({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      setLocationState("device");
    }).catch(() => {
      if (active) setLocationState("fallback");
    });
    return () => { active = false; };
  }, []);

  const updateBounds = useCallback((next: MapBounds) => {
    const rounded: MapBounds = {
      south: Number(next.south.toFixed(5)),
      west: Number(next.west.toFixed(5)),
      north: Number(next.north.toFixed(5)),
      east: Number(next.east.toFixed(5)),
    };
    setBounds((previous) => previous && previous.south === rounded.south && previous.west === rounded.west && previous.north === rounded.north && previous.east === rounded.east ? previous : rounded);
  }, []);

  // 현재 HospitalVO 형식의 병원 목록을 조회합니다.
  const hospitals = useQuery({
    queryKey: ["facilities", "hospitals"],
    queryFn: ({ signal }) => getHospitals(signal),
    enabled: hospitalApiConfigured,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  // 지도 이동은 이미 받은 병원 목록에서 범위를 다시 거르는 방식입니다.
  const facilities = useMemo(() => bounds ? getVisibleFacilities(hospitals.data?.items ?? [], bounds) : [], [hospitals.data, bounds]);
  const selected = facilities.find((facility) => facility.key === selectedKey) ?? null;
  const fetching = hospitals.isFetching;
  const canRefresh = hospitalApiConfigured && !fetching;
  // 정수 좌표가 들어오면 소수점을 임의로 복원하지 않고 정확도 확인 안내를 표시합니다.
  const hasIntegerCoordinates = hospitals.data?.items.some((hospital) => (
    Number.isInteger(hospital.hospital_latitude) && Number.isInteger(hospital.hospital_longitude)
  )) ?? false;

  async function locate() {
    setLocationState("pending");
    try {
      const position = await getDevicePosition();
      setCenter({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      setLocationState("device");
    } catch {
      setCenter({ ...GANGNAM_STATION });
      setLocationState("fallback");
    }
  }

  return (
    <div className="pb-24 pt-10 font-pretendard text-[#2F443B]">
      <nav aria-label="현재 위치" className="flex items-center gap-3 text-sm text-[#7C8B84]">
        <Link href="/" className="hover:text-primary">홈</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">인근 의료기관</span>
      </nav>
      <div className="mb-6 mt-8 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#263D32]">인근 의료기관</h1>
          <p className="mt-2 text-sm text-[#7C8B84]">주변 의료기관의 위치와 정보를 지도에서 확인하세요.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className={controlClass} onClick={locate} disabled={locationState === "pending"}>
            <LocateFixed size={17} aria-hidden="true" />내 위치
          </button>
          <button type="button" className={controlClass} disabled={!canRefresh} onClick={() => { void hospitals.refetch(); }}>
            <RefreshCw size={16} className={fetching ? "animate-spin motion-reduce:animate-none" : ""} aria-hidden="true" />목록 새로고침
          </button>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#FFF3F0] px-6 py-4 text-sm">
        <p className="flex items-center gap-3 font-semibold text-[#BA4438]"><Phone size={17} aria-hidden="true" />응급 상황에는 119 에 연락하세요.</p>
        <p className="text-[#7A7972]">방문 전 의료기관에 수용 가능 여부를 확인해 주세요.</p>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6" aria-label="지도 표시 안내">
          <span className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white" aria-hidden="true">병</span>의료기관</span>
          <span className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-sub-2 font-bold text-white" aria-hidden="true">+</span>응급실 현황 연결 준비 중</span>
        </div>
        <p className="text-xs text-[#7C8B84]" role="status">
          {locationState === "pending" ? "현재 위치 확인 중 · 강남역 기준으로 표시합니다" : locationState === "fallback" ? "현재 위치를 확인하지 못해 강남역 기준으로 표시합니다" : "현재 위치를 확인했습니다"}
        </p>
      </div>

      <KakaoHospitalMap center={center} facilities={facilities} selectedKey={selectedKey} onSelect={setSelectedKey} onBoundsChange={updateBounds} />

      <div className="mb-6 mt-4 space-y-2 text-sm text-[#7C8B84]" aria-live="polite">
        {!hospitalApiConfigured ? <p>의료기관 조회 연결을 준비하고 있습니다.</p> : (
          <>
            {hospitals.isPending && <p>의료기관 목록을 불러오고 있습니다.</p>}
            {hospitals.data && <p>현재 지도 범위 {facilities.length}곳 · 불러온 의료기관 {hospitals.data.items.length}곳</p>}
            {hospitals.isError && <p role="alert">{hospitals.data ? "목록 갱신에 실패해 이전 정보를 표시합니다." : "의료기관 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}</p>}
            {hospitals.data && hospitals.data.total_count > hospitals.data.items.length && <p>전체 {hospitals.data.total_count}곳 중 {hospitals.data.items.length}곳의 목록을 받았습니다.</p>}
            {hospitals.isSuccess && bounds && facilities.length === 0 && <p>현재 불러온 목록에 이 지도 범위의 의료기관이 없습니다.</p>}
          </>
        )}
        {hasIntegerCoordinates && <p role="status">의료기관 좌표가 정수로 제공되어 정확한 위치 확인이 필요합니다.</p>}
      </div>
      <FacilityDetails facility={selected} />
    </div>
  );
}
