import type { UserProvider, UserType } from "@/enums/user.enum";

// 백엔드 UserResponseDTO입니다. datetime은 JSON에서 문자열로 전달됩니다.
export interface UserResponseDTO {
  id: number;
  user_provider: UserProvider;
  user_provider_id: string;
  user_nickname: string;
  user_phone: string;
  user_status: boolean;
  user_created_at: string;
  user_type: UserType;
}
