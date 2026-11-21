"use client";

import Script from "next/script";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KakaoMap, KakaoOverlay } from "@/types/facilities/kakao-map.type";
import type { MapBounds, MapFacility, MapPosition } from "@/types/facilities/facilities.type";

interface Props {
  center: MapPosition;
  facilities: MapFacility[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onBoundsChange: (bounds: MapBounds) => void;
}

interface FacilityOverlay {
  key: string;
  button: HTMLButtonElement;
  overlay: KakaoOverlay;
}

export default function KakaoHospitalMap({ center, facilities, selectedKey, onSelect, onBoundsChange }: Props) {
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY?.trim();
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<KakaoMap | null>(null);
  const initialCenter = useRef(center);
  const overlays = useRef<FacilityOverlay[]>([]);
  const [sdkReady, setSdkReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!key || initialized) return;
    const timeout = setTimeout(() => setFailed(true), 15000);
    return () => clearTimeout(timeout);
  }, [key, initialized]);

  useEffect(() => {
    if (!sdkReady || !container.current || !window.kakao) return;
    const { maps } = window.kakao;
    let active = true;
    let instance: KakaoMap | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const publishBounds = () => {
      if (!instance || !active) return;
      const bounds = instance.getBounds();
      const southWest = bounds.getSouthWest();
      const northEast = bounds.getNorthEast();
      onBoundsChange({
        south: southWest.getLat(), west: southWest.getLng(),
        north: northEast.getLat(), east: northEast.getLng(),
      });
    };
    const onIdle = () => {
      clearTimeout(timer);
      timer = setTimeout(publishBounds, 400);
    };

    maps.load(() => {
      if (!active || !container.current) return;
      try {
        instance = new maps.Map(container.current, {
          center: new maps.LatLng(initialCenter.current.latitude, initialCenter.current.longitude),
          level: 6,
        });
        map.current = instance;
        instance.addControl(new maps.ZoomControl(), maps.ControlPosition.RIGHT);
        maps.event.addListener(instance, "idle", onIdle);
        setFailed(false);
        setInitialized(true);
        publishBounds();
      } catch {
        setFailed(true);
      }
    });

    return () => {
      active = false;
      clearTimeout(timer);
      if (instance) maps.event.removeListener(instance, "idle", onIdle);
      map.current = null;
    };
  }, [sdkReady, onBoundsChange]);

  useEffect(() => {
    if (!initialized || !map.current || !window.kakao) return;
    map.current.setCenter(new window.kakao.maps.LatLng(center.latitude, center.longitude));
  }, [center, initialized]);

  useEffect(() => {
    if (!initialized || !map.current || !window.kakao) return;
    const { maps } = window.kakao;
    const instances = facilities.map((facility) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "flex size-11 items-center justify-center rounded-full border-[3px] border-white text-base font-bold text-white shadow-md outline-offset-4 outline-primary focus-visible:outline-2";
      // 현재 HospitalVO에는 확정된 분만/응급 분류 필드가 없어 기본 기관 마커를 사용합니다.
      button.classList.add("bg-primary");
      button.textContent = "병";
      button.setAttribute("aria-label", `${facility.name}, 의료기관, 상세 보기`);
      button.title = facility.name;
      button.onclick = () => {
        maps.event.preventMap();
        onSelect(facility.key);
      };
      const overlay = new maps.CustomOverlay({
        position: new maps.LatLng(facility.latitude, facility.longitude),
        content: button,
        xAnchor: 0.5,
        yAnchor: 1,
        clickable: true,
      });
      overlay.setMap(map.current);
      return { key: facility.key, button, overlay };
    });
    overlays.current = instances;
    return () => {
      instances.forEach(({ overlay }) => overlay.setMap(null));
      overlays.current = [];
    };
  }, [facilities, initialized, onSelect]);

  useEffect(() => {
    overlays.current.forEach(({ key: markerKey, button, overlay }) => {
      const selected = markerKey === selectedKey;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("ring-4", selected);
      button.classList.toggle("ring-sub-1", selected);
      overlay.setZIndex(selected ? 100 : 1);
    });
  }, [selectedKey, facilities, initialized]);

  return (
    <div className="relative h-150 overflow-hidden rounded-3xl border border-[#DFE9E7] bg-[#F5F9F8]" role="region" aria-label="분만 가능 병원과 응급실 지도">
      {key && (
        <Script
          id="kakao-hospital-map-sdk"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&autoload=false`}
          strategy="afterInteractive"
          onReady={() => {
            if (window.kakao?.maps) setSdkReady(true);
            else setFailed(true);
          }}
          onError={() => setFailed(true)}
        />
      )}
      <div ref={container} className="h-full w-full" />
      {(!key || !initialized || failed) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#F5F9F8] px-10 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <MapPin size={28} aria-hidden="true" />
          </span>
          <p className="text-xl font-semibold text-[#263C37]">
            {failed ? "지도를 불러오지 못했습니다" : key ? "지도를 불러오고 있습니다" : "지도 연결을 준비하고 있습니다"}
          </p>
          <p className="text-sm text-[#687C76]">
            {failed ? "네트워크 연결을 확인한 후 다시 시도해 주세요." : key ? "잠시만 기다려 주세요." : "지도 연결 후 주변 분만 가능 병원과 응급실을 확인할 수 있습니다."}
          </p>
          {failed && <button type="button" className="rounded-xl border border-[#D8E5E0] bg-white px-5 py-2 text-sm" onClick={() => window.location.reload()}>다시 시도</button>}
        </div>
      )}
    </div>
  );
}
