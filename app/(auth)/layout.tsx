import type { ReactNode } from "react";

// 로그인과 추가 정보 입력 화면에는 공통 헤더를 표시하지 않습니다.
export default function AuthLayout({ children }: { children: ReactNode }) {
    return <main className="mx-auto w-330 min-w-330">{children}</main>;
}
