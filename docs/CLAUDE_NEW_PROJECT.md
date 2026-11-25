# CLAUDE.md (새 프로젝트용 초안)

> **파일명 주의**: 이 내용은 원래 `CLAUDE.md`로 만들 예정이었다. 하지만 이 참고 프로젝트 루트에 이미 `claude.md`(지시서, 추적되지 않음)가 있고, Windows 파일 시스템은 대소문자를 구분하지 않아 같은 파일이 된다. 그래서 덮어쓰지 않도록 이름을 바꿨다.
> **새 프로젝트에 옮길 때는 파일명을 `CLAUDE.md`로 바꿔서 루트에 둔다.**

---

## 0. 가장 먼저 읽을 것

1. 이 문서가 개발 규칙의 기준이다.
2. 세부 규칙은 다음 문서를 참조한다 (새 프로젝트에 같이 복사하거나, 이 문서의 요약을 따른다).
   - `CODING_CONVENTIONS.md` — 문법, 네이밍, Hooks, import/export
   - `COMPONENT_GUIDE.md` — 컴포넌트 분리, Props, 공통 컴포넌트
   - `NEXTJS_ARCHITECTURE.md` — 라우팅, 서버/클라이언트 경계, 미들웨어, 캐시 설정
   - `API_GUIDE.md` — 백엔드 호출, 응답 형식, 에러 처리, 인증 흐름
   - `TECH_STACK.md` — 버전과 의존성
   - `PROJECT_OVERVIEW.md` — 참고 프로젝트의 구조와 **알려진 문제 목록** (복사하지 말 것)
3. Next.js 코드를 쓰기 전에 설치된 Next 버전의 문서(`node_modules/next/dist/docs/`)를 확인한다. 이 프로젝트는 Next 16이며 API 명칭이 이전 버전과 다르다 (예: `middleware` → `proxy`).

---

## 1. 기술 스택 (고정)

- **Next.js 16.x (App Router)**, **React 19.x**, **TypeScript 7.x `strict`**
- 스타일: **Tailwind CSS 4.x**, shadcn/ui 구성(`components.json`), `class-variance-authority`
- 서버 데이터: **TanStack React Query 5.x**
- 클라이언트 전역 상태: **Zustand 5.x** (`create` + `combine` + `persist`)
- 폼: **react-hook-form 7.x**
- 통신: 브라우저 `fetch` (axios 등 추가하지 않음)

> **임의로 기술 스택을 바꾸지 않는다.** 라이브러리를 추가·교체하거나 버전 메이저를 올리려면 먼저 이유를 설명하고 사용자 승인을 받는다. 특히 다음은 승인 없이 도입하지 않는다: 새 상태관리 라이브러리, 새 폼 라이브러리, 검증 스키마 라이브러리(zod 등), 새 UI 프레임워크, DB/ORM.

패키지 매니저는 **하나만** 쓴다. 락 파일도 하나만 커밋한다 (참고 프로젝트는 `package-lock.json`과 `yarn.lock`이 둘 다 있어 기준이 모호했다).

---

## 2. 계승해야 하는 개발 규칙

### 2-1. 함수와 컴포넌트

- 페이지·컴포넌트는 **`export default function Name()`** 으로 선언한다.
- API 함수, 핸들러, 헬퍼는 **`const name = (...) => {}`** 화살표 함수로 선언한다.
- Props 인터페이스는 **컴포넌트 바로 위**에 `interface NameProps {}`로 선언하고, 매개변수에서 구조 분해한다.
- 컴포넌트 내부 핸들러는 `handleXxxYyy` 이름을 쓴다 (`handleFileChange`, `handleLogout`).
- 외부 데이터 fetch 함수는 **컴포넌트 밖**에 둔다. 실서비스에서는 `api/` 폴더로 뺀다.

### 2-2. 페이지 구조

```
app/(group)/route/
├─ page.tsx                  ← 서버 컴포넌트, 얇은 래퍼 (로직 없음)
└─ _component/
   ├─ XxxContainer.tsx       ← "use client", 데이터·상태·핸들러
   └─ Xxx.tsx                ← props만 받는 표시 컴포넌트
```

- `"use client"`는 훅이나 이벤트가 필요한 **가장 아래 파일**에만 붙인다.
- 로딩·에러 처리는 early return: `if (isLoading) return <Loading />`, `if (error) return <ErrorComponent />`.

### 2-3. API 레이어

