"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { searchAvailableDoctorsApi } from "@/api/pregnancies/care-request.api";
import type {
  AvailableDoctorDTO,
  MaternalCareRequestDTO,
} from "@/types/pregnancies/care-request.type";

interface Props {
  requests: MaternalCareRequestDTO[];
  disabled: boolean;
  onSelect: (doctor: AvailableDoctorDTO) => void;
}

export default function DoctorSearch({ requests, disabled, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AvailableDoctorDTO[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value || disabled) return;
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const doctors = await searchAvailableDoctorsApi(value, current.signal);
      if (!current.signal.aborted) setResults(doctors);
    } catch (cause) {
      if (!current.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : "의료진 검색에 실패했습니다.",
        );
    } finally {
      if (!current.signal.aborted) setLoading(false);
    }
  }

  return (
    <section
      className="rounded-2xl border border-[#DFE9E5] bg-white p-8"
      aria-labelledby="doctor-search-title"
    >
      <h2
        id="doctor-search-title"
        className="text-xl font-semibold text-[#23443F]"
      >
        병원·의료진 찾기
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#6D827D]">
        방문한 병원 또는 의료진 이름으로 검색해 주세요. 자격 승인이 완료된
        의료진만 표시됩니다.
      </p>
      <form onSubmit={search} className="mt-6 flex gap-3">
        <label className="relative flex-1">
          <span className="sr-only">병원 또는 의료진 이름</span>
          <Search
            size={19}
            aria-hidden="true"
            className="absolute top-3.5 left-4 text-[#7C928B]"
          />
          <input
            value={query}
            maxLength={100}
            onChange={(event) => setQuery(event.target.value)}
            disabled={disabled}
            placeholder="병원 또는 의료진 이름"
            className="h-12 w-full rounded-xl border border-[#D8E5DF] bg-white pr-4 pl-12 outline-none focus:border-primary disabled:bg-[#F4F7F5]"
          />
        </label>
        <button
          type="submit"
          disabled={disabled || loading || !query.trim()}
          className="rounded-xl bg-primary px-6 font-semibold text-white disabled:opacity-40"
        >
          {loading ? "검색 중…" : "검색"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading && (
        <p role="status" className="py-10 text-center text-sm text-[#6D827D]">
          의료진을 검색하고 있습니다.
        </p>
      )}
      {results?.length === 0 && (
        <p className="py-12 text-center text-sm text-[#6D827D]">
          검색 결과가 없습니다. 병원명 또는 의료진 이름을 다시 확인해 주세요.
        </p>
      )}
      {results && results.length > 0 && (
        <>
          <ul className="mt-6 divide-y divide-[#EAF0ED]">
            {results.map((doctor) => {
              const existing = requests.find(
                (request) =>
                  request.doctor_id === doctor.id &&
                  ["PENDING", "APPROVED"].includes(request.status),
              );
              return (
                <li
                  key={doctor.id}
                  className="flex items-center justify-between gap-5 py-5"
                >
                  <div>
                    <p className="font-semibold text-[#23443F]">
                      {doctor.doctor_name} 의료진
                    </p>
                    <p className="mt-2 text-sm text-[#6D827D]">
                      {doctor.doctor_hospital}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={disabled || Boolean(existing)}
                    onClick={() => onSelect(doctor)}
                    className="rounded-xl border border-[#CBE4DC] px-5 py-3 text-sm font-semibold text-[#008F7A] disabled:border-[#E5EAE7] disabled:text-[#83958F]"
                  >
                    {existing?.status === "APPROVED"
                      ? "연결됨"
                      : existing
                        ? "수락 대기"
                        : "연결 요청"}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-xs text-[#7D918A]">
            최대 30명의 검색 결과를 표시합니다. 병원명이나 의료진 이름을
            구체적으로 입력하면 더 쉽게 찾을 수 있어요.
          </p>
        </>
      )}
    </section>
  );
}
