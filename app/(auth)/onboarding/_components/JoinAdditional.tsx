"use client"

import { JoinAdditionalRequestDTO } from "@/types/user/user.type";
import { useFormContext } from "react-hook-form";

// 추가정보 입력란 (폼 상태는 JoinContainer의 FormProvider에서 공유)
export default function JoinAdditional() {

    const {
        register,
        formState: { errors }
    } = useFormContext<JoinAdditionalRequestDTO>()

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (
        <>
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
        </>
    );
}
