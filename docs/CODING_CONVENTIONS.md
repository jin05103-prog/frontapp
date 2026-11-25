# CODING_CONVENTIONS

> 이 문서는 참고 프로젝트의 **실제 코드에서 관찰한 문법과 패턴**을 정리한 것이다.
> 각 규칙에는 근거 파일을 적었다. 여러 방식이 섞여 있으면 **대표 방식**과 **예외**를 구분했다.
> 관찰 수치는 `git grep`으로 센 값이다. `components/ui/`(shadcn 생성 파일)를 제외한 TS/TSX 110개 기준이다.

---

## 1. 포맷팅 (관찰된 대표 방식)

| 항목 | 대표 방식 | 근거 | 비고 |
|---|---|---|---|
| 들여쓰기 | **스페이스 4칸** | 108/110 파일 | `components/ui/button.tsx`(shadcn 생성 파일)만 2칸 |
| 세미콜론 | **혼용** | 전체 약 377줄에 `;` | 대부분 생략. `import`에는 붙는 파일이 많음 → 파일별로 불일치 |
| 따옴표 | **큰따옴표 `"`** | `app/(auth)/login/_component/Login.tsx` 등 | 예외: `store/useCountStore.ts`는 작은따옴표 |
| 줄 길이 | 제한 없음 | | Prettier 설정 없음 |
| 빈 줄 | 함수 내부 단락 구분에 사용 | `MyPageContainer.tsx` | |

> **권장**: 새 프로젝트에서는 Prettier 설정을 두고 4칸 / 큰따옴표 / 세미콜론 방식을 하나로 고정한다. 참고 프로젝트는 설정 파일이 없어 혼용되어 있다.

---

## 2. 파일 및 식별자 네이밍

| 대상 | 규칙 | 예시 (실제 파일) |
|---|---|---|
| 페이지 라우트 폴더 | 소문자 kebab-case | `app/(auth)/join-additional/` |
| 동적 세그먼트 | `[id]` | `app/(reactquery)/react-query-04/[id]/page.tsx` |
| 페이지 파일 | `page.tsx` (함수명은 `page` 또는 `Page` 혼용) | `app/(props)/props/props-01/page.tsx`의 `export default function page()` |
| 페이지 전용 하위 컴포넌트 폴더 | `_component/` (언더스코어로 시작 → 라우트 제외) | `app/(auth)/login/_component/Login.tsx` |
| 컴포넌트 파일 | PascalCase | `TodoQueryContainer.tsx`, `ChildrenComponent.tsx` |
| 공통 컴포넌트 | PascalCase, `components/` 하위 | `components/common/Loading.tsx` |
| 스타일 상수 파일 | `{route}.style.ts` | `app/(tailwind)/style-03/style-03.style.ts` |
| API 파일 | `api/{domain}/{domain}.api.ts` | `api/auth/auth.api.ts` |
| 타입 파일 | `type/{domain}/{domain}.type.ts` | `type/member/member.type.ts` |
| enum 파일 | `enum/{domain}.enum.ts` | `enum/member.enum.ts` |
| 스토어 파일 | `store/use{Name}Store.ts` | `store/useAuthStore.ts` |
| 유틸 파일 | camelCase | `lib/utils.ts` |

### 변수 및 함수

| 대상 | 규칙 | 예시 |
|---|---|---|
| 백엔드 호출 함수 | `{동사}{명사}Api` | `loginApi`, `logoutApi`, `joinAdditionalApi`, `updateProfileApi` |
| 예외: 외부 API 래퍼 | 접미사 없음 | `getPosts`, `getPost` (`api/post/post.api.ts`) |
| 컴포넌트 내부 fetch 함수 | `get{Name}` 또는 `getDatas` | `const getTodos = async () => {...}` (`TodoQueryContainer.tsx`) |
| 이벤트 핸들러 | `handle{대상}{이벤트}` | `handleFileChange`, `handleUploadProfile`, `handleLogout`, `handleCancelFileClick`, `handleValueChange` |
| React Query 훅 결과 | `data`, `isLoading`, `error` 또는 `data: post` 로 이름 바꾸기 | `PostRead.tsx` |
| Mutation 변수 | `{동작}Mutation` | `loginMutation`, `joinMutation`, `uploadProfileMutation`, `logoutMutation` |
| 상수 정규식 | `{이름}Regex` | `emailRegex`, `passwordRegex` (각 컴포넌트 내부 선언) |
| boolean 상태 | `is` 접두사 | `isAuthenticated`, `isLoading`, `isSubmitting` |

