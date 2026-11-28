"use client"

import { logoutApi } from "@/api/auth/auth.api";
import useAuthStore from "@/stores/useAuthStore";
import { ApiResponseDTO } from "@/types/common/common.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function MyPage() {

    const router = useRouter()
    const queryClient = useQueryClient()


    // 로그아웃
    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSuccess: async (datas: ApiResponseDTO) => {
            if (!datas.success) return
            // 서버에서 쿠키를 정리한 뒤 화면의 로그인 정보와 회원 데이터 캐시도 비웁니다.
            await queryClient.cancelQueries()
            useAuthStore.getState().setSession(null)
            queryClient.clear()
            router.replace("/")
            router.refresh()
        },
    })
    const handleLogout = () => {
        logoutMutation.mutate()
    }


    return (
        <>
            <section className="mt-10 rounded-2xl border border-[#DFE9E5] p-7 font-pretendard">
                <h1 className="text-xl font-semibold text-[#23443F]">의료진 연결</h1>
                <p className="mt-3 text-sm text-[#6D827D]">방문한 병원의 의료진에게 연결을 요청하고 처리 상태를 확인하세요.</p>
                <Link href="/pregnancies/doctors" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">의료진 연결 관리 →</Link>
                <Link href="/pregnancies/closure-requests" className="mt-5 ml-3 inline-flex rounded-xl border border-[#DFE9E5] px-5 py-3 text-sm font-semibold text-[#23443F]">임신 종료 요청 확인 →</Link>
                <Link href="/pregnancies/sharing" className="mt-5 ml-3 inline-flex rounded-xl border border-[#DFE9E5] px-5 py-3 text-sm font-semibold text-[#23443F]">의료진 정보 공유 설정 →</Link>
                <Link href="/pregnancies/record-access" className="mt-5 ml-3 inline-flex rounded-xl border border-[#DFE9E5] px-5 py-3 text-sm font-semibold text-[#23443F]">검진 기록 열람 승인 →</Link>
            </section>
            <div>
                <button 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    type="button" className="flex justify-center items-center w-50 h-10 bg-blue-500 text-white rounded-2xl mt-5 mb-5 cursor-pointer">
                    로그아웃
                </button>
                {(logoutMutation.isError || logoutMutation.data?.success === false) && (
                    <p role="alert" className="text-sm text-red-600">로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
                )}
            </div>
        </>
    );
}
