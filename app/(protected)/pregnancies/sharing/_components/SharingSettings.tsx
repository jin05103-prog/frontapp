"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getSharingSettingsApi,
  updateMaternalSharingApi,
  updateGuardianSharingApi,
} from "@/api/pregnancies/sharing.api";
import { CareRequestApiError } from "@/api/pregnancies/care-request.api";
import type {
  SharingSettings as Settings,
  MaternalSharingSetting,
  GuardianSharingSetting,
} from "@/types/pregnancies/sharing.type";

const button =
  "rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-40";
const panel = "rounded-2xl border border-[#DFE9E5] bg-white p-6";

function MaternalSetting({
  row,
  busy,
  save,
}: {
  row: MaternalSharingSetting;
  busy: boolean;
  save: (symptoms: boolean, guardians: boolean) => void;
}) {
  const [symptoms, setSymptoms] = useState(row.share_symptoms);
  const [guardians, setGuardians] = useState(row.share_guardian_contacts);
  const changed =
    symptoms !== row.share_symptoms ||
    guardians !== row.share_guardian_contacts;
  return (
    <form
      className={panel}
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        save(symptoms, guardians);
      }}
    >
      <h3 className="font-semibold">
        {row.doctor_name} · {row.doctor_hospital}
      </h3>
      <p className="mt-2 text-xs text-[#6D827D]">
        임신 ID {row.pregnancy_id} ·{" "}
        {row.pregnancy_status === "PREBIRTH" ? "현재 임신" : "이전 임신"}
      </p>
      <fieldset disabled={busy} className="mt-5 space-y-4 text-sm">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={symptoms}
            onChange={(e) => setSymptoms(e.target.checked)}
            className="mt-1 size-4 accent-primary"
          />
          <span>
            내 증상 기록 공유
            <span className="mt-1 block text-xs leading-6 text-[#6D827D]">
              이 임신의 과거·이후 컨디션, 증상 종류, 메모를 해당 의료진이 조회할
              수 있습니다.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={guardians}
            onChange={(e) => setGuardians(e.target.checked)}
            className="mt-1 size-4 accent-primary"
          />
          <span>
            보호자 연락처 공유 허용
            <span className="mt-1 block text-xs leading-6 text-[#6D827D]">
              연결이 승인되고 보호자 본인도 연락처 공개에 동의한 경우에만
              이름·회원 연락처가 표시됩니다.
            </span>
          </span>
        </label>
      </fieldset>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs text-[#6D827D]">
          현재 저장 상태 · 증상 {row.share_symptoms ? "공유" : "비공유"} /
          보호자 연락처 {row.share_guardian_contacts ? "허용" : "비허용"}
        </span>
        <button type="submit" disabled={busy || !changed} className={button}>
          이 의료진 설정 저장
        </button>
      </div>
    </form>
  );
}

function GuardianSetting({
  row,
  busy,
  save,
}: {
  row: GuardianSharingSetting;
  busy: boolean;
  save: (value: boolean) => void;
}) {
  const [shared, setShared] = useState(row.share_contact);
  return (
    <form
      className={panel}
      onSubmit={(event) => {
        event.preventDefault();
        save(shared);
      }}
    >
      <h3 className="font-semibold">
        보호자로 연결된 임신 · ID {row.pregnancy_id}
      </h3>
      <label className="mt-5 flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          disabled={busy}
          checked={shared}
          onChange={(e) => setShared(e.target.checked)}
          className="mt-1 size-4 accent-primary"
        />
        <span>
          내 이름과 회원 연락처를 이 임신의 담당 의료진에게 공개하는 데
          동의합니다.
          <span className="mt-1 block text-xs text-[#6D827D]">
            산모가 의료진별 연락처 공유를 허용한 경우에만 공개됩니다. 이 설정은
            보호자의 기록 열람 범위를 바꾸지 않습니다.
          </span>
        </span>
      </label>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs text-[#6D827D]">
          현재 저장 상태 · {row.share_contact ? "공개 동의" : "공개 안 함"}
        </span>
        <button
          type="submit"
          disabled={busy || shared === row.share_contact}
          className={button}
        >
          내 연락처 설정 저장
        </button>
      </div>
    </form>
  );
}

export default function SharingSettings() {
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    revision: number;
    data?: Settings;
    error?: string;
  }>();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    getSharingSettingsApi(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ revision, data });
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        if (cause instanceof CareRequestApiError && cause.status === 401) {
          router.replace("/login?redirect=%2Fpregnancies%2Fsharing");
          return;
        }
        setResult({
          revision,
          error:
            cause instanceof Error
              ? cause.message
              : "공유 설정을 불러오지 못했습니다.",
        });
      });
    return () => controller.abort();
  }, [revision, router]);
  const current = result?.revision === revision ? result : undefined;
  async function save(action: () => Promise<unknown>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(
        "공유 설정을 저장했습니다. 공유 해제는 의료진의 다음 조회부터 적용됩니다.",
      );
      setRevision((v) => v + 1);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "공유 설정을 저장하지 못했습니다.",
      );
      if (cause instanceof CareRequestApiError && cause.status === 409)
        setRevision((v) => v + 1);
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
      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">의료진 정보 공유 설정</h1>
        <button
          type="button"
          disabled={busy}
          onClick={() => setRevision((v) => v + 1)}
          className="rounded-xl border border-[#DFE9E5] px-4 py-3 text-sm disabled:opacity-40"
        >
          최신 상태 확인
        </button>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#6D827D]">
        연결별로 공유할 정보를 선택하고 각각 저장하세요. 기본은 비공유이며, 이전
        임신의 공유도 여기에서 해제할 수 있습니다.
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
          공유 설정을 확인하고 있습니다.
        </p>
      ) : current.error ? (
        <p role="alert" className="mt-8 text-sm text-red-700">
          {current.error}
        </p>
      ) : (
        current.data && (
          <>
            <h2 className="mt-10 mb-5 text-xl font-semibold">
              산모 · 의료진별 공유
            </h2>
            <div className="space-y-5">
              {current.data.maternal.length ? (
                current.data.maternal.map((row) => (
                  <MaternalSetting
                    key={`${row.pregnancy_id}:${row.doctor_id}:${row.version}`}
                    row={row}
                    busy={busy}
                    save={(symptoms, guardians) =>
                      save(() =>
                        updateMaternalSharingApi(
                          row.pregnancy_id,
                          row.doctor_id,
                          {
                            share_symptoms: symptoms,
                            share_guardian_contacts: guardians,
                            expected_version: row.version,
                          },
                        ),
                      )
                    }
                  />
                ))
              ) : (
                <p className={`${panel} text-sm text-[#6D827D]`}>
                  공유를 설정할 승인된 의료진 연결이 없습니다.
                </p>
              )}
            </div>
            <h2 className="mt-10 mb-5 text-xl font-semibold">
              보호자 · 내 연락처 공개
            </h2>
            <div className="space-y-5">
              {current.data.guardian.length ? (
                current.data.guardian.map((row) => (
                  <GuardianSetting
                    key={`${row.pregnancy_id}:${row.version}`}
                    row={row}
                    busy={busy}
                    save={(shared) =>
                      save(() =>
                        updateGuardianSharingApi(row.pregnancy_id, {
                          share_contact: shared,
                          expected_version: row.version,
                        }),
                      )
                    }
                  />
                ))
              ) : (
                <p className={`${panel} text-sm text-[#6D827D]`}>
                  승인이 완료된 보호자 연결이 없습니다.
                </p>
              )}
            </div>
          </>
        )
      )}
    </section>
  );
}