### 타입 및 DTO

| 대상 | 규칙 | 예시 |
|---|---|---|
| 요청/응답 DTO | `{이름}RequestDTO`, `ApiResponseDTO`, `{이름}DTO` | `LoginRequestDTO`, `ProfileUpdateRequestDTO`, `MemberDTO` |
| 컴포넌트 Props | `{컴포넌트명}Props` | `ChildProps`, `PostReadProps`, `TodoReadProps`, `ReactQueryProviderProps` |
| 외부 API 응답 타입 | 인터페이스 이름 그대로 export | `Post`, `Todo`, `Photo`, `User` |

> **불일치 주의**: DTO 필드 명명이 두 가지다.
> - `type/auth/auth.type.ts`, `type/member/member.type.ts`의 `MemberDTO`: `snake_case` (`member_email`, `member_name`)
> - `JoinAdditionalRequestDTO`: `camelCase` (`memberEmail`, `memberProviderId`)
>
> 새 프로젝트에서는 한 방식으로 통일하는 것이 좋다. 백엔드 응답 형식에 맞추되, 프론트 내부 타입은 한 가지로 고정한다.

---

## 3. 함수 및 컴포넌트 작성 방식

### 3-1. 컴포넌트는 `export default function`으로 선언한다 (대표 방식)

근거: 소스 전체에서 `export default function` 91회.

```tsx
// app/(props)/props/props-01/_component/Child.tsx
interface ChildProps {
    name: string,
    phone: string
}

export default function Child({name, phone}: ChildProps) {
    return (
        <>
            자식 태그
            <p>{name}</p>
            <p>{phone}</p>
        </>
    );
}
```

- Props 인터페이스는 **컴포넌트 바로 위에** 선언한다. `Child.tsx` 주석에도 "Props 타입은 컴포넌트 위에 선언하는 것이 관례"라고 적혀 있다.
- 구조 분해는 **매개변수 선언부에서** 한다.
- 예외: `React.FC`는 사용하지 않는다 (0건).

### 3-2. 헬퍼 함수 및 API 함수는 `const` 화살표 함수로 선언한다

근거: `export const xxxApi = async (...) => {...}` 패턴 (`api/*`, 8개 화살표 export).

```ts
// api/auth/auth.api.ts
export const loginApi = async (loginRequestDTD: LoginRequestDTO): Promise<ApiResponseDTO> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginRequestDTD)
    })
    ...
}
```

- 반환 타입은 `Promise<ApiResponseDTO>`처럼 명시한다.
- 컴포넌트 **안**의 이벤트 핸들러도 화살표 함수다.

```tsx
// app/(protexted)/my-page/_component/MyPageContainer.tsx
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    ...
}
```

### 3-3. 함수 선언 방식 기준 (정리)

| 대상 | 대표 방식 |
|---|---|
| 페이지·컴포넌트 | `export default function Name()` |
| API 함수 (`api/`) | `export const nameApi = async () => {}` |
| 컴포넌트 내부 이벤트 핸들러 | `const handleXxx = () => {}` |
| 컴포넌트 내부 fetch 함수 | `const getXxx = async () => {}` |
| 외부 데이터 fetch (컴포넌트 밖) | `const getTodos = async () => {}` — 컴포넌트 밖에 선언 (`TodoQueryContainer.tsx` 주석 권장 사항) |

---

## 4. TypeScript 문법

### 4-1. `interface`와 `type`

- `interface`를 쓴다: 43회 (export 포함).
- `type` 별칭은 **사용하지 않는다** (0건).
- 근거 예: `type/common/common.type.ts`

```ts
export interface ApiResponseDTO<T = any> {
    success: boolean
    message: string
    data: T | null
}
```

- 제네릭 기본값 `T = any`를 사용하지만, `any`는 이 코드에서 **1회만** 등장한다 (`app/(tutorial)/tsx/tsx02/page.tsx`의 `(name: any)`). 그 외에는 명시적 타입을 쓴다.

### 4-2. 상태 및 훅의 타입 인자

```tsx
const [amount, setAmount] = useState<number>(1)          // ProductContainer.tsx
const [selectedFile, setSelectedFile] = useState<File | null>(null)  // MyPageContainer.tsx
const { data, isLoading, error } = useQuery<Todo[]>({ ... })  // TodoQueryContainer.tsx
const { register, handleSubmit } = useForm<LoginRequestDTO>({ mode: "onChange" })  // Login.tsx
```

