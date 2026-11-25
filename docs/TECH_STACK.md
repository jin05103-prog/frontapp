# TECH_STACK

> 버전은 `package.json`(선언된 범위)과 `node_modules`에 실제 설치된 버전을 함께 기록했다.
> 설치 버전은 `node -p "require('<pkg>/package.json').version"`으로 확인했다.

---

## 1. 핵심 런타임 및 프레임워크

| 항목 | 선언 (`package.json`) | 설치 확인 | 비고 |
|---|---|---|---|
| Next.js | `16.4.3` (고정) | 16.4.3 | App Router. `next.config.ts` 사용 |
| React | `19.3.0` (고정) | 19.3.0 | |
| react-dom | `19.3.0` (고정) | 19.3.0 | |
| TypeScript | `^7.0.2` | 7.0.2 | **TS 7 (Go 기반 네이티브 컴파일러)**. ESLint 연동 불가 (아래 6장) |
| @types/react | `^19` | | |
| @types/react-dom | `^19` | | |
| @types/node | `26.6.6` (고정) | | |

- `tsconfig.json`: `strict: true`, `target: es2020`, `module: esnext`, `moduleResolution: bundler`, `jsx: react-jsx`, `isolatedModules: true`, `paths: { "@/*": ["./*"] }`.
- `"use client"` 지시어를 쓰는 파일이 많으므로 React 19의 서버 컴포넌트 모델을 전제로 한다.

---

## 2. 스타일링 및 UI

| 패키지 | 선언 | 용도 | 실제 사용 |
|---|---|---|---|
| tailwindcss | `^4.3.3` | 유틸리티 CSS (Tailwind v4 방식, `@import "tailwindcss"`) | 전역 |
| @tailwindcss/turbopack | `^4` | `next.config.ts`의 `turbopack.rules`에서 `*.css` 처리 | 사용 |
| @tailwindcss/postcss | **package.json에 선언 없음** | `posscss.config.mjs`(파일명 오타)에서만 참조 | 사실상 미사용 |
| autoprefixer | `^10.6.2` | PostCSS 플러그인 | 위 설정 파일에만 등장 |
| postcss | `^8.5.32` | | |
| tw-animate-css | `^1.4.0` | 애니메이션 유틸 | `app/globals.css`에서 import |
| shadcn | `^4.23.0` | shadcn CLI 및 `shadcn/tailwind.css` | `app/globals.css`에서 import |
| class-variance-authority | `^0.7.1` | 버튼 등 variant 정의 | `components/ui/button.tsx` |
| @base-ui/react | `^1.9.0` | 접근성 있는 헤드리스 컴포넌트 (shadcn `base-nova` 스타일의 기반) | `components/ui/button.tsx` |
| lucide-react | `^1.62.0` | 아이콘 라이브러리 | **선언만 되어 있고 소스에서 import 없음** |

- `components.json`: style `base-nova`, baseColor `neutral`, cssVariables `true`, iconLibrary `lucide`, aliases는 `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`.
  - 단, `@/hooks` 디렉터리는 존재하지 않는다.
- 폰트:
  - Pretendard (로컬 woff2, 9개 굵기): `style/font/font.ts`의 `next/font/local`. CSS 변수 `--font-pretendard`.
  - Geist (구글 폰트): `app/layout.tsx`의 `next/font/google`. CSS 변수 `--font-sans`.
- 커스텀 테마:
  - `app/globals.css`: shadcn 토큰(`--background`, `--primary` 등, oklch) + 라이트/다크 변수 + `@theme`에 `--color-primary: #B72818`, `--color-sub: #FFA213`.
  - `style/tailwind/tailwind.theme.css`: `wiggle` 키프레임만 정의. `app/layout.tsx`에서 import.

---

## 3. 상태 관리 및 데이터 통신

| 패키지 | 선언 | 용도 | 파일 |
|---|---|---|---|
| zustand | `^5.0.16` | 전역 클라이언트 상태 (`create` + `combine` + `persist`) | `store/*.ts` |
| @tanstack/react-query | `^5.105.0` | 서버 데이터 페칭 / 캐시 / 뮤테이션 | `provider/ReactQueryProvider.tsx`, 각 `_component` |
| @tanstack/react-query-devtools | `^5.105.0` | 개발용 devtools | **선언만 되어 있고 소스에서 import 없음** |

- fetch는 **브라우저 `fetch` API를 직접 사용**한다. axios는 설치되어 있지 않다.
- React Query 기본 옵션 (`provider/ReactQueryProvider.tsx`): `staleTime: 5분`, `refetchOnWindowFocus: false`.

---

## 4. 폼 및 유효성 검사

