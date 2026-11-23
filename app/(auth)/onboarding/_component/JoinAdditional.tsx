"use client"

import { joinAdditionalApi } from "@/api/user/user.api";
import { ApiResponseDTO } from "@/types/common/common.type";
import { JoinAdditionalRequestDTO } from "@/types/user/user.type";
import { SocialJoinRequestDTO } from "@/types/auth/auth.type";
import { UserType } from "@/enums/user.enum";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

// 회원가입
export default function JoinAdditional() {

    const searchParams = useSearchParams()
    const router = useRouter()

    const userEmail = searchParams.get("user_email") || "";
    const userProvider = searchParams.get("user_provider") || "";
    const userProviderId = searchParams.get("user_provider_id") || "";
    // 백엔드 콜백이 발급한 임시 키 (10분 유효, 1회 사용)
    const pendingToken = searchParams.get("pending_token") || "";

    const {
        register, handleSubmit, getValues,
        formState: {
            isSubmitting, isSubmitted, errors
        }
    } = useForm<JoinAdditionalRequestDTO>({
        mode: "onChange",
        defaultValues: {
            userEmail: userEmail,
            userProvider: userProvider,
            userProviderId: userProviderId,
            userPhone: "",
            userName: "",
            userNickname: "",
        }
    })

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
        if (!pendingToken) return

        // 백엔드 SocialJoinRequestDTO 형식(snake_case)으로 변환
        // 이메일과 제공자는 보내지 않는다 (백엔드가 pending_token으로 찾음)
        // 회원 유형은 입력받지 않고 일반 회원(GENERAL)으로 고정한다
        const payload: SocialJoinRequestDTO = {
            pending_token: pendingToken,
            user_name: joinDto.userName,
            user_nickname: joinDto.userNickname,
            user_phone: joinDto.userPhone,
            user_type: UserType.GENERAL,
        }
        joinMutation.mutate(payload)
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 m-4"
        >
            <label className="flex flex-col">
                <p
                    className="text-[24px] font-semibold"
                >이메일</p>
                <input 
                    type="text"
                    className="border rounded-lg w-50 p-2 bg-gray-300 text-gray-500"
                    placeholder="이메일을 입력하세요."
                    readOnly
                    {...register("userEmail", {
                        required: true, 
                        pattern: {
                            value: emailRegex,
                            message: "이메일 양식에 맞게 입력해주세요."
                        }
                    })}
                />
                {errors?.userEmail?.type === "required" && (
                    <p className="text-red-500 text-[12px]">이메일을 입력하세요.</p>
                )}
                {errors?.userEmail?.type === "pattern" && (
                    <p className="text-red-500 text-[12px]">이메일 양식에 맞게 입력해주세요.</p>
                )}
            </label>

            <label className="flex flex-col">
                <p
                    className="text-[24px] font-semibold"
                >휴대폰 번호</p>
                <input 
                    type="text"
                    className="border rounded-lg w-50 p-2"
                    placeholder="01012341234"
                    {...register("userPhone", {
                        required: true, 
                    })}
                />
                {errors?.userPhone?.type === "required" && (
                    <p className="text-red-500 text-[12px]">휴대폰 번호를 입력하세요.</p>
                )}
            </label>
            <label className="flex flex-col">
                <p
                    className="text-[24px] font-semibold"
                >이름</p>
                <input 
                    type="text"
                    className="border rounded-lg w-50 p-2"
                    placeholder="이름을 입력하세요."
                    {...register("userName", {
                        required: true, 
                    })}
                />
            </label>
            <label className="flex flex-col">
                <p
                    className="text-[24px] font-semibold"
                >닉네임</p>
                <input 
                    type="text"
                    className="border rounded-lg w-50 p-2"
                    placeholder="닉네임을 입력하세요."
                    {...register("userNickname", {
                        required: true, 
                    })}
                />
            </label>

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
                disabled={isSubmitting || !pendingToken}
                className="w-50 h-10 bg-purple-500 text-white rounded-2xl mt-5 cursor-pointer"
            >{isSubmitting ? "제출 중" : "회원가입"}</button>
        </form>
    );
}