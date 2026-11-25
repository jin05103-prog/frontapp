# PROJECT_OVERVIEW

> 이 문서는 `E:\kdf\Next.js` 프로젝트(이하 "참고 프로젝트")를 **실제 소스와 설정 파일을 기준으로** 분석한 결과다.
> 확인되지 않은 내용은 작성하지 않았고, 확인된 내용에는 파일 경로를 함께 적었다.
> 실제 사용 중인 방식과 권장 방식은 구분했다.

---

## 1. 프로젝트 성격

- **Next.js 16 App Router 기반의 학습/실습 프로젝트**다. 하나의 서비스보다는 주제별 예제 라우트 모음에 가깝다.
- 한 가지 실서비스 흐름(인증)이 있다: 로그인, 회원가입, 소셜 로그인 연동, 추가 정보 입력, 마이페이지, 프로필 이미지 변경, 로그아웃.
- 나머지는 React / Next / 상태관리 / 데이터 페칭 / Tailwind 개념을 익히기 위한 **예제 페이지**다.
- 소스 규모: 추적 파일 141개 중 TypeScript/TSX 111개 (`git ls-files` 기준, shadcn 생성 파일 `components/ui/button.tsx` 포함).
- 현재 Git 브랜치: `main`. 작업 트리는 깨끗하다. 단, `claude.md`는 추적되지 않은(untracked) 파일이다.

---

## 2. 최상위 디렉터리 구조

| 경로 | 역할 | 비고 |
|---|---|---|
| `app/` | App Router 라우트 전체 | 라우트 그룹 14개 + 병렬 라우트 슬롯 `@modal` |
| `api/` | 도메인별 HTTP 호출 함수 | `api/<domain>/<domain>.api.ts` 규칙 |
| `type/` | DTO / 공통 응답 타입 | `type/<domain>/<domain>.type.ts` 규칙 |
| `enum/` | 열거형 | `member.enum.ts`, `file.enum.ts` |
| `store/` | Zustand 전역 상태 | `useXxxStore.ts` 규칙 |
| `components/` | 공통 컴포넌트 | `common/`, `auth/`, `ui/`(shadcn) |
| `provider/` | 클라이언트 Provider | `ReactQueryProvider.tsx` 1개 |
| `lib/` | 유틸 함수 | `utils.ts`의 `cn` |
| `style/` | 폰트 / Tailwind 테마 CSS | `font/font.ts`, `tailwind/tailwind.theme.css` |
| `public/` | 정적 파일 | Pretendard 웹폰트(woff2), 이미지 1개, 기본 SVG |
| `middleware.ts` | 요청 전 경로 가드 | 쿠키 `refresh_token` 존재 여부만 확인 |
| `next.config.ts` | Next 설정 | `cacheComponents`, `agentFeedback` 등 |
| `components.json` | shadcn 설정 | style `base-nova`, iconLibrary `lucide` |
| `AGENTS.md` | `next dev`가 관리하는 에이전트 지침 | Next 16 문서 참조 지침 포함 |
| `claude.md` | 이번 분석 작업의 지시서 | 추적되지 않음 |

---

## 3. 핵심 모듈 간 관계

```
[브라우저]
   │
   ├─ middleware.ts ──(쿠키 refresh_token 확인)──> /login, /join, /my-page 리다이렉트
   │
   ├─ app/layout.tsx (RootLayout)
   │    ├─ ReactQueryProvider  (provider/)      : QueryClient 제공
   │    ├─ AuthHydration       (components/auth) : 앱 진입 시 GET/POST /members/me, /auth/refresh 호출
   │    │                                         → useAuthStore 에 member / isAuthenticated 기록
   │    ├─ {children}          (각 page.tsx)
   │    └─ {modal}             (app/@modal 슬롯, default.tsx 는 null 반환)
   │
   └─ 각 페이지
        page.tsx (대부분 서버 컴포넌트, 얇은 래퍼)
          └─ _component/XxxContainer.tsx ("use client", 데이터 + 로직)
               ├─ api/*        : fetch 함수 (컴포넌트 밖에 정의)
               ├─ store/*      : Zustand 전역 상태
               ├─ type/*, enum/*: 타입 정의
               └─ components/common/ (Loading, ErrorComponent)
```

