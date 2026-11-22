import type { ApiResponseDTO } from "@/types/common/common.type";
import { FileFolder } from "@/enums/file.enum";
import type {
  JoinAdditionalRequestDTO,
  ProfileUpdateRequestDTO,
} from "@/types/member/member.type";

export const joinAdditionalApi = async (
  joinDto: JoinAdditionalRequestDTO,
): Promise<ApiResponseDTO> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/social/join`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(joinDto),
    },
  );

  if (!response.ok) throw new Error("추가 정보 등록에 실패했습니다.");
  const datas: ApiResponseDTO = await response.json();
  return datas;
};

// TODO: /members/{id}/profile은 현재 백엔드에 미구현입니다. 경로 확정 후 연결합니다.
export const updateProfileApi = async (
  fileDto: ProfileUpdateRequestDTO,
): Promise<ApiResponseDTO> => {
  const formData = new FormData();
  formData.append("file", fileDto.file);
  formData.append("folder", FileFolder.PROFILE);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/members/${fileDto.id}/profile`,
    {
      method: "PUT",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("프로필 변경에 실패하였습니다.");
  }

  const result = await response.json();
  return result;
};
