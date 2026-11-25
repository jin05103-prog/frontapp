# NEXTJS_ARCHITECTURE

> 참고 프로젝트는 **App Router**만 사용한다. `pages/` 디렉터리는 없다 (`git ls-files` 확인).
> Next.js 버전은 **16.4.3**이며, 실제 설치된 문서(`node_modules/next/dist/docs/`)를 기준으로 기능을 확인했다.

---

## 1. 라우팅 방식

- **App Router**: `app/` 아래 폴더 구조가 URL이 된다. `page.tsx`가 있는 폴더만 라우트가 된다.
- **라우트 그룹 `(이름)`**: URL에 나타나지 않는 묶음 폴더. 실제 경로는 `app/(auth)/login/page.tsx` → `/login`.
- **프라이빗 폴더 `_component/`**: 언더스코어로 시작하는 폴더는 라우트가 되지 않는다. 페이지 전용 컴포넌트를 둔다.
- **동적 세그먼트 `[id]`**: `app/(reactquery)/react-query-04/[id]/page.tsx` → `/react-query-04/{id}`.
- **병렬 라우트 슬롯 `@modal`**: `app/layout.tsx`가 `modal` prop으로 받는다.

### 1-1. 실제 라우트 목록 (분류)

| 분류 | URL 예 | 렌더링 위치 |
|---|---|---|
| 홈 | `/` | `app/page.tsx` (서버) |
| 인증 | `/login`, `/join`, `/join-additional` | `app/(auth)/…` |
| 마이페이지 | `/my-page` | `app/(protexted)/my-page/` (미들웨어 보호) |
| 모달 | `/modal/login`, `/modal/login/search-email` | `app/(modal)/…`, `app/@modal/…` |
| 학습 예제 | `/props/props-01`, `/zustand01`, `/react-query-01`, … | 각 라우트 그룹 |

---

## 2. 특수 파일 사용 현황

| 파일 | 사용 여부 | 비고 |
|---|---|---|
| `app/layout.tsx` | **있음 (1개)** | 루트 레이아웃. 메타데이터, 폰트, Provider, 모달 슬롯 |
| `app/page.tsx` | 있음 | 홈 |
| `page.tsx` | **있음 (46개)** | 서버 35개, `"use client"` 11개 |
| `app/@modal/default.tsx` | 있음 | 모달 슬롯 기본값 (`null`) |
| `loading.tsx` | **없음** | 로딩은 `components/common/Loading.tsx`를 페이지 안에서 직접 렌더링 |
| `error.tsx` | **없음** | 에러는 `components/common/ErrorComponent.tsx`를 직접 렌더링 |
| `not-found.tsx` | 없음 | |
| `template.tsx` | 없음 | |
| `route.ts` (Route Handler) | **없음** | 백엔드는 별도 서버. 프론트에 API 라우트가 없다 |
| `"use server"` (Server Action) | **없음** | 폼 제출은 React Query `mutation`으로 처리 |
| `middleware.ts` | 있음 | 루트에 위치. Next 16에서 `proxy.ts`로 이름 변경 대상 (아래 5장) |
| `generateMetadata`, `generateStaticParams` | 없음 | 메타데이터는 `layout.tsx`의 정적 `metadata`만 사용 |

---

## 3. 루트 레이아웃

```tsx
// app/layout.tsx (발췌)
import { Metadata } from "next";
import "./globals.css";
import "@/style/tailwind/tailwind.theme.css"
import { pretendard } from "@/style/font/font";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/provider/ReactQueryProvider";
import AuthHydration from "@/components/auth/AuthHydration";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: "Jiho Project",
    description: "Next 16"
}

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
    return (
        <html lang="en" className={cn(pretendard.variable, "font-sans", geist.variable)}>
            <body className="font-pretendard">
                <ReactQueryProvider>
                    <AuthHydration />
                    {children}
                    {modal}
                </ReactQueryProvider>
            </body>
        </html>
    );
}
```

- 레이아웃의 역할 세 가지: **전역 CSS·폰트 로드**, **클라이언트 Provider 감싸기**, **앱 진입 시 인증 복원**.
- `LayoutProps<"/">`는 Next가 `.next/dev/types/routes.d.ts`에 라우트별로 생성하는 전역 타입이다 (`next dev` 실행 시 만들어짐). `children`과 병렬 슬롯(`modal`)을 함께 받는다.
- **주의**: `<html lang="en">`인데 화면 문구는 한국어다. 새 프로젝트에서는 `lang="ko"`가 맞다.
- **주의**: 메타데이터 `title`이 "Jiho Project", `description`이 "Next 16"으로 학습용 값이 그대로 남아 있다.

