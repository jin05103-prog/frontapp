# COMPONENT_GUIDE

> 참고 프로젝트의 실제 컴포넌트 구조를 바탕으로 정리했다.
> 각 규칙의 근거 파일을 함께 적었다. 대표 패턴과 예외를 구분했다.

---

## 1. 컴포넌트 계층 구조 (대표 패턴)

페이지 하나는 보통 3단계로 나뉜다.

```
page.tsx                         ← 서버 컴포넌트. 얇은 래퍼. 라우트 파라미터 처리, Suspense 감싸기
  └─ _component/XxxContainer.tsx ← "use client". 데이터 페칭, 상태, 핸들러
       └─ _component/Xxx.tsx     ← 자식 컴포넌트. props만 받아서 표시
```

실제 예 (React Query 01):

```
app/(reactquery)/react-query-01/page.tsx
  └─ _component/TodoQueryContainer.tsx   (useQuery로 목록 조회, 로딩/에러 분기)
       └─ _component/TodoQuery.tsx       (todo 1개를 제목 링크 `/react-query-01/{id}`로 표시)
```

실제 예 (지도/배열 렌더링):

```
app/(map)/map/basic/page.tsx
  └─ _component/FoodContainer.tsx        (배열 map, key 지정)
       └─ _component/Food.tsx            (food 1개 표시)
```

실제 예 (인증, 페이지 + 컨테이너):

```
app/(auth)/login/page.tsx                       ← <Login /> 하나만 렌더링
  └─ app/(auth)/login/_component/Login.tsx      ← 폼 상태, mutation, 라우팅 전부 포함
```

> **관찰 결과**: 인증 페이지는 `Container`라는 이름 대신 `Login.tsx`, `Join.tsx`처럼 기능명을 쓴다. `Container` 접미사는 React Query 예제와 마이페이지(`MyPageContainer.tsx`)에서 쓰인다. 이름 규칙이 통일되어 있지 않다.

---

## 2. 페이지 파일(`page.tsx`) 작성 규칙

### 2-1. 서버 컴포넌트 페이지 (대표 방식)

```tsx
// app/(auth)/login/page.tsx
import Login from "./_component/Login";

export default function page() {
    return (
        <Login />
    );
}
```

- 페이지는 **로직 없이** 컴포넌트를 렌더링만 한다.
- `"use client"`를 붙이지 않는다 (35개 페이지 서버 컴포넌트).

### 2-2. 동적 라우트 파라미터

```tsx
// app/(reactquery)/react-query-04/[id]/page.tsx
export const instant = false

interface Params {
    params: Promise<{ id: string }>
}

export default async function page({ params }: Params) {
    const { id } = await params

    return (
        <Suspense fallback={<Loading />}>
            <h1>게시글 상세 정보</h1>
            <PostRead id={id} />
        </Suspense>
    );
}
```

- `params`는 **Promise**다. `await`로 꺼낸다 (Next 16 방식).
- 서버에서 꺼낸 `id`를 **props로 클라이언트 컴포넌트에 넘긴다**. 클라이언트 쪽에서 다시 파라미터를 읽지 않는다.
- `export const instant = false`는 Next 16 라우트 세그먼트 설정이다. 이 설정은 서버 컴포넌트에서만 쓸 수 있다 (클라이언트 컴포넌트에서 쓰면 오류). 참고 프로젝트에서는 7개 페이지에 있다.

### 2-3. 페이지에서 Suspense 사용

- 서버 페이지에서 `<Suspense fallback={<Loading />}>`로 감싼 뒤 클라이언트 컴포넌트를 넣는 방식이 있다 (`react-query-04/[id]/page.tsx`).
- 클라이언트 컴포넌트 **내부**에서 Suspense를 쓰는 예도 있다 (`lifecycle/_component/UserContainer.tsx`). 두 방식 모두 존재한다.

---

## 3. Container 컴포넌트 작성 규칙

Container는 `"use client"`로 시작하고, **데이터와 상태 로직을 담당**한다.

### 3-1. 파일 구조 순서 (실제 `MyPageContainer.tsx`, `TodoQueryContainer.tsx` 공통 패턴)

```tsx
"use client"

// 1. import
import { updateProfileApi } from "@/api/member/member.api";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";

// 2. 외부 데이터 fetch 함수 (컴포넌트 밖)
const getTodos = async () => { ... }

// 3. 인터페이스 (Props 또는 도메인 타입)
export interface Todo { ... }

// 4. 컴포넌트
export default function TodoQueryContainer() {
    // 4-1. 훅 (store, router, query, mutation)
    // 4-2. 로컬 상태 (useState)
    // 4-3. 핸들러 (handleXxx)
    // 4-4. 로딩/에러 early return
    // 4-5. JSX
}
```

