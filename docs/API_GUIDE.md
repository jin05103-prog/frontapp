# API_GUIDE

> 이 문서는 참고 프로젝트가 **백엔드와 통신하는 실제 방식**과, **학습용 외부 API를 다루는 방식**을 구분해 정리한다.
> 백엔드 서버 코드는 이 저장소에 없다. 엔드포인트와 응답 형식은 프론트 코드에 나타난 호출 방식에서 **추정할 수 있는 범위만** 적었다.

---

## 1. 통신 구조 한눈에 보기

참고 프로젝트에는 호출 경로가 **세 가지** 있다.

| 구분 | 위치 | 대상 | 파일 예 |
|---|---|---|---|
| ① 실서비스 백엔드 (API 함수 분리) | `api/auth/`, `api/member/` | `NEXT_PUBLIC_BACKEND_URL` | `api/auth/auth.api.ts` |
| ② 학습용 외부 API (API 함수 분리) | `api/post/`, `api/user/` | `https://jsonplaceholder.typicode.com` | `api/post/post.api.ts` |
| ③ 학습용 외부 API (컴포넌트 내부 fetch) | `app/(reactquery)/*`, `app/(lifecycle)/*` 등 | `jsonplaceholder` 하드코딩 | `react-query-01/_component/TodoQueryContainer.tsx` |
| ④ 인증 상태 복원 | `components/auth/AuthHydration.tsx` | `NEXT_PUBLIC_BACKEND_URL` | 컴포넌트 안에 직접 `fetch` |

**권장 방식은 ①이다.** 새 프로젝트에서는 ①의 구조(`api/{domain}/{domain}.api.ts`)를 그대로 따른다.

- ③은 학습 흐름을 보여주기 위한 예외다. `TodoQueryContainer.tsx` 주석은 "fetching 함수는 컴포넌트 밖에서 선언"을 권장하지만, 같은 파일 안에서 `getTodos`를 정의하고 있다.
- ④는 앱 초기화 로직이라 컴포넌트에 있다. 이 부분은 `api/auth/`로 옮기는 것이 일관된다.

---

## 2. 백엔드 통신 방식 (① ④)

### 2-1. 기본 규칙

모든 백엔드 호출은 다음을 지킨다.

```ts
// api/auth/auth.api.ts
const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    credentials: "include",                  // 쿠키 주고받기
    body: JSON.stringify(loginRequestDTD)
})
```

| 규칙 | 설명 |
|---|---|
| 베이스 URL | `process.env.NEXT_PUBLIC_BACKEND_URL` + 경로 문자열 템플릿 |
| 인증 | `credentials: "include"` (쿠키 기반, 헤더에 토큰을 넣지 않음) |
| 본문 | JSON은 `JSON.stringify`, 파일은 `FormData` |
| 응답 | `response.json()`으로 파싱 후 반환 |
| 실패 | `if (!response.ok)`에서 `throw new Error(...)` |

> `credentials: "include"`는 백엔드가 CORS에서 `Access-Control-Allow-Credentials: true`와 명시적 Origin을 허용해야 동작한다. 이 설정은 이 저장소에 없고 백엔드 쪽에 있다.

### 2-2. 엔드포인트 목록 (프론트 호출 기준)

| 메서드 | 경로 | 함수 | 파일 | 목적 |
|---|---|---|---|---|
| POST | `/auth/login` | `loginApi` | `api/auth/auth.api.ts` | 이메일·비밀번호 로그인 |
| POST | `/auth/logout` | `logoutApi` | `api/auth/auth.api.ts` | 로그아웃 |
| GET | `/auth/refresh` | (직접 fetch) | `components/auth/AuthHydration.tsx` | 액세스 토큰 재발급 |
| POST | `/members/me` | (직접 fetch) | `components/auth/AuthHydration.tsx` | 현재 로그인 회원 정보 |
| POST | `/members/join` | `joinAdditionalApi` | `api/member/member.api.ts` | 소셜 로그인 후 추가 정보 등록 |
| PUT | `/members/{id}/profile` | `updateProfileApi` | `api/member/member.api.ts` | 프로필 이미지 변경 |
| GET | `/auth/google` `/auth/kakao` `/auth/naver` | (링크) | `app/page.tsx` | 소셜 로그인 시작 (`<Link>`로 이동) |