---

## 4. 서버 컴포넌트와 클라이언트 컴포넌트

### 4-1. 구분 기준 (실제 사용 방식)

| 구분 | 어디에 쓰나 | 실제 예 |
|---|---|---|
| **서버 컴포넌트** (기본) | `page.tsx` 래퍼, `layout.tsx`, 정적 파일 | `app/(auth)/login/page.tsx` → `<Login />` 하나만 렌더링 |
| **클라이언트 컴포넌트** (`"use client"`) | 훅 사용(`useState`, `useEffect`, `useForm`, `useQuery`, `useRouter`), 이벤트 핸들러, 브라우저 API, Zustand | `Login.tsx`, `MyPageContainer.tsx`, `ReactQueryProvider.tsx` |

- 규칙: **`"use client"`는 훅이나 이벤트가 필요한 가장 아래 파일에만 붙인다.** 페이지 래퍼에는 붙이지 않는다 (참고 프로젝트 대표 방식).
- 예외: `app/(state)/state/count/page.tsx`처럼 **페이지 자체**가 `"use client"`인 경우도 있다 (11개 페이지). 이 방식은 페이지가 직접 훅을 쓰는 학습 예제에서 주로 보인다.

### 4-2. `"use client"` 파일 목록 중 `layout.tsx`에서 쓰는 것

- `provider/ReactQueryProvider.tsx` (`"use client"`)
- `components/auth/AuthHydration.tsx` (`"use client"`)

→ 루트 레이아웃은 서버 컴포넌트이고, 두 Provider 성격의 컴포넌트만 클라이언트로 둔다. 이 구조가 가장 권장되는 방식이다.

### 4-3. `instant` 라우트 설정

```tsx
// app/(auth)/join-additional/page.tsx
export const instant = false

import JoinAdditional from "./_component/JoinAdditional";
// ...
```

- Next 16의 `instant` 라우트 세그먼트 설정이다. 이 설정은 **서버 컴포넌트에서만** 쓸 수 있고, 클라이언트 컴포넌트에서 쓰면 오류가 난다 (Next 문서 명시).
- 참고 프로젝트에서 `export const instant = false`가 있는 페이지 7개: `join-additional/page.tsx`, `react-query-01/[id]/page.tsx`, `react-query-02/[id]/page.tsx`, `react-query-03/page.tsx`, `react-query-03/[id]/page.tsx`, `react-query-04/page.tsx`, `react-query-04/[id]/page.tsx`.
- `false`는 "즉시 네비게이션(instant UI)을 기대하지 않는다"는 의미다. 학습 예제가 이 설정을 명시해 둔 것으로 보인다.
- `cacheComponents: true`(`next.config.ts`)가 켜져 있어야 이 설정이 의미가 있다.

### 4-4. 서버에서 데이터를 가져오는 방식

- **참고 프로젝트는 서버 컴포넌트에서 데이터를 가져오지 않는다.** 실서비스 흐름은 전부 클라이언트에서 `fetch`(또는 React Query)로 가져온다.
- 예외는 1건 있다: `app/(lifecycle)/lifecycle/side-effect/[id]/page.tsx`. 서버 컴포넌트 `Post`가 `await fetch(...)`를 한다. 이 파일 주석에 **`※권장하지 않음`**이라고 적혀 있다. 에러 처리가 없다.

---

## 5. 미들웨어 (`middleware.ts`)

```ts
// middleware.ts (실제 코드 요약)
export function middleware(request: NextRequest) {
    const refreshToken = request.cookies.get("refresh_token")
    const { pathname } = request.nextUrl

    if (!refreshToken && pathname.startsWith("/my-page")) {
        return NextResponse.redirect(new URL("/login", request.url))
    }
    if (refreshToken && (pathname.startsWith("/login") || pathname.startsWith("/join"))) {
        return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ["/login", "/join", "/my-page/:path*"]
}
```

