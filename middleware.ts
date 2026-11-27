import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const hasRefreshToken = Boolean(request.cookies.get("refresh_token")?.value);
    const { pathname } = request.nextUrl;
    const requiresLogin = pathname === "/my" || pathname.startsWith("/my/")
        || pathname === "/pregnancies" || pathname.startsWith("/pregnancies/")
        || pathname === "/community/new" || /^\/community\/[^/]+\/edit$/.test(pathname);

    // 화면 이동만 제어합니다. 실제 토큰 유효성·데이터 접근 권한은 백엔드에서 검사해야 합니다.
    if (!hasRefreshToken && requiresLogin) {
        // 로그인 후 원래 가려던 페이지로 돌아올 수 있도록 경로를 함께 넘깁니다.
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }
    if (hasRefreshToken && pathname === "/login") {
        // 같은 사이트 안의 경로만 허용합니다. "//evil.com" 같은 외부 주소는 무시합니다.
        const redirect = request.nextUrl.searchParams.get("redirect");
        const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
        return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
}

// (protected)는 URL에 포함되지 않으므로 실제 페이지 주소를 지정합니다.
export const config = {
    matcher: ["/login", "/my/:path*", "/pregnancies/:path*", "/community/new", "/community/:postId/edit"],
};
