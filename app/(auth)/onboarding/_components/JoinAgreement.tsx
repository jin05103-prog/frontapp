"use client"

import { JoinAdditionalRequestDTO } from "@/types/user/user.type";
import { useFormContext } from "react-hook-form";

// 약관 동의란 (폼 상태는 JoinContainer의 FormProvider에서 공유)
export default function JoinAgreement() {

    const { register, watch, setValue } = useFormContext<JoinAdditionalRequestDTO>()

    const agreeTerms = watch("agreeTerms")
    const agreeHealthData = watch("agreeHealthData")
    const allAgreed = agreeTerms && agreeHealthData

    // 전체 동의: 개별 항목을 한꺼번에 변경
    const onToggleAll = (checked: boolean) => {
        setValue("agreeTerms", checked, { shouldValidate: true })
        setValue("agreeHealthData", checked, { shouldValidate: true })
    }

    return (
        <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 font-semibold">
                <input
                    type="checkbox"
                    checked={allAgreed}
                    onChange={(e) => onToggleAll(e.target.checked)}
                />
                전체 동의
            </label>
            <label className="flex items-center gap-2 text-[14px]">
                <input
                    type="checkbox"
                    {...register("agreeTerms", { required: true })}
                />
                (필수) 서비스 이용약관에 동의합니다.
            </label>
            <label className="flex items-center gap-2 text-[14px]">
                <input
                    type="checkbox"
                    {...register("agreeHealthData", { required: true })}
                />
                (필수) 건강정보 처리에 동의합니다.
            </label>
        </div>
    );
}