- **역할**: 쿠키 `refresh_token`이 **있는지**만 확인해 리다이렉트한다. 토큰 검증은 하지 않는다. 실제 인증 확인은 `AuthHydration`이 백엔드에 물어본다.
- **`matcher`에 없는 경로**: `/join-additional`은 미들웨어 대상이 아니다.
- **Next 16 변경 사항**: Next 16 문서(`upgrading/version-16.md`)에 따르면 `middleware` 파일 명칭은 **deprecated**이며 `proxy.ts`로 바꾸고 함수명도 `proxy`로 바꾸도록 안내한다. Edge 런타임을 쓰면 `middleware`를 유지해야 하는 예외도 있다. 이 프로젝트는 Node 런타임 기준이므로 `proxy.ts`로 옮기는 것이 맞다.
- **보호 경로는 쿠키 존재 여부로만 판단**하므로, 만료된 쿠키도 통과한다는 한계가 있다.

---

## 6. 렌더링 및 캐싱 설정

`next.config.ts`:

```ts
experimental: { agentFeedback: true },
reactStrictMode: false,     // 학습 설정
cacheComponents: true,      // Next 16 Cache Components
partialPrefetching: true,
devIndicators: false,
```

- 페이지의 정적/동적 결정은 `cacheComponents` 모드의 규칙을 따른다. 이 저장소에서는 **`"use cache"` 지시어를 사용하지 않는다** (0건).
- 클라이언트 데이터는 React Query 기본 설정(`staleTime` 5분)으로 캐시한다 (`provider/ReactQueryProvider.tsx`).
- `reactStrictMode: false`는 개발 중 effect 이중 실행을 끈다. 새 프로젝트에서는 켜는 쪽이 맞다 (effect 정리 누락을 잡아 준다).

---

## 7. 이미지 및 폰트

### 7-1. 이미지

- `next/image`의 `Image` 컴포넌트를 쓴다 (`MyPageContainer.tsx`, `PhotoContainer.tsx`).
- `width`, `height`를 명시한다.
- 외부 이미지 호스트는 `next.config.ts`의 `images.remotePatterns`에서 `https` + `hostname: "**"`로 모두 허용한다.
- 마이페이지 기본 이미지 `"/default.jpg"`는 `public/`에 없다 (`PROJECT_OVERVIEW.md` 6장).

### 7-2. 폰트

- **Geist**: `app/layout.tsx`의 `next/font/google`. 빌드 시 구글 폰트를 받아 온다.
- **Pretendard**: `style/font/font.ts`의 `next/font/local`. `public/assets/fonts/pretendard/`의 woff2 9개 굵기를 쓴다.
- `display: "swap"` 설정이 있다.

---

## 8. 데이터 흐름 요약

```
[클라이언트 컴포넌트]
    │  useQuery / useMutation          (React Query)
    │  useEffect + fetch               (학습 예제, lifecycle)
    │  useAuthStore / useCountStore    (Zustand)
    ▼
[api/*.api.ts]  ── fetch ──▶  [백엔드 (NEXT_PUBLIC_BACKEND_URL)]
                                  또는 https://jsonplaceholder.typicode.com (학습 예제)
```

- 프론트에 Route Handler가 없어서 **브라우저가 백엔드를 직접 호출**한다. 그래서 쿠키는 `credentials: "include"`와 백엔드 CORS 설정에 의존한다.
- 이 방식은 `NEXT_PUBLIC_BACKEND_URL`을 브라우저에 노출한다. 공개해도 되는 주소여야 한다.

---

## 9. 이 프로젝트 구조에서 발견된 Next.js 관련 문제 (요약)

1. **빌드를 막는 구문 오류**: `app/(protexted)/my-page/_component/MyPageContainer.tsx` 147행 (`PROJECT_OVERVIEW.md` 6-1).
2. **`middleware` 명칭 deprecated**: `proxy.ts`로 이름 변경 필요.
3. **모달 라우트 충돌 의심**: `app/(modal)/modal/login/search-email/page.tsx`와 `app/@modal/modal/login/search-email/page.tsx`가 같은 URL을 만든다.
4. **`loading.tsx`, `error.tsx` 없음**: 로딩·에러 처리를 페이지마다 직접 작성하고 있다. 새 프로젝트에서는 세그먼트별 `loading.tsx`, `error.tsx`를 두는 것이 Next 방식에 맞다.
5. **`<html lang="en">`**: 한국어 화면과 맞지 않는다.
6. **`ErrorComponent` 함수명 `Error`**: Next의 `error.tsx` 관례 이름과 겹쳐 혼동이 생길 수 있다.