- 소셜 로그인은 `fetch`가 아니라 **`<Link href=...>`로 백엔드 주소에 이동**한다. 백엔드가 OAuth 리다이렉트를 처리한다.
- `/members/me`는 `POST`다 (조회인데 POST를 쓴다). 백엔드 명세에 맞춘 것이므로 그대로 따른다.

### 2-3. 공통 응답 형식 `ApiResponseDTO`

```ts
// type/common/common.type.ts
export interface ApiResponseDTO<T = any> {
    success: boolean
    message: string
    data: T | null
}
```

- 백엔드 응답은 `{ success, message, data }` 형태라고 가정하고 쓴다. 실제 사용처:
  - `setMember(result.data)` — `AuthHydration.tsx`
  - `alert(datas.message)` — `Login.tsx`
  - `setMember(datas.data)` — `MyPageContainer.tsx`
- 제네릭 `T`에 실제 데이터 타입을 넣는 방식을 권장한다 (`ApiResponseDTO<MemberDTO>`). 현재는 기본값 `any`를 써서 타입 안전성이 약하다.

### 2-4. 요청 DTO 정의

```ts
// type/auth/auth.type.ts
export interface LoginRequestDTO {
    member_email: string;
    member_password: string;
}

// type/member/member.type.ts
export interface JoinAdditionalRequestDTO {
    memberEmail: string;
    memberPhone: string;
    memberName: string;
    memberAge: number;
    memberProvider: string;
    memberProviderId: string;
}

export interface ProfileUpdateRequestDTO {
    id: number
    file: File
}
```

- 요청 DTO는 `type/{domain}/{domain}.type.ts`에 둔다.
- **필드 명명이 섞여 있다**: `LoginRequestDTO`는 `snake_case`, `JoinAdditionalRequestDTO`는 `camelCase`. 백엔드 명세에 맞춘 결과로 보이나, 이 저장소만으로는 확인할 수 없다. (`CODING_CONVENTIONS.md` 2장)
- `memberAge`는 DTO에서 `number`지만, 입력 폼은 문자열로 받는다. 제출 전에 `Number(...)`로 변환한다 (`JoinAdditional.tsx`).

```tsx
// JoinAdditional.tsx
const onSubmit = async (joinDto: JoinAdditionalRequestDTO) => {
    const payload = { ...joinDto, memberAge: Number(joinDto.memberAge) }
    joinMutation.mutate(payload)
}
```

- 폼 입력값 → DTO 변환은 **제출 직전 한 곳**에서 한다. 이 방식을 권장한다.

### 2-5. 파일 업로드 (`FormData`)

```ts
// api/member/member.api.ts
export const updateProfileApi = async (fileDto: ProfileUpdateRequestDTO): Promise<ApiResponseDTO> => {
    const formData = new FormData()
    formData.append("file", fileDto.file)
    formData.append("folder", "profile")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/members/${fileDto.id}/profile`, {
        method: "PUT",
        body: formData          // Content-Type 헤더를 직접 넣지 않는다 (브라우저가 boundary 포함해 설정)
    })
    ...
}
```

- `FormData`를 쓸 때는 `Content-Type`을 **직접 지정하지 않는다**. 직접 넣으면 multipart boundary가 빠져 실패한다.
- `folder` 값 `"profile"`은 `enum/file.enum.ts`의 `FileFolder.PROFILE`과 같은 값이지만, enum을 쓰지 않고 문자열을 직접 넣었다. 새 프로젝트에서는 enum을 쓰는 것이 낫다.
- `updateProfileApi`의 반환값은 `Promise<ApiResponseDTO>`로 표기했지만 실제 `response.json()` 결과는 타입 검증을 하지 않는다.

---

## 3. 인증 토큰 갱신 흐름 (`AuthHydration.tsx`)

앱이 열릴 때 한 번 실행된다. 쿠키 기반 인증을 쓰므로 토큰 값을 JS로 다루지 않는다.

```
1. POST /members/me
   ├─ 200 → setMember(data), setIsAuthenticated(true) → 끝
   └─ 401 (액세스 토큰 만료)
        2. GET /auth/refresh
           ├─ 200 → 3. POST /members/me 재시도
           │         ├─ 200 → 로그인 상태로 복원 → 끝
           │         └─ 실패 → (아래 로그아웃)
           └─ 실패 → (아래 로그아웃)
        로그아웃: setMember(null), setIsAuthenticated(false)
   
   네트워크 예외 → catch → 로그아웃 상태
