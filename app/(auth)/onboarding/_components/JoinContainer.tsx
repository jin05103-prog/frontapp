"use client"

import { joinAdditionalApi } from "@/api/user/user.api";
import { ApiResponseDTO } from "@/types/common/common.type";
import { JoinAdditionalRequestDTO } from "@/types/user/user.type";
import { SocialJoinRequestDTO } from "@/types/auth/auth.type";
import { UserType } from "@/enums/user.enum";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import JoinAdditional from "./JoinAdditional";
import JoinAgreement from "./JoinAgreement";

// 회원가입 컨테이너: 폼 상태/제출을 관리하고 추가정보 입력란과 약관 동의란을 합친다
export default function JoinContainer() {

    const searchParams = useSearchParams()
    const router = useRouter()

    const userEmail = searchParams.get("user_email") || "";
    const userProvider = searchParams.get("user_provider") || "";
    const userProviderId = searchParams.get("user_provider_id") || "";
    // 백엔드 콜백이 발급한 임시 키 (10분 유효, 1회 사용)
    const pendingToken = searchParams.get("pending_token") || "";

    const methods = useForm<JoinAdditionalRequestDTO>({
        mode: "onChange",
        defaultValues: {
            userEmail: userEmail,
            userProvider: userProvider,
            userProviderId: userProviderId,
            userPhone: "",
            userName: "",
            userNickname: "",
            agreeTerms: false,
            agreeHealthData: false,
        }
    })

    const {
        handleSubmit, watch,
        formState: { isSubmitting }
    } = methods

    // 필수 약관을 모두 체크했을 때만 가입 가능
    const allAgreed = watch("agreeTerms") && watch("agreeHealthData")

    const joinMutation = useMutation({
        mutationFn: joinAdditionalApi,
        onSuccess: (datas: ApiResponseDTO) => {
            alert("회원가입 완료. 다시 로그인 해주세요")
            router.push("/")
            // refresh: location 기록을 삭제
            router.refresh()
        },
        onError: (error: Error) => {
            console.error(error.message)
        }
    })

    const onSubmit = async (joinDto: JoinAdditionalRequestDTO) => {
        if (!pendingToken || !joinDto.agreeTerms || !joinDto.agreeHealthData) return

        // 백엔드 SocialJoinRequestDTO 형식(snake_case)으로 변환
        // 이메일과 제공자는 보내지 않는다 (백엔드가 pending_token으로 찾음)
        // 회원 유형은 입력받지 않고 일반 회원(GENERAL)으로 고정한다
        const payload: SocialJoinRequestDTO = {
            pending_token: pendingToken,
            user_name: joinDto.userName,
            user_nickname: joinDto.userNickname,
            user_phone: joinDto.userPhone,
            // 필수 약관 동의 여부 (동의 일시/버전은 백엔드가 기록)
            agree_terms: joinDto.agreeTerms,
            agree_health_data: joinDto.agreeHealthData,
        }
        joinMutation.mutate(payload)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-[#f1f1f1] p-6">
            <section className="flex w-183.25 max-w-full flex-col items-center rounded-[40px] bg-white px-22 pt-14 pb-12">
                {/* 로고 */}
                <div className="flex h-12.5 items-center gap-2.5" aria-label="NESTEP">
                    <Image
                        src="/icons/nestep_main_icon.png"
                        alt=""
                        width={146}
                        height={141}
                        className="h-12.5 w-auto"
                        priority
                    />
                    <span className="font-nanum-square-round text-[38px] leading-none font-extrabold tracking-[-0.5px] text-primary">
                        NESTEP
                    </span>
                </div>

                {/* 타이틀 */}
                <span className="mt-10 rounded-full bg-primary/10 px-4 py-1.5 text-[16px] font-bold tracking-[-0.3px] text-primary">
                    마지막 단계
                </span>
                <h1 className="mt-4 text-[32px] leading-10 font-extrabold tracking-[-0.8px] text-[#111]">
                    추가 정보를 입력해 주세요
                </h1>
                <p className="mt-4 text-center text-[18px] leading-7 tracking-[-0.4px] text-[#444]">
                    처음 오셨네요!
                    <br />
                    NESTEP을 시작하기 전에 몇 가지만 알려주세요.
                </p>

                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-11 flex w-full flex-col gap-9"
                    >
                        <JoinAdditional />
                        <JoinAgreement />

                        <div className="flex flex-col gap-3">
                            {!pendingToken && (
                                <p className="text-center text-[14px] text-red-500">
                                    잘못된 접근이거나 입력 시간이 만료되었습니다. 다시 로그인해 주세요.
                                </p>
                            )}
                            {joinMutation.isError && (
                                <p className="text-center text-[14px] text-red-500">{joinMutation.error.message}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || !pendingToken || !allAgreed}
                                className="h-16 w-full cursor-pointer rounded-full bg-primary text-[22px] font-bold tracking-[-0.4px] text-white shadow-[0_8px_20px_rgba(0,203,168,0.25)] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-[#cfd3d6] disabled:shadow-none"
                            >{isSubmitting ? "제출 중" : "NESTEP 시작하기"}</button>
                        </div>
                    </form>
                </FormProvider>

                {/* 하단 링크 */}
                <div className="mt-8 flex gap-4.5 text-base tracking-[-0.4px]">
                    <Link href="#" className="text-[#8a8a8a] hover:text-[#333]">
                        이용약관
                    </Link>
                    <Link href="#" className="font-bold text-[#555] hover:text-[#333]">
                        개인정보처리방침
                    </Link>
                </div>
            </section>
        </div>
    );
}