- `useState`는 **초기값이 명확할 때 생략하지 않고 타입 인자를 명시**하는 경우가 많다 (`useState<number>(0)`). 단, `useState("")`처럼 초기값만 쓰는 예도 있다 (`state/color/page.tsx`).

### 4-3. 타입 단언 (`as`)

- 사용처는 Zustand 스토어 초기값이다.

```ts
// store/useAuthStore.ts
combine({
    member: null as MemberDTO | null,
    isAuthenticated: false as boolean
}, ...)
```

- 그 외 `as` 사용은 확인되지 않았다.

### 4-4. 타입 가드

- 명시적인 사용자 정의 타입 가드(`x is T`)는 없다.
- 대신 옵셔널 체이닝과 유니온 좁히기를 쓴다.

```tsx
// PostContainer.tsx
const handleSelectedIdClick = ...
if (!value) { alert(...); return; }
```

### 4-5. 함수 시그니처 타입

- 파라미터 타입은 명시하고, 반환 타입은 **API 함수에서만** 명시하는 편이다.
- 이벤트 타입은 `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>` 형태로 쓴다. `React` 네임스페이스는 import 없이 전역으로 참조한다.

### 4-6. 예외 처리용 타입

- `error` 인자 타입은 `Error` 또는 생략한다 (`onError: (error: Error) => ...`).

---

## 5. React Hooks 사용 방식

### 5-1. `useState`

- 여러 값을 객체로 묶지 않고 **상태 하나당 `useState` 하나**를 쓴다 (`MyPageContainer.tsx`: `selectedFile`, `previewUrl` 각각 선언).

### 5-2. `useEffect`

```tsx
// UserContainer.tsx (lifecycle)
useEffect(() => {
    getDatas().then(setUsers)
}, [])
```

- 의존성 배열을 빠뜨리지 않는다. 마운트 한 번만 실행할 때 `[]`를 쓴다.
- **정리(cleanup) 함수 누락 사례**: `side-effect/interval/page.tsx`는 `setInterval`을 만들고 `return () => clearInterval(...)`를 하지 않는다 (6장 참고).
- 실제 앱 초기화 로직은 `components/auth/AuthHydration.tsx`에 있다. 비동기 함수를 `useEffect` 안에 정의한 뒤 호출한다.

```tsx
useEffect(() => {
    const checkAuthApi = async () => { ... }
    checkAuthApi()
}, [setIsAuthenticated, setMember])
```

### 5-3. `useMemo`, `useCallback`

- 학습용 예제(`app/(lifecycle)/lifecycle/memoization/_component/ProductContainer.tsx`, `app/(study)/study/page.tsx`)에서만 사용한다.
- 함수형 업데이트 `setAmount((prev) => prev - 1)`와 `useCallback(..., [])`를 함께 쓴다.

```tsx
const totalPrice = useMemo(() => amount * 12500 - coupon * 1000, [amount, coupon])
const handleAddAmountClick = useCallback(() => setAmount((prev) => prev + 1), [])
```

- 실서비스 코드(인증 흐름)에서는 `useMemo`/`useCallback`을 쓰지 않는다.

### 5-4. `useForm` (react-hook-form)

```tsx
// app/(auth)/login/_component/Login.tsx
const {
    register, handleSubmit,
    formState: { isSubmitting, errors }
} = useForm<LoginRequestDTO>({ mode: "onChange" })

<input {...register("member_email", {
    required: true,
    pattern: { value: emailRegex, message: "이메일 양식에 맞게 입력해주세요." }
})} />
{errors?.member_email?.type === "required" && (
    <p className="text-red-500 text-[12px]">이메일을 입력하세요.</p>
)}
```

- 에러 표시는 **`errors?.필드명?.type === "규칙명"`** 으로 분기한다.
- 제출 버튼 라벨은 `isSubmitting`으로 바꾼다.
- 예외: 여러 폼이 `formState`에서 `isSubmitted`를 구조 분해하지만 **사용하지 않는다**. `getValues`는 `Join.tsx`(비밀번호 확인 검증)에서만 실제로 쓰고, `JoinAdditional.tsx`와 `(modal)/modal/_component/Login.tsx`에서는 선언만 한다. 사용하지 않는 값은 구조 분해에서 제거하는 것이 좋다.

### 5-5. React Query (`useQuery`, `useMutation`)

```tsx
// app/(reactquery)/react-query-04/[id]/_component/PostRead.tsx
const { data: post, isLoading, error } = useQuery<Post>({
    queryFn: () => getPost(id),
    queryKey: ["post", id],
    enabled: !!Number(id),
    retry: 3
})
if (isLoading) return <Loading />
if (error) return <ErrorComponent />
```

