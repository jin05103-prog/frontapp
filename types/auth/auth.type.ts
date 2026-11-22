import type { UserProvider, UserType } from "@/enums/user.enum";

// 백엔드 auth_schema.py의 선언과 맞춥니다.
// 이 DTO가 있다고 이메일/비밀번호 로그인 API가 구현된 것은 아닙니다.
export interface LoginRequestDTO {
  user_email: string;
  user_password?: string | null;
  user_provider?: UserProvider | null;
}

// 소셜 인증 후 추가 정보를 제출하는 현재 백엔드 요청 형식입니다.
export interface SocialJoinRequestDTO {
  pending_token: string;
  user_nickname: string;
  user_phone: string;
  user_type: UserType;
}