```

```tsx
// components/auth/AuthHydration.tsx (발췌)
const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/members/me`, {
    method: "POST",
    credentials: "include"
})

if (response.ok) {
    const result: ApiResponseDTO = await response.json()
    setMember(result.data)
    setIsAuthenticated(true)
    return;
}
if (response.status === 401) {
    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
        method: "GET",
        credentials: "include"
    })
    ...
}
```

- 상태 코드는 `response.status === 401`로 직접 비교한다. 다른 코드(403, 500)는 모두 "로그아웃 처리"로 빠진다.
- 이 흐름은 **재발급 실패 시 항상 로그아웃 상태**가 되므로, 일시적 서버 장애에도 로그인이 풀린다는 한계가 있다.
- `middleware.ts`가 쿠키 `refresh_token`을 보고 페이지 접근을 막는다. 쿠키 이름 `refresh_token`은 두 파일이 같이 쓴다.

---

## 4. 학습용 외부 API 방식 (② ③)

### 4-1. API 함수 분리 방식 (②, 권장에 가까움)

```ts
// api/post/post.api.ts
export interface Post {
    userId: number;
    id:     number;
    title:  string;
    body:   string;
}

export const getPosts = async (): Promise<Post[]> => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts")
    if(!response.ok)
        throw new Error("getPosts fetching failed")
    const posts = await response.json()
    return posts
}
```

- 타입 정의와 fetch 함수를 **같은 파일**에 둔다. 이 파일만 타입이 `type/` 폴더 밖에 있다.
- 반환 타입 `Promise<Post[]>`를 명시한다.
- `api/user/user.api.ts`는 `getUsers`, `getUser`의 **반환 타입을 명시하지 않는다**(`any`로 추론됨). 같은 폴더 안에서도 `post.api.ts`와 수준이 다르다.

### 4-2. 컴포넌트 내부 fetch 방식 (③, 예외)

```tsx
// app/(reactquery)/react-query-01/_component/TodoQueryContainer.tsx
const getTodos = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos")
    if (!response.ok)
        throw new Error("Fetching failed")  // throw === raise

    const datas = await response.json()
    return datas
}

export default function TodoQueryContainer() {
    const { data, isLoading, error } = useQuery<Todo[]>({
        queryKey: ["todos"],
        queryFn: getTodos,
    })
    ...
}
```

- 이 방식은 **학습 흐름**을 보여준다. 그래서 주석에 "fetching 함수는 컴포넌트 밖에서 선언"이라고 적혀 있다.
- 실서비스 코드에는 이 방식을 가져오지 않는다.
- 이 방식으로 정의된 fetch 함수: `getTodos`(react-query-01 ×2), `getTodoById`(×2), `getPhotos`, `PhotoRead`의 fetch, `PostContainer`의 fetch(lifecycle) 등.

### 4-3. 쿼리 키 목록 (React Query)

| 쿼리 키 | 위치 | 데이터 |
|---|---|---|
| `["todos"]` | `react-query-01/_component/TodoQueryContainer.tsx`, `TodoQueryContainer02.tsx` | 전체 todo 목록 (같은 키를 두 컴포넌트가 공유) |
| `["todo", id]` | `react-query-01/[id]/_component/TodoRead.tsx`, `react-query-01/read/_component/TodoRead.tsx` | todo 1개 |
| `["photos"]` | `react-query-02/_component/PhotoContainer.tsx` | 사진 목록 |
| `["photo", id]` | `react-query-02/[id]/_component/PhotoRead.tsx` | 사진 1개 |
| `["users"]` | `react-query-03/_component/UserContainer.tsx` | 유저 목록 |
| `["user", id]` | `react-query-03/[id]/_component/UserRead.tsx` | 유저 1개 |
| `["posts"]` | `react-query-04/_component/PostContainer.tsx`, `zustand03/_component/PostsContainer.tsx` | 게시글 목록 (같은 키 공유) |
| `["post", id]` | `react-query-04/[id]/_component/PostRead.tsx` | 게시글 1개 |

