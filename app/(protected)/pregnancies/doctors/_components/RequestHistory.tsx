import type {
  MaternalCareRequestDTO,
  CareRequestStatus,
} from "@/types/pregnancies/care-request.type";

const labels: Record<CareRequestStatus, string> = {
  PENDING: "수락 대기",
  APPROVED: "연결 완료",
  REJECTED: "거절됨",
  CANCELLED: "요청 취소",
  REVOKED: "연결 해제",
};

interface Props {
  requests: MaternalCareRequestDTO[];
  busy: boolean;
  onCancel: (request: MaternalCareRequestDTO) => void;
}

export default function RequestHistory({ requests, busy, onCancel }: Props) {
  return (
    <section
      className="rounded-2xl border border-[#DFE9E5] bg-white p-8"
      aria-labelledby="request-history-title"
    >
      <h2
        id="request-history-title"
        className="text-xl font-semibold text-[#23443F]"
      >
        연결 및 요청 내역
      </h2>
      <p className="mt-3 text-sm text-[#6D827D]">
        현재 선택한 임신의 요청 상태입니다.
      </p>
      {requests.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#6D827D]">
          아직 보낸 연결 요청이 없습니다.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-[#EAF0ED]">
          {requests.map((request) => (
            <li key={request.id} className="py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#23443F]">
                    {request.doctor_name} 의료진
                  </p>
                  <p className="mt-2 text-sm text-[#6D827D]">
                    {request.doctor_hospital}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${request.status === "APPROVED" ? "bg-[#E6F6EF] text-[#008F7A]" : request.status === "PENDING" ? "bg-amber-50 text-amber-800" : "bg-[#F1F4F2] text-[#72877E]"}`}
                >
                  {labels[request.status] ?? "상태 확인 필요"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <time
                  dateTime={request.requested_at}
                  className="text-xs text-[#82958C]"
                >
                  요청일{" "}
                  {new Date(request.requested_at).toLocaleDateString("ko-KR", {
                    timeZone: "Asia/Seoul",
                  })}
                </time>
                {request.status === "PENDING" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onCancel(request)}
                    className="text-xs text-[#6D827D] underline underline-offset-4 disabled:opacity-40"
                  >
                    대기 요청 취소
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
