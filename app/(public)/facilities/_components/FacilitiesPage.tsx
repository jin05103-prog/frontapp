"use client";

import Link from "next/link";
import { ChevronRight, MapPin, Phone } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHospitals,
  isHospitalApiConfigured,
} from "@/api/facilities/facilities.api";
import {
  GANGNAM_STATION,
  getDevicePosition,
  getVisibleFacilities,
} from "@/lib/facilities";
import type {
  MapBounds,
  MapPosition,
} from "@/types/facilities/facilities.type";
import KakaoHospitalMap from "./KakaoHospitalMap";
import FacilityDetails from "./FacilityDetails";

export default function FacilitiesPage() {
  const [center, setCenter] = useState<MapPosition>(GANGNAM_STATION);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [locationState, setLocationState] = useState<
    "pending" | "device" | "fallback"
  >("pending");
  const hospitalApiConfigured = isHospitalApiConfigured();

  useEffect(() => {
    let active = true;
    getDevicePosition()
      .then((position) => {
        if (!active) return;
        setCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationState("device");
      })
      .catch(() => {
        if (active) setLocationState("fallback");
      });
    return () => {
      active = false;
    };
  }, []);

  const updateBounds = useCallback((next: MapBounds) => {
    const rounded: MapBounds = {
      south: Number(next.south.toFixed(5)),
      west: Number(next.west.toFixed(5)),
      north: Number(next.north.toFixed(5)),
      east: Number(next.east.toFixed(5)),
    };
    setBounds((previous) =>
      previous &&
      previous.south === rounded.south &&
      previous.west === rounded.west &&
      previous.north === rounded.north &&
      previous.east === rounded.east
        ? previous
        : rounded,
    );
  }, []);

  // 원본 종별을 가진 분만 가능 의료기관 전체를 조회합니다. 자동 주기 갱신은 하지 않습니다.
  const hospitals = useQuery({
    queryKey: ["facilities", "hospitals", "institution-kinds"],
    queryFn: ({ signal }) => getHospitals(signal),
    enabled: hospitalApiConfigured,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const facilities = useMemo(
    () =>
      bounds ? getVisibleFacilities(hospitals.data?.items ?? [], bounds) : [],
    [hospitals.data, bounds],
  );
  const selected =
    facilities.find((facility) => facility.key === selectedKey) ?? null;

  async function locate() {
    setLocationState("pending");
    try {
      const position = await getDevicePosition();
      setCenter({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLocationState("device");
    } catch {
      setCenter({ ...GANGNAM_STATION });
      setLocationState("fallback");
    }
  }

  return (
    <div className="pb-24 pt-10 font-pretendard text-[#2F443B]">
      <nav
        aria-label="현재 위치"
        className="flex items-center gap-3 text-sm text-[#7C8B84]"
      >
        <Link href="/" className="hover:text-primary">
          홈
        </Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">인근 의료기관</span>
      </nav>
      <div className="mb-6 mt-8 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-[#263D32]">
            인근 의료기관
          </h1>
          <p className="mt-2 text-sm text-[#7C8B84]">
            주변 분만 가능 의료기관의 위치와 정보를 확인하세요.
          </p>
        </div>
      </div>
      <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#FFF3F0] px-6 py-4 text-sm">
        <p className="flex items-center gap-3 font-semibold text-[#BA4438]">
          <Phone size={17} aria-hidden="true" />
          응급 상황에는 119에 연락하세요.
        </p>
        <p className="text-[#7A7972]">
          방문 전 기관에 진료 시간과 분만 가능 여부를 확인해 주세요.
        </p>
      </div>
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <MapPin size={19} className="text-primary" aria-hidden="true" />
          분만 가능 의료기관
        </span>
        <p className="text-xs text-[#7C8B84]" role="status">
          {locationState === "pending"
            ? "현재 위치 확인 중 · 강남역 기준으로 표시합니다"
            : locationState === "fallback"
              ? "현재 위치를 확인하지 못해 강남역 기준으로 표시합니다"
              : "현재 위치를 확인했습니다"}
        </p>
      </div>
      <KakaoHospitalMap
        center={center}
        facilities={facilities}
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        onBoundsChange={updateBounds}
        onLocate={locate}
        isLocating={locationState === "pending"}
      />
      <div className="mt-4 space-y-2 text-sm text-[#7C8B84]" aria-live="polite">
        {!hospitalApiConfigured ? (
          <p>의료기관 조회 연결을 준비하고 있습니다.</p>
        ) : (
          <>
            {hospitals.isPending && <p>의료기관 목록을 불러오고 있습니다.</p>}
            {hospitals.isError && (
              <p role="alert">
                {hospitals.data
                  ? "정보 갱신에 실패해 이전 정보를 표시합니다."
                  : "의료기관 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}
              </p>
            )}
            {hospitals.isSuccess && bounds && facilities.length === 0 && (
              <p>
                주변에 등록된 의료기관이 없습니다. 지도를 이동해 확인해 주세요.
              </p>
            )}
          </>
        )}
      </div>
      <div className="mt-6">
        <FacilityDetails facility={selected} />
      </div>
    </div>
  );
}