핵심 연결 고리 두 가지:

1. **인증 상태**는 `AuthHydration`이 서버에서 확인하고, 결과를 `useAuthStore`(Zustand + `persist`, localStorage 키 `auth-store`)에 저장한다. 마이페이지(`MyPageContainer`)가 이 스토어를 읽는다.
2. **서버 데이터**는 `api/*` 함수 → React Query(`useQuery` / `useMutation`)로 가져온다. 전역 클라이언트 상태(카운트, 게시글 목록 등)는 Zustand 스토어를 쓴다.

---

## 4. 주요 파일 역할 (실제 인증 흐름 중심)

| 파일 | 역할 |
|---|---|
| `app/page.tsx` | 홈. 로그인/회원가입/소셜 로그인(`NEXT_PUBLIC_BACKEND_URL/auth/{google,kakao,naver}`) 링크 |
| `app/(auth)/login/_component/Login.tsx` | 이메일/비밀번호 로그인. `loginApi` 호출 |
| `app/(auth)/join/_component/Join.tsx` | 회원가입 폼 UI. **제출 시 API 호출 없음 (console.log만)** |
| `app/(auth)/join-additional/_component/JoinAdditional.tsx` | 소셜 로그인 후 추가 정보 입력. `joinAdditionalApi` 호출 |
| `app/(protexted)/my-page/_component/MyPageContainer.tsx` | 마이페이지, 프로필 이미지 변경, 로그아웃. **파일 끝 구문 오류 있음 (4장 참고)** |
| `components/auth/AuthHydration.tsx` | 최초 로드 시 로그인 상태 복원 + 토큰 재발급 |
| `middleware.ts` | `/my-page/*`는 비로그인 차단, `/login`·`/join`은 로그인 상태에서 차단 |
| `store/useAuthStore.ts` | `member`, `isAuthenticated` 전역 상태 |
| `api/auth/auth.api.ts` | `loginApi`, `logoutApi` |
| `api/member/member.api.ts` | `joinAdditionalApi`, `updateProfileApi` |

나머지 약 40개 라우트는 React / Next / Tailwind 학습용 예제다 (라우트 그룹별 목적은 `NEXTJS_ARCHITECTURE.md` 참고).

---

## 5. 라우트 그룹 목록 (실제 `app/` 기준)

| 그룹 | 목적 | 비고 |
|---|---|---|
| `(auth)` | 로그인, 회원가입, 추가 정보 | 실제 인증 흐름 |
| `(protexted)` | 마이페이지 | **폴더명 오타 `protexted`** (`protected` 의도로 보임). URL에는 영향 없음 |
| `(modal)` | 모달 실습 | `/modal/login`, `/modal/login/search-email` |
| `@modal` | 병렬 라우트 슬롯 | `default.tsx`가 `null` 반환 |
| `(hooks)` | react-hook-form 실습 | `hooks/hook-form` |
| `(lifecycle)` | useEffect / useMemo / useCallback 실습 | |
| `(map)` | 배열 렌더링 / key 실습 | basic, normal, expert |
| `(props)` | props 전달 실습 | |
| `(reactquery)` | React Query 실습 01~04 | 외부 API(jsonplaceholder) 사용 |
| `(reference)` | 참조 실습 | |
| `(state)` | 상태 관리 실습 | count, name, color |
| `(study)` | 빈 공부용 페이지 | |
| `(tailwind)` | Tailwind 스타일 실습 01~05 | |
| `(tutorial)` | TSX 문법 실습 | |
| `(zustand)` | Zustand 실습 01~03 | |

> 라우트 그룹 `(...)`은 URL에 나타나지 않는다. 실제 URL 예: `app/(auth)/login/page.tsx` → `/login`.

---

## 6. 확인된 문제점 및 개선 필요 항목

> 아래 항목은 **실행 또는 정적 검사로 확인한 것**과 **코드 읽기로 확인한 것**을 구분했다.
> 이 프로젝트의 소스는 수정하지 않았다 (분석 원칙 10).

### 6-1. 빌드를 막는 확인된 오류 (검증됨)

