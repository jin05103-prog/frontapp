"use client"

import { JoinAdditionalRequestDTO } from "@/types/user/user.type";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

const checkboxClass = "size-6 shrink-0 cursor-pointer rounded-md accent-primary"

// 약관 동의란 (폼 상태는 JoinContainer의 FormProvider에서 공유)
export default function JoinAgreement() {

    const { register } = useFormContext<JoinAdditionalRequestDTO>()

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-[#f8f9fa] px-5 py-5">
            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 text-[17px] tracking-[-0.3px] text-[#111]">
                    <input
                        type="checkbox"
                        className={checkboxClass}
                        {...register("agreeHealthData", { required: true })}
                    />
                    <span><b className="font-bold text-primary">[필수]</b> 건강 정보 제3자 제공 동의</span>
                </label>
                <Link href="#" className="text-[17px] text-[#8a8a8a] underline hover:text-[#333]">보기</Link>
            </div>
            <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3 text-[17px] tracking-[-0.3px] text-[#111]">
                    <input
                        type="checkbox"
                        className={checkboxClass}
                        {...register("agreeTerms", { required: true })}
                    />
                    <span><b className="font-bold text-primary">[필수]</b> 서비스 약관 동의</span>
                </label>
                <Link href="#" className="text-[17px] text-[#8a8a8a] underline hover:text-[#333]">보기</Link>
            </div>
        </div>
    );
}