- 쿼리 키 규칙: **`[리소스명]` 또는 `[리소스명, id]`**. 복수형은 목록, 단수형은 개별 항목에 쓴다 (`todos` / `todo`).
- 같은 리소스의 목록 키를 여러 컴포넌트가 공유하면 캐시를 함께 쓴다. 의도한 것이면 괜찮지만, 다른 형태의 데이터를 같은 키로 쓰면 충돌한다.

### 4-4. ID 기반 쿼리 조건

```tsx
// PostRead.tsx
const { data: post, isLoading, error } = useQuery<Post>({
    queryFn: () => getPost(id),
    queryKey: ["post", id],
    enabled: !!Number(id),    // 숫자가 아니면 요청하지 않음
    retry: 3
})
```

- `enabled: !!Number(id)`로 잘못된 ID(숫자가 아닌 값)를 요청하지 않게 막는다. `UserRead.tsx`도 같은 패턴이다.
- `retry: 3`은 실패 시 3번까지 재시도한다.

---

## 5. 로딩 및 에러 처리

### 5-1. React Query 기반 (권장)

```tsx
if (isLoading) return <Loading />
if (error) return <ErrorComponent />
```

- 모든 React Query 컴포넌트가 이 두 줄로 상태를 처리한다.
- `ErrorComponent`는 에러 내용을 보여주지 않는다. "알 수 없는 오류입니다..ㅠ" 고정 문구만 있다. 새 프로젝트에서는 `error.message`를 함께 보여주거나 재시도 버튼을 둔다.

### 5-2. 뮤테이션 기반 (인증 흐름)

```tsx
const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (datas: ApiResponseDTO) => {
        alert(datas.message)
        router.push("/")
    },
    onError: (err) => {
        console.error(err.message)
    }
})
```

- 성공: 서버 `message`를 `alert`로 띄우고 이동한다.
- 실패: `console.error`만 한다. **사용자에게 알리지 않는다.** 로그인이 실패해도 화면 변화가 없다.
- `MyPageContainer.tsx`의 `onError`는 빈 함수다 (`onError: (err) => { }`). 프로필 변경 실패도 사용자에게 아무 표시가 없다.

### 5-3. 에러 메시지 생성 방식이 제각각이다

| 함수 | 실패 시 던지는 메시지 |
|---|---|
| `loginApi` | 서버 `message`가 있으면 `JSON.stringify(err.message)`, 없으면 `요청 실패 (상태코드)` |
| `joinAdditionalApi` | 위와 같음 |
| `logoutApi` | `"logoutApi fetching Error"` (고정) |
| `updateProfileApi` | `"프로필 변경에 실패하였습니다."` (고정) |
| `getPosts`, `getPost`, `getUser` 등 | `"xxx fetching failed"` (고정) |

- 서버 메시지를 읽는 함수(`loginApi`, `joinAdditionalApi`)가 가장 나은 형태다. `response.json().catch(() => null)`로 응답 본문이 JSON이 아닌 경우도 막는다.
- `loginApi`는 `JSON.stringify`로 감싸서 따옴표가 붙은 문자열이 된다. 메시지가 배열이면 그대로 두는 것이 낫다.

---

## 6. 데이터 검증 및 변환

| 위치 | 방식 |
|---|---|
| 입력 검증 | react-hook-form `register`의 `required`, `pattern` (정규식), `validate` |
| 이메일 정규식 | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` (Login, Join, JoinAdditional에 각각 선언) |
| 비밀번호 정규식 | `/^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/` (숫자, 소문자, `!@#` 중 하나 이상, 8자 이상) |
| 타입 변환 | `Number(joinDto.memberAge)` (제출 직전) |
| 서버 측 검증 | 이 저장소에서 확인할 수 없다 (백엔드 코드 없음) |

