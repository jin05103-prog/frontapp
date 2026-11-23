"use client"

import { joinAdditionalApi } from "@/api/user/user.api";
import { ApiResponseDTO } from "@/types/common/common.type";
import { JoinAdditionalRequestDTO } from "@/types/user/user.type";
import { SocialJoinRequestDTO } from "@/types/auth/auth.type";
import { UserType } from "@/enums/user.enum";
import { useMutation } from "@tanstack/react-query";
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
            user_type: UserType.GENERAL,
            // 필수 약관 동의 여부 (동의 일시/버전은 백엔드가 기록)
            agree_terms: joinDto.agreeTerms,
            agree_health_data: joinDto.agreeHealthData,
        }
        joinMutation.mutate(payload)
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2 m-4"
            >
                <JoinAdditional />
                <JoinAgreement />

                {!pendingToken && (
                    <p className="text-red-500 text-[12px]">
                        잘못된 접근이거나 입력 시간이 만료되었습니다. 다시 로그인해 주세요.
                    </p>
                )}
                {joinMutation.isError && (
                    <p className="text-red-500 text-[12px]">{joinMutation.error.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !pendingToken || !allAgreed}
                    className="w-50 h-10 bg-purple-500 text-white rounded-2xl mt-5 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                >{isSubmitting ? "제출 중" : "회원가입"}</button>
            </form>
        </FormProvider>
    );
}
