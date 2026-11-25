"use client"

import { JoinAdditionalRequestDTO } from "@/types/user/user.type";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const inputClass =
    "h-15 w-full rounded-xl border border-[#e3e5e8] bg-white px-5 text-[17px] tracking-[-0.3px] text-[#111] outline-none placeholder:text-[#a0a3a8] focus:border-primary"
const labelClass = "mb-2.5 flex items-center gap-1 text-[17px] font-bold tracking-[-0.3px] text-[#111]"
const hintClass = "mt-2 text-[16px] tracking-[-0.3px] text-[#8a8a8a]"
const errorClass = "mt-2 text-[14px] tracking-[-0.3px] text-red-500"

const Required = () => <span className="text-primary">*</span>

// 추가정보 입력란 (폼 상태는 JoinContainer의 FormProvider에서 공유)
export default function JoinAdditional() {

    const {
        register,
        trigger,
        getFieldState,
        setValue,
        formState: { errors }
    } = useFormContext<JoinAdditionalRequestDTO>()

    const [nicknameChecked, setNicknameChecked] = useState(false)

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;

    // 닉네임 형식 확인 (중복 확인 전용 API가 없어 형식만 검사하고, 중복은 가입 시 서버가 검사한다)
    const onCheckNickname = async () => {
        const valid = await trigger("userNickname")
        setNicknameChecked(valid && !getFieldState("userNickname").invalid)
    }

    return (
        <div className="flex flex-col gap-7">
            {/* 이메일 (소셜 로그인 계정 이메일, 변경 불가) */}
            <div>
                <label className={labelClass} htmlFor="userEmail">이메일</label>
                <div className="relative">
                    <input
                        id="userEmail"
                        type="text"
                        className="h-15 w-full cursor-not-allowed rounded-xl border border-[#e3e5e8] bg-[#f4f5f7] px-5 pr-32 text-[17px] tracking-[-0.3px] text-[#8a8a8a] outline-none"
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
                    <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 rounded-full bg-[#e8eaed] px-3 py-1.5 text-[15px] font-medium text-[#777]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4V7Z" />
                        </svg>
                        변경 불가
                    </span>
                </div>
                {errors?.userEmail?.type === "required" && (
                    <p className={errorClass}>이메일을 입력하세요.</p>
                )}
                {errors?.userEmail?.type === "pattern" && (
                    <p className={errorClass}>이메일 양식에 맞게 입력해주세요.</p>
                )}
                {!errors?.userEmail && (
                    <p className={hintClass}>소셜 로그인 계정의 이메일은 변경할 수 없어요.</p>
                )}
            </div>

            {/* 이름 */}
            <div>
                <label className={labelClass} htmlFor="userName">이름 <Required /></label>
                <input
                    id="userName"
                    type="text"
                    className={inputClass}
                    placeholder="이름을 입력해 주세요"
                    {...register("userName", {
                        required: true,
                    })}
                />
                {errors?.userName?.type === "required" && (
                    <p className={errorClass}>이름을 입력하세요.</p>
                )}
            </div>

            {/* 닉네임 */}
            <div>
                <label className={labelClass} htmlFor="userNickname">닉네임 <Required /></label>
                <div className="flex gap-2.5">
                    <input
                        id="userNickname"
                        type="text"
                        className={inputClass}
                        placeholder="커뮤니티에서 사용할 닉네임"
                        {...register("userNickname", {
                            required: true,
                            pattern: nicknameRegex,
                            onChange: () => setNicknameChecked(false),
                        })}
                    />
                    <button
                        type="button"
                        onClick={onCheckNickname}
                        className="h-15 shrink-0 cursor-pointer rounded-xl border border-primary bg-white px-6 text-[17px] font-bold tracking-[-0.3px] text-primary hover:bg-primary/5"
                    >
                        중복 확인
                    </button>
                </div>
                {errors?.userNickname ? (
                    <p className={errorClass}>
                        {errors.userNickname.type === "required"
                            ? "닉네임을 입력하세요."
                            : "2~10자의 한글, 영문, 숫자만 사용할 수 있어요."}
                    </p>
                ) : nicknameChecked ? (
                    <p className="mt-2 text-[14px] tracking-[-0.3px] text-primary">
                        사용할 수 있는 형식이에요. 중복 여부는 가입 시 확인돼요.
                    </p>
                ) : (
                    <p className={hintClass}>2~10자의 한글, 영문, 숫자만 사용할 수 있어요.</p>
                )}
            </div>

            {/* 전화번호 */}
            <div>
                <label className={labelClass} htmlFor="userPhone">전화번호 <Required /></label>
                <input
                    id="userPhone"
                    type="text"
                    inputMode="numeric"
                    className={inputClass}
                    placeholder="010-1234-5678"
                    {...register("userPhone", {
                        required: true,
                        // 숫자 이외의 문자는 입력 즉시 제거
                        onChange: (e) => setValue("userPhone", e.target.value.replace(/\D/g, ""), { shouldValidate: true }),
                    })}
                />
                {errors?.userPhone?.type === "required" ? (
                    <p className={errorClass}>휴대폰 번호를 입력하세요.</p>
                ) : (
                    <p className={hintClass}>숫자만 입력해 주세요.</p>
                )}
            </div>
        </div>
    );
}
