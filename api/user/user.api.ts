import type { ApiResponseDTO } from "@/types/common/common.type";
import { FileFolder } from "@/enums/file.enum";
import type { SocialJoinRequestDTO } from "@/types/auth/auth.type";
import type { ProfileUpdateRequestDTO } from "@/types/user/user.type";

export interface User {
    id:       number;
    name:     string;
    username: string;
    email:    string;
    address:  Address;
    phone:    string;
    website:  string;
    company:  Company;
}

export interface Address {
    street:  string;
    suite:   string;
    city:    string;
    zipcode: string;
    geo:     Geo;
}

export interface Geo {
    lat: string;
    lng: string;
}

export interface Company {
    name:        string;
    catchPhrase: string;
    bs:          string;
}

export const getUsers = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    if(!response.ok){
        throw new Error("getUsers fetching failed")
    }
    const users = await response.json()
    return users
}

export const getUser = async (id: string) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    if(!response.ok){
        throw new Error("getUser fetching failed")
    }
    const user = await response.json()
    return user
}


export const joinAdditionalApi = async (
  joinDto: SocialJoinRequestDTO,
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

  if (!response.ok) {
    // 백엔드 HTTPException의 detail 메시지를 그대로 보여준다 (예: 409 중복, 400 만료)
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "추가 정보 등록에 실패했습니다.");
  }
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
