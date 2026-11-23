import { LoginRequestDTO } from "@/type/auth/auth.type"
import { ApiResponseDTO } from "@/type/common/common.type"

// 로그인 함수 
export const loginApi = async (loginRequestDTD: LoginRequestDTO): Promise<ApiResponseDTO> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include", // 쿠키를 주고 받을 때 옵션 허용
        body: JSON.stringify(loginRequestDTD)
    })

    if (!response.ok) {
        const err = await response.json().catch(() => null)
        throw new Error(err?.message ? JSON.stringify(err.message) : `요청 실패 (${response.status})`)
    }
    const datas = await response.json()
    return datas
}

// 로그아웃 함수
export const logoutApi = async (): Promise<ApiResponseDTO> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("logoutApi fetching Error")
    }
    const datas: ApiResponseDTO = await response.json();
    return datas
}