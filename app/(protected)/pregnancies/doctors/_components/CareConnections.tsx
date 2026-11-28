"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import {
  CareRequestApiError,
  getMaternalCareContextApi,
  createCareRequestApi,
  cancelCareRequestApi,
} from "@/api/pregnancies/care-request.api";
import type {
  AvailableDoctorDTO,
  MaternalCareContextDTO,
  MaternalCareRequestDTO,
} from "@/types/pregnancies/care-request.type";
import DoctorSearch from "./DoctorSearch";
import RequestHistory from "./RequestHistory";

export default function CareConnections() {
  const router = useRouter();
  const [context, setContext] = useState<MaternalCareContextDTO | null>(null);
  const [pregnancyId, setPregnancyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<AvailableDoctorDTO | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const actionLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    getMaternalCareContextApi(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setContext(result);
        setError("");
        setPregnancyId((previous) =>
          result.pregnancies.some((p) => p.id === previous)
            ? previous
            : (result.pregnancies[0]?.id ?? null),
        );
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        if (cause instanceof CareRequestApiError && cause.status === 401) {
          router.replace("/login?redirect=%2Fpregnancies%2Fdoctors");
          return;
        }
        setError(
          cause instanceof Error
            ? cause.message
            : "연결 정보를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [router, revision]);

  const pregnancy = context?.pregnancies.find((p) => p.id === pregnancyId);
  const requests =
    context?.requests.filter((r) => r.pregnancy_id === pregnancyId) ?? [];
  const disabled = busy || loading || Boolean(error);

  function refresh() {
    setLoading(true);
    setRevision((value) => value + 1);
  }
  async function submit() {
    if (!selected || !pregnancy || !confirmed || disabled || actionLock.current)
      return;
    actionLock.current = true;
    setBusy(true);
    setActionError("");
    setNotice("");
    try {
      await createCareRequestApi(pregnancy.id, selected.id);
      setNotice("연결 요청을 보냈습니다. 의료진이 수락하면 연결이 완료됩니다.");
      setSelected(null);
      setConfirmed(false);
      refresh();
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "연결 요청을 보내지 못했습니다.",
      );
      if (cause instanceof CareRequestApiError && cause.status === 409) {
        setSelected(null);
        refresh();
      }
    } finally {
      setBusy(false);
      actionLock.current = false;
    }
  }

  async function cancel(request: MaternalCareRequestDTO) {
    if (disabled || actionLock.current) return;
    actionLock.current = true;
    setBusy(true);
    setActionError("");
    setNotice("");
    try {
      await cancelCareRequestApi(request.pregnancy_id, request.id);
      setNotice("대기 중인 연결 요청을 취소했습니다.");
      refresh();
    } catch (cause) {
      setActionError(
        cause instanceof Error ? cause.message : "요청을 취소하지 못했습니다.",
      );
      refresh();
    } finally {
      setBusy(false);
      actionLock.current = false;
    }
  }

  return (
    <div className="py-12 font-pretendard">
      <Link href="/my" className="text-sm text-[#6D827D] hover:text-primary">
        ← 마이페이지
      </Link>
      <header className="mt-7 mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#23443F]">의료진 연결</h1>
          <p className="mt-4 text-[#6D827D]">
            방문한 병원의 의료진에게 현재 임신의 연결을 요청하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNotice("");
            setActionError("");
            refresh();
          }}
          disabled={disabled && !error}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D8E5DF] px-4 py-3 text-sm text-[#42675B] disabled:opacity-40"
        >
          <RefreshCw size={16} />
          상태 새로고침
        </button>
      </header>
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-red-50 p-5 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {actionError && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-red-50 p-5 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mb-6 rounded-xl bg-[#EBF8F1] p-5 text-sm text-[#087E65]"
        >
          {notice}
        </p>
      )}
      {loading ? (
        <p role="status" className="py-16 text-center text-[#6D827D]">
          본인의 임신과 연결 정보를 확인하고 있습니다.
        </p>
      ) : !error && context?.pregnancies.length === 0 ? (
        <section className="rounded-2xl border border-[#DFE9E5] p-12 text-center">
          <h2 className="text-xl font-semibold text-[#23443F]">
            연결을 요청할 임신 정보가 없습니다
          </h2>
          <p className="mt-4 leading-7 text-[#6D827D]">
            본인 명의로 등록한 진행 중인 임신에서 요청할 수 있습니다.
            <br />
            보호자는 산모를 대신해 의료진 연결을 요청할 수 없습니다.
          </p>
        </section>
      ) : (
        pregnancy && (
          <>
            <section className="mb-7 flex items-center justify-between gap-6 rounded-2xl bg-[#EFF9F4] p-6">
              <div>
                <h2 className="font-semibold text-[#23443F]">연결할 임신</h2>
                <p className="mt-2 text-sm text-[#6D827D]">
                  임신마다 별도로 의료진과 연결합니다.
                </p>
              </div>
              <label>
                <span className="sr-only">연결할 임신 선택</span>
                <select
                  value={pregnancy.id}
                  disabled={disabled}
                  onChange={(event) => {
                    setPregnancyId(Number(event.target.value));
                    setSelected(null);
                    setConfirmed(false);
                    setActionError("");
                    setNotice("");
                  }}
                  className="min-w-72 rounded-xl border border-[#D8E5DF] bg-white px-4 py-3 text-sm"
                >
                  {context?.pregnancies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.baby_names.join(", ") || "태명 미등록"} · 임신 ID{" "}
                      {p.id}
                    </option>
                  ))}
                </select>
              </label>
            </section>
            <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-6">
              <div className="space-y-6">
                <DoctorSearch
                  requests={requests}
                  disabled={disabled}
                  onSelect={(doctor) => {
                    setSelected(doctor);
                    setConfirmed(false);
                    setActionError("");
                    setNotice("");
                  }}
                />
                {selected && (
                  <section
                    className="rounded-2xl border border-[#B6DCCE] bg-[#F7FCF9] p-8"
                    aria-labelledby="confirm-request-title"
                  >
                    <h2
                      id="confirm-request-title"
                      className="text-xl font-semibold text-[#23443F]"
                    >
                      연결 요청 확인
                    </h2>
                    <p className="mt-4 font-semibold">
                      {selected.doctor_hospital} · {selected.doctor_name} 의료진
                    </p>
                    <p className="mt-3 text-sm text-[#6D827D]">
                      {pregnancy.baby_names.join(", ") || "태명 미등록"} · 임신
                      ID {pregnancy.id}
                    </p>
                    <label className="mt-6 flex items-start gap-3 text-sm leading-6 text-[#42675B]">
                      <input
                        type="checkbox"
                        checked={confirmed}
                        disabled={disabled}
                        onChange={(event) => setConfirmed(event.target.checked)}
                        className="mt-1 size-4 accent-[#00B79C]"
                      />
                      방문한 병원의 의료진인지 확인했으며, 선택한 임신의 연결을
                      요청합니다.
                    </label>
                    <p className="mt-4 text-xs leading-6 text-[#6D827D]">
                      요청을 보내면 의료진에게 산모 이름과 임신 ID가 표시됩니다.
                      의료진이 수락한 뒤 담당 목록에 추가됩니다.
                    </p>
                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={submit}
                        disabled={!confirmed || disabled}
                        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
                      >
                        {busy ? "요청 중…" : "요청 보내기"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setSelected(null)}
                        className="rounded-xl border border-[#D8E5DF] px-5 py-3 text-sm"
                      >
                        닫기
                      </button>
                    </div>
                  </section>
                )}
              </div>
              <RequestHistory
                requests={requests}
                busy={disabled}
                onCancel={cancel}
              />
            </div>
          </>
        )
      )}
    </div>
  );
}
