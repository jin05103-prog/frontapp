import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const hasRefreshToken = Boolean(request.cookies.get("refresh_token")?.value);
    const { pathname } = request.nextUrl;
    const requiresLogin = pathname === "/my" || pathname.startsWith("/my/")
        || pathname === "/pregnancies" || pathname.startsWith("/pregnancies/")
        || pathname === "/community/new";

    // 화면 이동만 제어합니다. 실제 토큰 유효성·데이터 접근 권한은 백엔드에서 검사해야 합니다.
    if (!hasRefreshToken && requiresLogin) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (hasRefreshToken && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

// (protected)는 URL에 포함되지 않으므로 실제 페이지 주소를 지정합니다.
export const config = {
    matcher: ["/login", "/my/:path*", "/pregnancies/:path*", "/community/new"],
};