- **외부 fetch 함수는 컴포넌트 밖에 선언**한다. `TodoQueryContainer.tsx` 주석에 "fetching 함수는 컴포넌트 밖에서 선언, 리액트 쿼리는 컴포넌트 안에서 호출"이라는 권장 사항이 있다.
- 실서비스 `api/` 함수는 컴포넌트 밖이 아니라 `api/` 폴더에 있다. 이쪽이 더 권장되는 방식이다.

### 3-2. 로딩 및 에러는 early return으로 처리한다

```tsx
// PostRead.tsx
if (isLoading) return <Loading />
if (error) return <ErrorComponent />
```

- 로딩과 에러를 JSX 안에서 삼항으로 처리하지 않는다. 함수 초반에 끝낸다.

### 3-3. Mutation 흐름

```tsx
// Login.tsx
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

const onSubmit = async (loginRequestDTO: LoginRequestDTO) => {
    loginMutation.mutate(loginRequestDTO)
}
```

- `handleSubmit(onSubmit)`에 넘기는 `onSubmit`은 `mutate`만 호출하고, 결과 처리는 `onSuccess`/`onError`에서 한다.
- 예외: `MyPageContainer.tsx`의 `handleUploadProfile`은 `alert`로 검증한 뒤 `mutate`를 호출한다. 같은 파일 안에서도 검증 위치가 일관되지 않다.

---

## 4. Presentational 컴포넌트 작성 규칙

- 자식 컴포넌트는 **props만으로 동작**하고 전역 상태나 fetch를 직접 쓰지 않는다. 예: `props-01/_component/Child.tsx`, `map/basic/_component/Food.tsx`.
- Props 인터페이스는 컴포넌트 바로 위에 선언한다 (`CODING_CONVENTIONS.md` 3-1).
- 매개변수에서 구조 분해한다.

```tsx
// props-01/_component/Child.tsx
interface ChildProps {
    name: string,
    phone: string
}

export default function Child({name, phone}: ChildProps) { ... }
```

### 4-1. `children` 전달

```tsx
// props-02/_component/ChildrenContainer.tsx
<ChildrenComponent colors={colors}>
    <p>자식태그</p>
</ChildrenComponent>
```

- 자식으로 JSX를 넘길 때는 `children`을 쓴다 (props-02 예제).

### 4-2. 이벤트 핸들러를 여러 단계로 내려보내기

```tsx
// ProductContainer.tsx → Amount.tsx
<Amount
    amount={amount}
    coupon={coupon}
    handleSubtractAmountClick={handleSubtractAmountClick}
    handleAddAmountClick={handleAddAmountClick}
    handleSubtractCouponClick={handleSubtractCouponClick}
    handleAddCouponClick={handleAddCouponClick}
/>
```

- 핸들러를 prop으로 내려보내는 방식이다. 학습용 예제에서 `useCallback`과 함께 쓰여 메모이제이션 효과를 보여준다.
- 핸들러 prop 개수가 많아지면 객체로 묶거나 Zustand 스토어로 옮기는 것이 좋다.

---

## 5. 공통 컴포넌트 (`components/`)

| 파일 | 종류 | 내용 | 사용처 |
|---|---|---|---|
| `components/common/Loading.tsx` | 표시용 | `<div>로딩중...</div>` 한 줄 | 약 20개 파일 |
| `components/common/ErrorComponent.tsx` | 표시용 | `<p>알 수 없는 오류입니다..ㅠ</p>` | 10개 `app` 파일 |
| `components/auth/AuthHydration.tsx` | 동작용 (렌더 결과 없음) | 앱 진입 시 로그인 상태 복원 (`return null`) | `app/layout.tsx` |
| `components/ui/button.tsx` | shadcn UI | `@base-ui/react` Button + `class-variance-authority` variant | **앱 코드에서 사용하지 않음** |

### 5-1. 공통 컴포넌트 작성 시 주의

- `ErrorComponent.tsx`의 함수 이름이 `Error`라서 전역 `Error`를 가린다. 새 프로젝트에서는 `ErrorMessage`처럼 바꾸는 것이 좋다.
- `Loading`, `ErrorComponent`는 props를 받지 않는다. 메시지를 바꾸거나 재시도 버튼을 넣으려면 props 추가가 필요하다.
- `AuthHydration`처럼 렌더링하지 않는 컴포넌트는 `return null`을 쓴다.

