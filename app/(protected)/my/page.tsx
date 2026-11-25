"use client"

import { logoutApi } from "@/api/auth/auth.api";
import useAuthStore from "@/stores/useAuthStore";
import { ApiResponseDTO } from "@/types/common/common.type";
import { ProfileUpdateRequestDTO } from "@/types/user/user.type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function MyPage() {

    const { user,setUser } = useAuthStore()
    const id = user?.id
    const router = useRouter()


    // 로그아웃
    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSuccess: (datas: ApiResponseDTO) => {
            router.push("/")
        },
        onError: (error: Error) => {}
    })
    const handleLogout = () => {
        logoutMutation.mutate()
    }


    return (
        <>
            <div>
                <button 
                    onClick={handleLogout}
                    type="button" className="flex justify-center items-center w-50 h-10 bg-blue-500 text-white rounded-2xl mt-5 mb-5 cursor-pointer">
                    로그아웃
                </button>
            </div>
        </>
    );
}