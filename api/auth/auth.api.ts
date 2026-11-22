import type { LoginRequestDTO } from "@/types/auth/auth.type";
import type { ApiResponseDTO } from "@/types/common/common.type";

// TODO: 현재 백엔드의 로그인은 GET /auth/social/{user_provider} 리다이렉트 방식입니다.
// 아래 /auth/login과 /auth/logout은 아직 미구현인 기존 함수입니다.
// 로그인 함수
export const loginApi = async (
  loginRequestDTO: LoginRequestDTO,
): Promise<ApiResponseDTO> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 주고 받을 때 옵션 허용
      body: JSON.stringify(loginRequestDTO),
    },
  );

  if (!response.ok)
    throw new Error(
      "로그인 요청에 실패했습니다. 백엔드 로그인 경로를 확인해 주세요.",
    );
  const datas: ApiResponseDTO = await response.json();
  return datas;
};

// 로그아웃 함수
export const logoutApi = async (): Promise<ApiResponseDTO> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "로그아웃 요청에 실패했습니다. 백엔드 로그아웃 경로를 확인해 주세요.",
    );
  }
  const datas: ApiResponseDTO = await response.json();
  return datas;
};
