"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getClosureRequestsApi,
  decideClosureApi,
} from "@/api/pregnancies/closure.api";
import { CareRequestApiError } from "@/api/pregnancies/care-request.api";
import type { PregnancyClosureRequest } from "@/types/pregnancies/closure.type";

const labels = {
  CONSIDERING: "확인 대기",
  ACCEPT: "종료 확정",
  REJECT: "반려",
  CANCELLED: "의료진 요청 취소",
};
const outcomes = {
  FULLTERM: "만삭 출산",
  PREMATUREBIRTH: "조산",
  ABORTION: "유산",
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
const button =
  "rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-40";

export default function ClosureRequests() {
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    revision: number;
    data?: { requests: PregnancyClosureRequest[]; limit: number };
    error?: string;
  }>();
  const [selected, setSelected] = useState<number>();
  const [confirmed, setConfirmed] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const lock = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    getClosureRequestsApi(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ revision, data });
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        if (cause instanceof CareRequestApiError && cause.status === 401) {
          router.replace("/login?redirect=%2Fpregnancies%2Fclosure-requests");
          return;
        }
        setResult({
          revision,
          error:
            cause instanceof Error
              ? cause.message
              : "요청을 불러오지 못했습니다.",
        });
      });
    return () => controller.abort();
  }, [revision, router]);
  const current = result?.revision === revision ? result : undefined;
  function refresh() {
    setSelected(undefined);
    setConfirmed(false);
    setNote("");
    setRevision((v) => v + 1);
  }
  async function decide(
    request: PregnancyClosureRequest,
    decision: "ACCEPT" | "REJECT",
  ) {
    if (lock.current || (decision === "ACCEPT" && !confirmed)) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await decideClosureApi(
        request.pregnancy_id,
        request.id,
        decision,
        note.trim(),
      );
      setNotice(
        decision === "ACCEPT"
          ? "임신 종료가 확정되었습니다. 기존 기록은 보관됩니다."
          : "종료 요청을 반려했습니다. 임신 상태는 변경되지 않았습니다.",
      );
      refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "요청을 처리하지 못했습니다.",
      );
      if (cause instanceof CareRequestApiError && cause.status === 409)
        refresh();
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 font-pretendard text-[#23443F]">
      <Link href="/my" className="text-sm text-[#6D827D]">
        ← 마이페이지
      </Link>
      <div className="mt-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">임신 종료 요청 확인</h1>
        <button
          type="button"
          disabled={busy}
          onClick={refresh}
          className="rounded-xl border border-[#DFE9E5] px-4 py-3 text-sm disabled:opacity-40"
        >
          최신 상태 확인
        </button>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#6D827D]">
        의료진이 보낸 종료 종류와 날짜를 확인하세요. 수락하면 이 임신 전체가
        종료되고 의료진 화면에서는 이전 임신으로 이동합니다. 내용이 다르면 반려
        후 의료진에게 수정을 요청해 주세요.
      </p>
      {notice && (
        <p role="status" className="mt-6 rounded-xl bg-[#EFF9F5] p-4 text-sm">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 text-sm text-red-700">
          {error}
        </p>
      )}
      {!current ? (
        <p role="status" className="py-16 text-center text-[#6D827D]">
          종료 요청을 불러오고 있습니다.
        </p>
      ) : current.error ? (
        <p role="alert" className="mt-8 text-sm text-red-700">
          {current.error}
        </p>
      ) : !current.data?.requests.length ? (
        <p className="mt-8 rounded-2xl border border-[#DFE9E5] p-10 text-center text-[#6D827D]">
          확인할 종료 요청이 없습니다.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {current.data.requests.map((request) => (
            <li
              key={request.id}
              className="rounded-2xl border border-[#DFE9E5] bg-white p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    {request.doctor_name} · {request.doctor_hospital}
                  </h2>
                  <p className="mt-2 text-xs text-[#6D827D]">
                    임신 ID {request.pregnancy_id} · 요청 #{request.id} ·{" "}
                    {date(request.requested_at)}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-[#EFF6F3] px-3 py-2 text-sm">
                  {labels[request.status]}
                </span>
              </div>
              <ul className="mt-5 divide-y divide-[#DFE9E5] rounded-xl bg-[#F7FAF9] px-4">
                {request.items.map((item) => (
                  <li
                    key={item.fetus_id}
                    className="flex flex-wrap justify-between gap-3 py-4 text-sm"
                  >
                    <span>{item.fetus_name}</span>
                    <span>
                      {outcomes[item.outcome]} ·{" "}
                      {item.ended_on.replaceAll("-", ".")}
                    </span>
                  </li>
                ))}
              </ul>
              {request.note && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#6D827D]">
                  의료진 전달 내용 · {request.note}
                </p>
              )}
              {request.decision_note && (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#6D827D]">
                  내가 남긴 내용 · {request.decision_note}
                </p>
              )}
              {request.reviewed_at && (
                <p className="mt-3 text-xs text-[#6D827D]">
                  처리 시각 · {date(request.reviewed_at)}
                </p>
              )}
              {request.status === "CONSIDERING" &&
                (selected !== request.id ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setSelected(request.id);
                      setConfirmed(false);
                      setNote("");
                      setError("");
                    }}
                    className={`${button} mt-5`}
                  >
                    종료 내용 확인하기
                  </button>
                ) : (
                  <div className="mt-5 border-t border-[#DFE9E5] pt-5">
                    <label className="block text-sm">
                      의료진에게 남길 내용
                      <textarea
                        disabled={busy}
                        rows={3}
                        maxLength={1000}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-[#DFE9E5] p-3 outline-none focus:border-primary"
                      />
                    </label>
                    <label className="mt-4 flex items-start gap-3 text-sm leading-6">
                      <input
                        type="checkbox"
                        disabled={busy}
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="mt-1 size-4 accent-primary"
                      />
                      모든 태아의 종료 종류와 날짜를 확인했으며, 이 임신 전체를
                      종료하는 데 동의합니다.
                    </label>
                    <p className="mt-3 text-xs leading-6 text-[#6D827D]">
                      수락 후에는 이 화면에서 되돌릴 수 없습니다. 검진 기록은
                      보관되며 예정된 방문 일정은 자동으로 취소되지 않습니다.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setSelected(undefined)}
                        className="px-4 py-3 text-sm"
                      >
                        닫기
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => decide(request, "REJECT")}
                        className="rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-40"
                      >
                        종료 요청 반려
                      </button>
                      <button
                        type="button"
                        disabled={busy || !confirmed}
                        onClick={() => decide(request, "ACCEPT")}
                        className={button}
                      >
                        {busy ? "처리 중" : "수락하고 임신 종료"}
                      </button>
                    </div>
                  </div>
                ))}
            </li>
          ))}
        </ul>
      )}
      {current?.data && (
        <p className="mt-6 text-xs text-[#6D827D]">
          확인 대기 요청을 먼저 표시하며 최근 {current.data.limit}건까지
          조회합니다.
        </p>
      )}
    </main>
  );
}