- **`app/(protexted)/my-page/_component/MyPageContainer.tsx` 147행**: `<button>`이 닫히지 않은 채 148행 `</>`(프래그먼트 닫기)가 나온다. 파일 끝의 `}`까지 구문이 맞지 않는다.
  - `npx tsc --noEmit` 실행 결과: `TS17014`, `TS1003`, `TS1381`, `TS1005` 오류 4건 (84, 148, 150행 부근).
  - TypeScript는 구문 오류가 있으면 **의미 검사(타입 오류)를 건너뛴다**. 따라서 이 파일을 고친 뒤 다시 검사해야 다른 타입 오류를 알 수 있다.

### 6-2. 도구 체인 문제 (검증됨)

- **ESLint 실행 불가**: `npx eslint .` → `typescript-eslint does not support TS 7.0`. `package.json`이 `typescript: ^7.0.2`를 쓰고, `eslint-config-next`가 쓰는 `typescript-eslint`가 TS 7.0을 지원하지 않는다. 결과적으로 `npm run lint`가 동작하지 않는다.
- **락 파일 두 개 공존**: `package-lock.json`과 `yarn.lock`이 모두 추적된다. 어느 패키지 매니저가 기준인지 불분명하다.
- **`postcss` 설정 파일명 오류 가능성**: `posscss.config.mjs` (오타). PostCSS는 `postcss.config.*`를 읽으므로 이 파일은 무시될 가능성이 크다. Tailwind는 `next.config.ts`의 `turbopack.rules`에서 처리된다.

### 6-3. 암묵적 의존 및 잠재 오류 (코드 읽기로 확인, 빌드로는 미검증)

- **`cn` 임포트 경로**: `lib/utils.ts`가 `export { cn } from "cn"`, `components/ui/button.tsx`가 `import { cn } from "cn"`을 쓴다. `"cn"`은 `package.json`에 없고, `shadcn`의 의존성으로 `node_modules`에 들어온 패키지다 (`package-lock.json`에 `shadcn → cn@^0.2.4`). 정상 설치 흐름에서는 동작하지만 **직접 선언되지 않은 간접 의존**이다. 표준 shadcn 구성은 `clsx` + `tailwind-merge`를 직접 쓴다.
- **`UserContainer.tsx` 이름 혼동 (컴파일 오류 아님)**: `lifecycle/_component/UserContainer.tsx`가 `import User from "./User"`(값, 컴포넌트)와 `export interface User`(타입)를 같은 이름으로 쓴다. 같은 구조의 임시 프로젝트로 `tsc`를 돌려 **오류 없이 통과함을 확인했다**. 다만 값과 타입이 같은 이름을 쓰므로 읽는 사람을 헷갈리게 한다.
- **`/modal/login/search-email` 라우트 중복 의심**: `app/(modal)/modal/login/search-email/page.tsx`와 `app/@modal/modal/login/search-email/page.tsx` 두 파일이 같은 URL을 만든다. 빌드로 확인하지는 않았다.
- **`middleware.ts` → `proxy.ts` 이름 변경 대상**: Next 16 문서(`node_modules/next/dist/docs/.../upgrading/version-16.md`)는 `middleware` 파일 명칭이 deprecated이며 `proxy`로 바뀌었다고 안내한다. 현재 동작은 하지만 마이그레이션 대상이다.
- **`ErrorComponent`의 함수명 `Error`**: `components/common/ErrorComponent.tsx`가 `export default function Error()`로 전역 `Error`를 가린다. 10개 파일에서 사용한다.
- **`MyPageContainer.tsx`의 `"/default.jpg"`**: `public/` 아래에 해당 파일이 없다 (`public/assets/images/react-query-02/Joker.jpg`만 있음).
- **`UseEffectTest.tsx`의 `felx`** 오타: `text-[30px] felx justify-center`. 동작하지 않는 클래스다.
- **`interval/page.tsx`의 정리 누락**: `setInterval`을 만들고 `useEffect`에서 `return () => clearInterval(...)`를 하지 않는다. 대신 `setState` 업데이터 안에서 `clearInterval`을 호출하는데, 업데이터는 순수 함수여야 한다.
- **`Join.tsx`(회원가입) 미연결**: `app/(auth)/join/_component/Join.tsx`와 `app/(hooks)/hooks/hook-form/_component/Join.tsx`는 거의 같은 코드인데, 제출 시 API를 호출하지 않는다 (`// 데이터 통신 (fetch) - react-query` 주석만 있음).
- **미사용 의존성**: `lucide-react`, `tslint-config-airbnb`는 `package.json`에 있지만 소스에서 import하지 않는다. `tslint`는 deprecated 도구다.
- **미사용 enum**: `enum/file.enum.ts`의 `FileFolder`는 어디서도 사용하지 않는다. `updateProfileApi`는 `"profile"` 문자열을 직접 넣는다.
- **오타성 이름**: `loginRequestDTD` (`api/auth/auth.api.ts`), `retryReponse` (`AuthHydration.tsx`), `GdCommponent` (`tsx04`), `top11/2`, `translate-1/2` (`search-email/page.tsx`, 클래스 오타로 위치 지정이 깨진다).
- **`console.log`가 남아 있음**: 12개 파일 (폼 제출 값, 렌더링 로그 등).