- **Early return으로 로딩·에러를 먼저 처리**한다. 이 패턴은 React Query 예제 전체에 일관되게 쓰인다.
- 쿼리 키는 배열로 쓴다: `["todos"]`, `["todo", id]`, `["post", id]`.

```tsx
// MyPageContainer.tsx
const uploadProfileMutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (datas: ApiResponseDTO) => {
        setMember(datas.data)
        ...
    },
    onError: (err) => { }
})
```

- 실제 흐름에서 `onSuccess`는 Zustand 스토어 갱신이나 `router.push`를 한다.
- `onError`는 `console.error`를 쓰는 편이다. 단 `MyPageContainer.tsx`는 빈 핸들러다 (6장 참고).

### 5-6. Zustand 훅 사용

```tsx
// 전체 구독 (모든 상태 변경에 리렌더링)
const { member, setMember } = useAuthStore()

// 선택자 구독 (필요한 값만 구독) — 권장
const count = useCountStore((state) => state.count)
```

- 두 방식이 모두 쓰이고 있다. 기준은 **선택자 구독을 권장**한다 (`app/(zustand)/zustand02/page.tsx`가 선택자 방식, `zustand01/page.tsx`는 전체 구독).

### 5-7. `useRouter`, `useSearchParams`

- 클라이언트 컴포넌트에서 `next/navigation`의 `useRouter`, `useSearchParams`를 쓴다.
- `router.push`는 이전 경로를 남기고, `router.replace`는 남기지 않는다는 주석이 `PhotoContainer.tsx`에 있다.
- `router.refresh()`는 회원가입 성공 후 서버 데이터를 다시 가져오는 용도로 쓴다 (`JoinAdditional.tsx`).

### 5-8. Custom Hook

- 이 프로젝트에는 **커스텀 훅 파일이 없다**. `hooks/` 디렉터리도 없다.
- `components.json`의 `aliases.hooks: "@/hooks"` 설정은 있지만 실제 디렉터리는 없다.

---

## 6. 조건부 렌더링 및 리스트

### 6-1. 조건부 렌더링

```tsx
// Login.tsx
{errors?.member_email?.type === "required" && (
    <p className="text-red-500 text-[12px]">이메일을 입력하세요.</p>
)}

// MyPageContainer.tsx
{selectedFile && (
    <button onClick={handleCancelFileClick}>취소</button>
)}
```

- 삼항 연산자는 `!post ? (...) : (...)` 형태로 쓴다 (`PostContainer.tsx`).
- 로딩/에러는 함수 초반에서 `if (...) return <Loading />`으로 처리한다.

### 6-2. 리스트 렌더링과 `key`

```tsx
// FoodContainer.tsx (map)
const foodList = foods.map((food, i) => (
    <Food key={i} food={food} />
))
```

- `key`에 **배열 인덱스**를 쓰는 예가 많다 (`FoodContainer.tsx`, `TodoQueryContainer.tsx`, `UserContainer.tsx`).
- 고유 ID가 있으면 ID를 쓴다: `PhotoContainer.tsx`의 `key={id}`, `UserContainer.tsx`의 `key={user.id}`(주석 처리된 코드).
- **권장**: 서버 데이터에 `id`가 있으면 `key={id}`를 쓴다. 인덱스 key는 목록 순서가 바뀔 때 문제가 된다.

---

## 7. 컴포넌트 간 데이터 전달

- 부모 → 자식: **props**. 구조 분해로 받는다.

```tsx
// props-02/_component/ChildrenContainer.tsx
<ChildrenComponent colors={colors}>
    <p>자식태그</p>
</ChildrenComponent>
```

- 여러 컴포넌트가 함께 쓰는 상태: **Zustand 스토어** (`store/`).
- 서버 데이터: **React Query 캐시** (쿼리 키로 공유).
- 페이지 간 값 전달: **URL 쿼리스트링** (`JoinAdditional.tsx`가 `useSearchParams`로 `member_email` 등을 받는다).
- 주의: `Context` API 사용은 발견되지 않았다.

---

## 8. Import 및 Export 규칙

### 8-1. 경로 별칭 `@/`

- tsconfig `paths`: `"@/*": ["./*"]`. 프로젝트 루트 기준 절대 경로다.
- 근거: `from "@/..."` 66회, `from "./..."` 41회 (상대 경로는 주로 같은 `_component/` 폴더 안).

