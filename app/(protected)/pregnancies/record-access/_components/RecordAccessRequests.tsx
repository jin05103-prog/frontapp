"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRecordAccessRequestsApi,
  decideRecordAccessApi,
  revokeRecordAccessApi,
} from "@/api/pregnancies/record-access.api";
import { CareRequestApiError } from "@/api/pregnancies/care-request.api";
import type {
  ClinicalAccessRequests,
  ClinicalAccessRequest,
} from "@/types/pregnancies/record-access.type";

const labels = {
  PENDING: "확인 대기",
  APPROVED: "열람 허용 중",
  REJECTED: "반려",
  CANCELLED: "요청 취소",
  REVOKED: "승인 철회",
  EXPIRED: "기간 만료",
};
const date = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
const primary =
  "rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-40";
const secondary =
  "rounded-xl border border-[#DFE9E5] px-4 py-3 text-sm disabled:opacity-40";

export default function RecordAccessRequests() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const key = `${page}:${revision}`;
  const [result, setResult] = useState<{
    key: string;
    data?: ClinicalAccessRequests;
    error?: string;
  }>();
  const [selected, setSelected] = useState<number>();
  const [revoke, setRevoke] = useState<number>();
  const [duration, setDuration] = useState<1 | 7 | 30>(1);
  const [confirmed, setConfirmed] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const lock = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    getRecordAccessRequestsApi(page, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key, data });
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        if (cause instanceof CareRequestApiError && cause.status === 401) {
          router.replace("/login?redirect=%2Fpregnancies%2Frecord-access");
          return;
        }
        setResult({
          key,
          error:
            cause instanceof Error
              ? cause.message
              : "요청을 조회하지 못했습니다.",
        });
      });
    return () => controller.abort();
  }, [page, key, router]);
  const current = result?.key === key ? result : undefined;
  function refresh() {
    setSelected(undefined);
    setRevoke(undefined);
    setConfirmed(false);
    setRevision((v) => v + 1);
  }
  async function act(
    row: ClinicalAccessRequest,
    decision: "APPROVED" | "REJECTED" | "REVOKED",
  ) {
    if (lock.current || (decision === "APPROVED" && !confirmed)) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (decision === "REVOKED")
        await revokeRecordAccessApi(row.pregnancy_id, row.id);
      else
        await decideRecordAccessApi(
          row.pregnancy_id,
          row.id,
          decision,
          duration,
          note.trim(),
        );
      setNotice(
        decision === "APPROVED"
          ? "선택한 기간 동안 검진 기록 열람을 허용했습니다."
          : decision === "REVOKED"
            ? "열람 승인을 철회했습니다. 의료진의 다음 조회부터 차단됩니다."
            : "열람 요청을 반려했습니다.",
      );
      refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "처리하지 못했습니다.");
      if (cause instanceof CareRequestApiError && cause.status === 409)
        refresh();
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 font-pretendard text-[#23443F]">
      <Link href="/my" className="text-sm text-[#6D827D]">
        ← 마이페이지
      </Link>
      <div className="mt-6 flex items-center justify-between gap-5">
        <h1 className="text-3xl font-bold">검진 기록 열람 승인</h1>
        <button
          type="button"
          disabled={busy}
          onClick={refresh}
          className={secondary}
        >
          최신 상태 확인
        </button>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#6D827D]">
        다른 의료진이 보낸 열람 목적을 확인하고 허용 기간을 선택하세요. 승인은
        해당 임신에만 적용되며 담당 의료진 연결은 바뀌지 않습니다.
      </p>
      {notice && (
        <p role="status" className="mt-6 rounded-xl bg-[#EFF9F5] p-4 text-sm">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {error}
        </p>
      )}
      {!current ? (
        <p role="status" className="py-16 text-center text-sm text-[#6D827D]">
          열람 요청을 확인하고 있습니다.
        </p>
      ) : current.error ? (
        <p role="alert" className="mt-8 text-sm text-red-700">
          {current.error}
        </p>
      ) : !current.data?.requests.length ? (
        <p className="mt-8 rounded-2xl border border-[#DFE9E5] p-10 text-center text-sm text-[#6D827D]">
          검진 기록 열람 요청이 없습니다.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {current.data.requests.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-[#DFE9E5] bg-white p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {row.doctor_name} · {row.doctor_hospital}
                  </h2>
                  <p className="mt-2 text-xs text-[#6D827D]">
                    임신 ID {row.pregnancy_id} · 요청 #{row.id} ·{" "}
                    {date(row.requested_at)}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-[#EFF6F3] px-3 py-2 text-sm">
                  {labels[row.status]}
                </span>
              </div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7">
                열람 목적 · {row.purpose}
              </p>
              <p className="mt-4 rounded-xl bg-[#F7FAF9] p-4 text-xs leading-7 text-[#6D827D]">
                범위: 이 임신에 저장된 모든 병원·의료진의 검진 입력값, 검사
                결과, 정정 이력, 예측 결과와 의료진 소견. 허용 기간에 추가된
                기록도 포함합니다. 증상 일지·보호자 연락처·방문 일정은 이 승인에
                포함되지 않습니다.
              </p>
              {row.expires_at && (
                <p className="mt-4 text-sm">
                  열람 기한 · {date(row.expires_at)}
                </p>
              )}
              {row.last_access_at && (
                <p className="mt-2 text-xs text-[#6D827D]">
                  최근 기록 조회 · {date(row.last_access_at)}
                </p>
              )}
              {row.decision_note && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-[#6D827D]">
                  내가 남긴 내용 · {row.decision_note}
                </p>
              )}
              {row.status === "PENDING" &&
                (selected !== row.id ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setSelected(row.id);
                      setDuration(1);
                      setConfirmed(false);
                      setNote("");
                      setError("");
                    }}
                    className={`${primary} mt-5`}
                  >
                    열람 요청 확인하기
                  </button>
                ) : (
                  <div className="mt-5 border-t border-[#DFE9E5] pt-5">
                    <fieldset disabled={busy} className="space-y-4">
                      <label className="block text-sm">
                        허용 기간
                        <select
                          value={duration}
                          onChange={(e) =>
                            setDuration(Number(e.target.value) as 1 | 7 | 30)
                          }
                          className="ml-4 rounded-xl border border-[#DFE9E5] px-4 py-3"
                        >
                          <option value={1}>승인 시점부터 1일</option>
                          <option value={7}>승인 시점부터 7일</option>
                          <option value={30}>승인 시점부터 30일</option>
                        </select>
                      </label>
                      <label className="block text-sm">
                        의료진에게 남길 내용
                        <textarea
                          rows={3}
                          maxLength={1000}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="mt-2 w-full rounded-xl border border-[#DFE9E5] p-3 outline-none focus:border-primary"
                        />
                      </label>
                      <label className="flex items-start gap-3 text-sm leading-6">
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          className="mt-1 size-4 accent-primary"
                        />
                        요청 의료진에게 위 범위의 검진 기록을 선택한 기간 동안
                        읽기 전용으로 공개하는 데 동의합니다.
                      </label>
                    </fieldset>
                    <div className="mt-5 flex justify-end gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setSelected(undefined)}
                        className={secondary}
                      >
                        닫기
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => act(row, "REJECTED")}
                        className="rounded-xl bg-red-50 px-5 py-3 text-sm text-red-700 disabled:opacity-40"
                      >
                        열람 요청 반려
                      </button>
                      <button
                        type="button"
                        disabled={
                          busy ||
                          !confirmed ||
                          row.scope_version !== "CLINICAL_RECORDS_V1"
                        }
                        onClick={() => act(row, "APPROVED")}
                        className={primary}
                      >
                        {busy ? "처리 중" : "선택한 기간 열람 허용"}
                      </button>
                    </div>
                  </div>
                ))}
              {row.status === "APPROVED" &&
                (revoke !== row.id ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setRevoke(row.id)}
                    className={`${secondary} mt-5`}
                  >
                    열람 승인 철회
                  </button>
                ) : (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl bg-red-50 p-4 text-sm"
                  >
                    <p>
                      이 의료진의 검진 기록 열람 승인을 철회할까요? 기존 검진
                      기록은 삭제되지 않습니다.
                    </p>
                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setRevoke(undefined)}
                        className={secondary}
                      >
                        유지
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => act(row, "REVOKED")}
                        className="rounded-xl bg-red-100 px-5 py-3 font-semibold text-red-700 disabled:opacity-40"
                      >
                        열람 승인 철회 확정
                      </button>
                    </div>
                  </div>
                ))}
            </li>
          ))}
        </ul>
      )}
      {current?.data &&
        (current.data.total > current.data.page_size || page > 1) && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={busy || page === 1}
              onClick={() => {
                setPage((p) => p - 1);
                setSelected(undefined);
                setRevoke(undefined);
              }}
              className={secondary}
            >
              이전
            </button>
            <span className="text-sm">
              {page} /{" "}
              {Math.max(
                1,
                Math.ceil(current.data.total / current.data.page_size),
              )}
            </span>
            <button
              type="button"
              disabled={
                busy || page * current.data.page_size >= current.data.total
              }
              onClick={() => {
                setPage((p) => p + 1);
                setSelected(undefined);
                setRevoke(undefined);
              }}
              className={secondary}
            >
              다음
            </button>
          </div>
        )}
    </section>
  );
}