- **정규식이 여러 파일에 복사되어 있다.** 새 프로젝트에서는 `lib/validation.ts`처럼 한 곳에 모은다.
- 비밀번호 오류 메시지가 파일마다 다르다. 실제 정규식 동작(직접 테스트 확인): **소문자·숫자·`!@#` 중 하나씩 필수, 대문자는 불필요, 특수문자는 `!@#`만 인정, 8자 이상**.
  - `Login.tsx`의 메시지 "소문자, 숫자, 특수문자(!@#)를 각 하나 포함한 8자리 이상"은 정규식과 **일치**한다.
  - `Join.tsx`(auth, hook-form 둘 다)의 메시지 "대/소문자, 숫자, 특수문자를 각 하나 포함한 8자리 이상"은 정규식과 **일치하지 않는다** (대문자는 필수가 아니고, 특수문자는 `!@#`만 된다). 예: `Abcdefg1!`은 통과, `abcdefg1$`은 실패.
  - 새 프로젝트에서는 규칙을 한 곳에 두고, 메시지도 그 규칙에서 만든다.

---

## 7. 환경 변수

| 변수 | 접두사 | 용도 |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | `NEXT_PUBLIC_` (브라우저 노출) | 백엔드 기본 URL |

- 서버 전용 비밀 값(API 키 등)은 이 저장소에 없다. 새 프로젝트에서 서버 전용 값이 생기면 `NEXT_PUBLIC_` 없이 쓰고, 서버 컴포넌트나 Route Handler에서만 읽는다.
- `.env*`는 `.gitignore`에 있으므로, 팀 공유용 예시 파일(`.env.example`)을 따로 두는 것이 좋다.

---

## 8. 서버와 클라이언트 간 데이터 전달

| 방식 | 사용처 |
|---|---|
| 클라이언트 `fetch` → 백엔드 | 거의 모든 실서비스 호출 |
| URL 쿼리스트링 | 소셜 로그인 후 추가 정보 페이지 (`JoinAdditional.tsx`가 `member_email`, `member_provider`, `member_provider_id`를 `useSearchParams`로 받음) |
| 라우트 파라미터 → props | 동적 라우트 `[id]`는 서버 페이지에서 `await params` 후 클라이언트 컴포넌트에 `id`를 넘김 |
| 쿠키 | 인증 토큰 (`credentials: "include"`) |

- 서버 컴포넌트에서 직접 백엔드를 호출하는 예는 없다 (예외: `(lifecycle)/side-effect/[id]`, `권장하지 않음`으로 표기된 학습 예제).
- Server Action과 Route Handler는 쓰지 않는다. 새 프로젝트에서 **서버 전용 로직이 필요하면** Route Handler나 Server Action을 검토한다.

---

## 9. 새 API 추가 절차 (이 프로젝트 방식 기준)

1. `type/{domain}/{domain}.type.ts`에 요청·응답 DTO를 정의한다.
2. `api/{domain}/{domain}.api.ts`에 `xxxApi` 함수를 만든다.
   - `NEXT_PUBLIC_BACKEND_URL` 사용
   - `credentials: "include"`, `Content-Type: application/json`
   - `if (!response.ok) throw new Error(...)`
   - 반환 타입을 `Promise<ApiResponseDTO<T>>`로 명시
3. 컴포넌트에서 `useQuery`(조회) 또는 `useMutation`(변경)으로 호출한다.
   - 쿼리 키는 `[리소스명]` 또는 `[리소스명, id]`
   - 로딩·에러는 early return
4. 성공·실패 후 처리를 `onSuccess`·`onError`에 둔다. 사용자 알림은 `alert` 대신 토스트를 권장한다.

---

## 10. 이 프로젝트에서 발견된 API 관련 문제 (요약)

1. 학습용 외부 API 호출이 `api/`와 컴포넌트 내부에 섞여 있다 (2장 ②와 ③).
2. `api/user/user.api.ts`의 반환 타입이 없다.
3. `ApiResponseDTO`의 기본 제네릭이 `any`다.
4. 에러 메시지 생성 방식이 함수마다 다르다 (5-3).
5. `onError`가 빈 함수이거나 `console.error`만 한다 (사용자 알림 없음).
6. 이메일·비밀번호 정규식이 여러 파일에 복사되어 있고, 비밀번호 메시지와 실제 정규식이 맞지 않는다.
7. `FileFolder` enum이 있지만 쓰지 않는다.
8. `AuthHydration`에서 401 외 모든 실패가 로그아웃 처리된다.