### 5-2. shadcn 버튼 (`components/ui/button.tsx`)

- 파일 구조가 shadcn 표준 그대로다. `cva`로 variant와 size를 정의하고, `data-slot="button"`을 붙인다.
- 새 프로젝트에서 UI 버튼을 표준화하려면 이 파일을 쓰는 것이 자연스럽다. 참고 프로젝트에서는 실제 화면이 아직 이 컴포넌트를 쓰지 않는다.

```tsx
<Button variant="outline" size="lg">확인</Button>   // 사용 가능한 예 (이 프로젝트에서는 아직 호출 없음)
```

- `cn`은 `@/lib/utils`에서 import한다. `lib/utils.ts`가 `"cn"` 패키지를 재-export하므로, 내부 의존 구조는 `CODING_CONVENTIONS.md`의 "암묵적 의존" 항목을 참고한다.

---

## 6. 재사용 가능한 컴포넌트 설계 원칙 (정리)

참고 프로젝트에서 관찰된 기준에 맞춰 정리했다.

1. **위치**: 특정 페이지에서만 쓰면 그 페이지의 `_component/`에 둔다. 여러 페이지에서 쓰면 `components/`로 올린다.
2. **책임 분리**: 데이터/상태는 Container, 표시는 자식 컴포넌트가 맡는다.
3. **Props 최소화**: 자식이 필요한 값만 넘긴다. 예: `Child`는 `name`, `phone`만 받는다.
4. **타입 위치**: 페이지 전용 타입은 같은 파일에 둔다. 도메인 공통 타입은 `type/`에 둔다.
   - 참고: `TodoQueryContainer.tsx`가 `Todo` 인터페이스를 export하고 `TodoRead.tsx`가 가져다 쓴다. 이는 `type/` 폴더 규칙과 어긋나는 예외다.
5. **로딩·에러 UI**: `components/common/`의 `Loading`, `ErrorComponent`를 쓴다.
6. **스타일 중복**: 같은 `className` 묶음이 3번 이상 나오면 컴포넌트나 스타일 상수로 뺀다. 참고 프로젝트에서는 `style-03.style.ts`처럼 `STYLE` 객체로 분리한 예가 있다.

```ts
// (tailwind)/style-03/style-03.style.ts
export const STYLE = {
    a: "hover:underline hover:text-blue-200",
    button: "active:bg-green-500 active:text-white"
}
```

---

## 7. 파일명 및 폴더명 (요약)

| 대상 | 규칙 | 예 |
|---|---|---|
| 페이지 폴더 | kebab-case, 라우트 그대로 | `react-query-04/` |
| 페이지 전용 컴포넌트 | `_component/` 폴더 안, PascalCase | `_component/PostRead.tsx` |
| Container | `{명사}Container.tsx` | `PostContainer.tsx`, `TodoQueryContainer.tsx` |
| 기능 컴포넌트 | `{기능명}.tsx` | `Login.tsx`, `JoinAdditional.tsx` |
| 공통 컴포넌트 | `components/{분류}/{Name}.tsx` | `components/common/Loading.tsx` |

---

## 8. 이 프로젝트에서 발견된 컴포넌트 문제 (요약)

자세한 내용은 `PROJECT_OVERVIEW.md` 6장에 있다. 컴포넌트 관점만 모았다.

- `MyPageContainer.tsx`: 147행에 닫히지 않은 `<button>` (구문 오류로 빌드 불가).
- `lifecycle/_component/UserContainer.tsx`: `User` 컴포넌트 import와 `User` 인터페이스가 같은 이름을 쓴다. 컴파일 오류는 아니지만(임시 프로젝트로 확인), 값과 타입 이름이 같아 혼동을 준다.
- `Join.tsx` 두 파일: 같은 폼이 두 번 있다 (`(auth)/join`, `(hooks)/hooks/hook-form`).
- `(modal)/modal/_component/Login.tsx`: 함수명과 UI는 로그인인데, 주석 `// 회원가입`과 `FormValues`의 `passwordConfirm`, `hobbies`는 회원가입 폼에서 복사된 흔적이다.
- `ErrorComponent`의 함수명 `Error` (전역 이름 가림).
- `UseEffectTest.tsx`의 `felx` 오타.