```tsx
import { loginApi } from "@/api/auth/auth.api";          // 다른 폴더 → 별칭
import Loading from "@/components/common/Loading";        // 공통 컴포넌트 → 별칭
import TodoQuery from "./TodoQuery";                      // 같은 _component 폴더 → 상대 경로
```

- **규칙**: 폴더를 넘어갈 때는 `@/`, 같은 `_component/` 안에서는 `./`를 쓴다.

### 8-2. Export 방식

| 대상 | export 방식 | 근거 |
|---|---|---|
| 페이지·컴포넌트 | `export default function` | 91회 |
| API 함수 | `export const` (named) | `api/*` |
| 타입·인터페이스 | `export interface` (named) | `type/*` |
| Enum | `export enum` (named) | `enum/*` |
| Zustand 스토어 | `export default` 1개 | `store/useAuthStore.ts` |
| 공통 유틸 | `export { cn }` (named) | `lib/utils.ts` |

### 8-3. import 순서

- 명시적 순서 규칙은 없다. 관찰된 대략적인 순서는 다음과 같다.
  1. `"use client"` 지시어 (파일 맨 위)
  2. `@/api/…`, `@/type/…`, `@/store/…`, `@/components/…`
  3. 외부 라이브러리 (`@tanstack/react-query`, `react-hook-form`, `next/...`, `react`)
  4. 같은 폴더의 상대 경로
- 실제로는 파일마다 다르다. 자동 정렬 도구 설정이 없다.

---

## 9. 주석 및 문서화

- 주석은 **한국어**로 쓴다 (약 69개 파일에 한글 주석 또는 문자열).
- 주석은 "무엇을 하는지"보다 **학습 메모** 성격이 강하다. 예: `// 1. fetching 함수는 컴포넌트 "밖"에서 선언`, `// 리액트 쿼리는 컴포넌트 "안"에서 호출`.
- 실서비스 코드(`components/auth/AuthHydration.tsx`, `middleware.ts`)는 단계 번호 주석을 쓴다: `// 1. 최초 한 번 accessToken으로...`, `// 2-2. 만약 refreshToken도 만료되었다면...`.
- JSDoc 형식은 사용하지 않는다.

---

## 10. 예외 처리 및 사용자 피드백

### 10-1. API 레이어

```ts
// api/member/member.api.ts
if (!response.ok) {
    throw new Error("프로필 변경에 실패하였습니다.")
}
```

- 실패 시 `throw new Error(...)`로 던지고, 호출부(React Query)가 잡는다.
- `loginApi`는 서버 응답 `message`를 읽으려고 `response.json().catch(() => null)`을 쓴다. 이 방식이 좋은 예다.

### 10-2. 컴포넌트 레이어

- `try/catch`는 `AuthHydration.tsx`에서 fetch 실패를 잡는 데 쓴다.
- 사용자 메시지는 `alert()`로 띄운다 (6회). 학습용 예제 수준이며, 새 프로젝트에서는 토스트나 인라인 메시지로 바꾸는 것을 권장한다.

---

## 11. 중복 코드 방지 및 재사용

- 재사용 가능한 공통 컴포넌트는 `components/common/`에 `Loading`, `ErrorComponent` 2개뿐이다.
- 스타일 문자열의 중복이 많다. 같은 클래스 묶음이 여러 파일에 반복된다.

```tsx
// 여러 파일에 반복되는 버튼 클래스
className="w-50 h-10 bg-purple-500 text-white rounded-2xl mt-5 cursor-pointer"
```

- 이 패턴이 반복된다는 것은 **공통 버튼 컴포넌트가 필요하다는 신호**다. `components/ui/button.tsx`(shadcn)가 있지만 앱 코드에서는 아직 사용하지 않는다.

---

## 12. 금지 및 주의 사항 (관찰 기반 권장)

| 항목 | 참고 프로젝트 상태 | 새 프로젝트 권장 |
|---|---|---|
| `any` 타입 | 1회 사용 | 사용 금지 (`unknown` 또는 명시 타입) |
| `console.log` 잔존 | 12개 파일 | 커밋 전 제거 |
| `alert()` 사용자 알림 | 6회 | 토스트 또는 인라인 메시지 |
| 인덱스를 `key`로 사용 | 여러 곳 | 고유 ID 사용 |
| Effect 정리(cleanup) 누락 | `interval/page.tsx` | 타이머는 반드시 정리 |
| 오타 식별자 | 6장 참고 | 린트 도구로 검사 |
| `@ts-ignore`, `eslint-disable` | 0건 | 유지 |