```
api/{domain}/{domain}.api.ts    ← xxxApi 함수 (fetch 호출)
type/{domain}/{domain}.type.ts  ← 요청/응답 DTO
enum/{domain}.enum.ts           ← 열거형
```

- 모든 백엔드 호출은 `process.env.NEXT_PUBLIC_BACKEND_URL` + `credentials: "include"`를 쓴다 (쿠키 기반 인증일 때).
- 실패는 `if (!response.ok) throw new Error(...)`로 던진다.
- 응답은 `ApiResponseDTO<T>` (`{ success, message, data }`) 형태를 따른다. **`T`에 실제 타입을 넣는다** (기본 `any` 금지).
- 서버 메시지가 있으면 읽어서 에러 메시지로 쓴다 (`response.json().catch(() => null)` 패턴).

### 2-4. 서버 데이터와 전역 상태

- 서버 데이터: `useQuery`(조회), `useMutation`(변경). 쿼리 키는 `["리소스명"]` 또는 `["리소스명", id]`.
- 전역 클라이언트 상태: `store/useXxxStore.ts`, Zustand `create(persist(combine(...)))`, **기본 export 1개**.
- 스토어 구독은 **선택자를 쓴다**: `useCountStore((s) => s.count)`.

### 2-5. 폼

- `useForm<DTO>({ mode: "onChange" })`, `register`에 `required`와 `pattern`(또는 `validate`)을 준다.
- 에러 표시는 `errors?.필드?.type === "규칙명"`으로 분기한다.
- 제출 전에 입력값을 DTO로 변환한다 (예: 문자열 → `Number`).

### 2-6. 스타일

- Tailwind 유틸리티 클래스를 쓴다. 긴 클래스 묶음이 3번 이상 반복되면 컴포넌트나 스타일 상수(`*.style.ts`)로 뺀다.
- 색상은 디자인 토큰을 먼저 정한다. 참고 프로젝트처럼 `--color-primary`를 정의해 놓고 `bg-purple-500`을 쓰는 불일치를 만들지 않는다.

### 2-7. 네이밍

| 대상 | 규칙 |
|---|---|
| 라우트 폴더 | kebab-case |
| 컴포넌트 파일 | PascalCase |
| 스토어 파일 | `use{Name}Store.ts` |
| API 함수 | `{동사}{명사}Api` |
| DTO | `{Name}RequestDTO`, `{Name}DTO`, `ApiResponseDTO` |
| boolean | `is`·`has` 접두사 |

- DTO 필드 명명(camelCase / snake_case)은 **백엔드 명세에 맞추고, 프로젝트 안에서 한 가지로 통일한다.**

### 2-8. import

- 폴더를 넘을 때는 `@/` 별칭을 쓴다 (`@/api/...`, `@/components/...`).
- 같은 `_component/` 폴더 안에서만 `./`를 쓴다.

---

## 3. 새 프로젝트에서 허용되는 구조 변경

- 폴더 구조: 도메인별 모듈(`features/{domain}/`)로 묶는 방식을 허용한다. 단, 한 번 정하면 프로젝트 전체에서 같은 방식을 쓴다.
- Next 16 기능 사용: 세그먼트별 `loading.tsx`, `error.tsx`, `not-found.tsx`를 둔다 (참고 프로젝트에는 없어서 페이지마다 직접 처리했다).
- 미들웨어: 이름은 `proxy.ts`(함수명 `proxy`)를 쓴다. `middleware`는 deprecated다.
- 서버 로직: 필요하면 Route Handler나 Server Action을 쓸 수 있다. 참고 프로젝트에는 없었으므로, 도입 이유를 적는다.
- 학습용 예제 라우트(`(study)`, `(lifecycle)` 등)는 새 프로젝트에 가져오지 않는다.

---

## 4. 코드 작성 시 반드시 지킬 규칙