| 패키지 | 선언 | 용도 | 파일 |
|---|---|---|---|
| react-hook-form | `^7.91.0` | 폼 상태, `register`, `handleSubmit`, `formState` | `app/(auth)/*`, `app/(hooks)/*`, `app/(modal)/*` |

- 스키마 기반 검증 라이브러리(zod 등)는 **설치되어 있지 않다**. 검증은 `register`의 `required`, `pattern`(정규식), `validate`(함수)로만 한다.

---

## 5. 데이터베이스, ORM, 인증

- **데이터베이스 / ORM: 없음.** 이 저장소에 DB 연결 코드가 없다.
- **백엔드: 별도 서버.** 저장소 밖에 있으며, `NEXT_PUBLIC_BACKEND_URL` 환경변수로 주소를 받는다.
  - 사용하는 엔드포인트 (`api/`, `components/auth/AuthHydration.tsx`, `app/page.tsx` 기준):
    - `POST /auth/login`, `POST /auth/logout`, `GET /auth/refresh`
    - `GET /auth/google`, `GET /auth/kakao`, `GET /auth/naver` (소셜 로그인 리다이렉트)
    - `POST /members/me`, `POST /members/join`, `PUT /members/{id}/profile`
- **인증 방식: 쿠키 기반.** `credentials: "include"`로 쿠키를 주고받는다.
  - `refresh_token` 쿠키는 `middleware.ts`에서 존재 여부만 확인한다. 서명 검증은 하지 않는다.
  - 액세스 토큰 만료 시 `AuthHydration`이 `/auth/refresh`를 호출해 재발급한다.
- **인증 라이브러리(next-auth, Clerk 등): 없음.**

---

## 6. 코드 품질 도구

| 도구 | 선언 | 상태 |
|---|---|---|
| ESLint | `^9` (flat config, `eslint.config.mjs`) | **실행 불가**: `typescript-eslint`가 TS 7.0을 지원하지 않는다 (`npx eslint .` 실패 확인) |
| eslint-config-next | `16.4.3` | `core-web-vitals` + `typescript` 설정을 사용 중. 위 이유로 실행 불가 |
| tslint | `^6.1.3` | **deprecated 도구**. `tslint.json`은 있으나 실행 스크립트 없음 |
| tslint-config-airbnb | `^5.11.2` | 소스에서 사용하지 않음 |
| Prettier | 없음 | 포매터 설정 파일 없음 |
| 테스트 | 없음 | 테스트 러너 및 테스트 파일 없음 |

---

## 7. 주요 설정 파일 요약

### `next.config.ts`

```ts
experimental: { agentFeedback: true },   // Next 에이전트 피드백 (AGENTS.md 관련)
reactStrictMode: false,                  // 학습용 설정. 개발 중 이중 호출 비활성화
cacheComponents: true,                   // Next 16 Cache Components 활성화
partialPrefetching: true,
devIndicators: false,
turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
images: { remotePatterns: [{ protocol: "https", hostname: "**" }] }  // 모든 https 외부 이미지 허용
```

- `images.remotePatterns`의 `hostname: "**"`는 모든 호스트를 허용한다. 프로덕션에서는 좁히는 것이 안전하다.

### `middleware.ts`

- `config.matcher`: `/login`, `/join`, `/my-page/:path*`.

### `components.json`

- shadcn 생성 위치와 별칭 정의. 실제 `components/ui/`에는 `button.tsx` 1개만 있다.

---

## 8. 환경 변수

| 변수 | 사용 위치 | 용도 |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | `api/auth/auth.api.ts`, `api/member/member.api.ts`, `app/page.tsx`, `components/auth/AuthHydration.tsx` | 백엔드 기본 URL. 클라이언트에 노출되는 `NEXT_PUBLIC_` 접두사 사용 |

- 저장소에 `.env` 예시 파일이 없고, `.gitignore`가 `.env*`를 제외한다.

---

## 9. 빌드 및 실행 명령

`package.json` `scripts` 기준:

| 명령 | 실제 동작 |
|---|---|
| `npm run dev` | `next dev` |
| `npm run build` | `next build` |
| `npm run start` | `next start` |
| `npm run lint` | `eslint` (**현재 실패**, 6장 참고) |

- 락 파일 두 개(`package-lock.json`, `yarn.lock`)가 있다. 팀에서 실제로 쓰는 패키지 매니저를 하나로 정해야 한다.
- `next build`는 이 분석에서 실행하지 않았다. 알려진 구문 오류(`MyPageContainer.tsx`)로 실패할 것이 예상된다.

---

## 10. 배포

- 저장소에 배포 설정(Dockerfile, `vercel.json`, GitHub Actions 등)이 없다. 배포 방식은 이 저장소만으로 확인할 수 없다.
- `README.md`는 `create-next-app` 기본 문구이며 프로젝트 고유 배포 절차가 없다.
