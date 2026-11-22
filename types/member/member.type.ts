import type { SocialJoinRequestDTO } from "@/types/auth/auth.type";
import type { UserResponseDTO } from "@/types/user/user.type";

// 기존 member 이름을 쓰는 코드가 백엔드 UserResponseDTO를 그대로 사용하도록 연결합니다.
export type MemberDTO = UserResponseDTO;
export type JoinAdditionalRequestDTO = SocialJoinRequestDTO;

// 기존 프로필 업로드 함수의 프론트 입력값입니다. File은 FormData로 보냅니다.
// 대응하는 회원 프로필 변경 API는 백엔드 구현 후 연결해야 합니다.
export interface ProfileUpdateRequestDTO {
  id: number;
  file: File;
}