1. **`any`를 쓰지 않는다.** `unknown`이나 명시 타입을 쓴다.
2. **`console.log`를 커밋하지 않는다.** 디버그 로그는 제거한다.
3. **타이머·구독은 반드시 정리한다.** `useEffect`에서 `setInterval`, `addEventListener` 등을 쓰면 `return () => ...`로 정리한다.
4. **목록 `key`에 배열 인덱스를 쓰지 않는다.** 고유 ID가 있으면 ID를 쓴다.
5. **`"use client"`를 페이지 래퍼에 붙이지 않는다.** 훅이 필요한 파일에만 붙인다.
6. **`export const instant`는 서버 컴포넌트에만** 쓴다. 클라이언트 컴포넌트에 쓰면 오류다.
7. **동적 라우트 파라미터는 `await params`로 읽는다** (`params`는 Promise다).
8. **`NEXT_PUBLIC_` 접두사가 없는 환경변수는 서버 전용이다.** 클라이언트 코드에서 읽지 않는다.
9. **사용자에게 보이는 오류 문구를 숨기지 않는다.** `onError`가 `console.error`만 하면 안 된다. 화면에 알린다.
10. **검증 정규식과 오류 메시지를 한 곳에서 관리한다.** 같은 정규식을 여러 파일에 복사하지 않는다. 메시지는 정규식의 실제 규칙과 맞춘다.
11. **알려진 문제를 복사하지 않는다.** `PROJECT_OVERVIEW.md` 6장의 항목(구문 오류, 오타 식별자, 중복 라우트 등)을 참고 프로젝트에서 가져오지 않는다.
12. **`useMemo`/`useCallback`은 측정된 필요가 있을 때만 쓴다.** 기본은 쓰지 않는다.
13. **`<html lang>`은 화면 언어와 맞춘다.** 한국어 화면이면 `lang="ko"`.

---

## 5. 새 기능 구현 절차

1. **요구 확인**: 라우트, 데이터 출처(백엔드 / 전역 상태 / 로컬), 로그인 필요 여부를 정리한다.
2. **기존 재사용 확인**: `components/common/`, `components/ui/`, `store/`, `api/`, `lib/`에 쓸 수 있는 것이 있는지 먼저 찾는다. 없으면 만든다.
3. **타입**: `type/{domain}/{domain}.type.ts`에 DTO를 정의한다.
4. **API**: `api/{domain}/{domain}.api.ts`에 `xxxApi`를 만든다 (`throw` 규칙과 응답 형식을 지킨다).
5. **전역 상태**가 필요할 때만 `store/use{Name}Store.ts`를 만든다. 서버 데이터는 스토어에 복사하지 않는다 (React Query 캐시를 쓴다).
6. **Container**: `_component/{Name}Container.tsx`에 `"use client"`, 훅, 핸들러, 로딩·에러 early return을 둔다.
7. **표시 컴포넌트**: 필요하면 `_component/{Name}.tsx`로 나눈다. Props만 받는다.
8. **page.tsx**: 서버 컴포넌트로 컨테이너만 렌더링한다. 동적 파라미터는 여기서 `await params`.
9. **검증**: 아래 명령을 실행하고 결과를 보고한다.
   - `npx tsc --noEmit` (타입 오류 0건)
   - `npm run build` (빌드 성공)
   - 린트 도구가 동작하는지 먼저 확인한다 (참고 프로젝트에서는 TS 7과 `typescript-eslint` 호환 문제로 실패했다).
10. **결과 보고**: 바꾼 파일, 검증 결과, 확인하지 못한 것을 명확히 적는다.

---

## 6. 기존 컴포넌트 및 코드 재사용 원칙

- 새로 만들기 전에 검색한다: `components/common/` → `components/ui/` → 같은 도메인의 `api/`·`type/`.
- 같은 UI 묶음이 두 번 이상 나오면 공통 컴포넌트로 뺀다.
- 같은 검증 규칙을 두 파일에서 쓰면 `lib/`로 옮긴다.
- 다른 기능을 위해 기존 파일의 시그니처를 바꿀 때는, 호출하는 모든 곳을 확인하고 함께 고친다.

---

## 7. 참조 및 우선순위

1. 이 `CLAUDE.md`의 규칙이 가장 우선한다.
2. 프로젝트의 `AGENTS.md`(있을 경우)와 설치된 Next 문서가 그다음이다.
3. 나머지 가이드 문서(`CODING_CONVENTIONS.md` 등)는 이 규칙을 **자세히 풀어 쓴 것**이다. 충돌하면 이 문서를 따르고, 충돌 사실을 사용자에게 알린다.
4. 참고 프로젝트의 **관찰 결과는 "참고용"** 이다. 그대로 따르지 않고, 이 문서의 규칙과 맞는 것만 가져온다.

---

## 8. 작업 보고 형식

- 변경한 파일 목록
- 실행한 검증 명령과 결과 (성공 / 실패 / 실행 못 함을 구분)
- 확인하지 못한 것과 그 이유
- 이 규칙과 다르게 한 부분이 있다면 그 이유