### 6-4. 설정 및 코드 스타일의 불일치

- **인증 API 에러 처리 방식이 파일마다 다르다**: `loginApi`는 서버 `message`를 `JSON.stringify`로 감싸서 던지고, `logoutApi`는 고정 문구를 던지며, `updateProfileApi`는 고정 문구를 던진다.
- **`onError: (err) => { }`** 빈 핸들러 (`MyPageContainer.tsx`).
- **`alert()` 사용**: 6곳. 프로덕션 UI에는 권장되지 않는 방식이다.
- **`api/post`, `api/user`는 외부 API를 하드코딩** (`https://jsonplaceholder.typicode.com`)하고 환경변수를 쓰지 않는다. `api/auth`, `api/member`는 `NEXT_PUBLIC_BACKEND_URL`을 쓴다.
- **`usePostStore`의 `selectedId`, `get`**: 선언만 하고 사용하지 않는다.
- **Tailwind 커스텀 토큰 미사용**: `globals.css`에 `--color-primary: #B72818`, `--color-sub: #FFA213`을 정의했지만, 실제 코드는 `bg-purple-500`, `bg-blue-500` 같은 기본 팔레트를 직접 쓴다.
- **`wiggle` 키프레임 중복 정의**: `app/globals.css`와 `style/tailwind/tailwind.theme.css`에 각각 정의되어 있고, 값도 다르다 (`-3deg/3deg` vs `-10deg/200deg/10deg`). 레이아웃은 둘 다 import한다.
- **`--color-primary` 중복 정의**: `globals.css`의 `@theme inline`(shadcn 토큰)과 `@theme`(커스텀)에서 `primary` 계열 이름이 겹친다.
- **`cacheComponents: true`와 `"use client"` 페이지 혼재**: 기능 자체는 동작하지만, Cache Components 모드에서 서버/클라이언트 경계를 의도적으로 나눈 흔적은 적다.

### 6-5. 개발 환경 참고

- `.env*`는 `.gitignore`에 포함되어 있고, 저장소에 `.env` 예시 파일도 없다. 실행하려면 `NEXT_PUBLIC_BACKEND_URL` 환경변수가 필요하다. 이 값이 어떤 백엔드 주소인지는 이 저장소만으로는 알 수 없다.
- 테스트 프레임워크 설정 파일이 없다.
- Prettier 설정 파일이 없다.

---

## 7. 이 문서를 읽는 방법

- 개발 규칙은 `CODING_CONVENTIONS.md`, 컴포넌트 설계는 `COMPONENT_GUIDE.md`, 라우트 구조는 `NEXTJS_ARCHITECTURE.md`, 통신은 `API_GUIDE.md`, 스택 버전은 `TECH_STACK.md`를 본다.
- 새 프로젝트에 적용할 규칙 요약은 `CLAUDE_NEW_PROJECT.md`에 정리했다. 원래 이름 `CLAUDE.md`는 기존 `claude.md`와 Windows에서 같은 파일이 되어 덮어쓰게 되므로 쓰지 않았다. 새 프로젝트로 옮길 때 `CLAUDE.md`로 이름을 바꾼다.
