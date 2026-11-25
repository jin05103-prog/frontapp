# 디자인 토큰 — NESTEP (kdt_1조)

| 항목 | 값 |
|---|---|
| 적용 범위 | 전 화면 공통 |
| 기준 프레임 | 1920 × 1080 |
| 최종 수정 | 2026-11-25 |

---

## 사용 원칙

1. **실사용 값이 정본이다.** 초기 스타일 가이드와 다른 항목이 있으나, 실제 화면에 쓰인 값을 기준으로 한다. 가이드 원본 값은 맨 아래 부록에만 남긴다.
2. **색상·간격·크기는 반드시 이 문서의 토큰을 쓴다.** 코드에 HEX나 px를 직접 적지 않는다.
3. **여기에 없는 값이 필요하면 임의로 만들지 말고 질문한다.** 새 토큰이 필요하다고 판단되면 그 사실을 보고한다.
4. 화면별 레이아웃 수치(단 폭, 카드 크기 등)는 이 문서가 아니라 `docs/screens/<화면>.md` 에 둔다.

---

## Color

### 브랜드

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-brand` | `#00CBA8` | 로고, 주요 CTA 배경 |
| `--color-brand-hover` | `#00C6A5` | CTA 호버 |
| `--color-brand-dark` | `#009A80` | 헤더 활성 메뉴 |
| `--color-brand-text` | `#00A98D` | 링크, 선택된 항목 텍스트, 순위 숫자 |
| `--color-brand-subtle` | `#E8F8F4` | 선택된 항목 배경, 강조 영역 배경 |

### 텍스트

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-text` | `#27313A` | 본문, 제목 |
| `--color-muted` | `#7F8A90` | 보조 텍스트, 아이콘 |
| `--color-muted-light` | `#9AA4AA` | 비활성 탭, 기준 시각 등 최하위 정보 |

> `--color-muted-light`는 12px 이하 본문에 쓰지 않는다. 대비가 부족하다.

### 면과 선

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-surface` | `#FFFFFF` | 카드·패널 배경 |
| `--color-surface-alt` | `#F7F8FA` | 호버 배경, 보조 영역 |
| `--color-border` | `#ECEEF3` | 카드 테두리, 구분선 |
| `--color-placeholder` | `#EEF1F3` | 이미지 자리표시 |

### 태그

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-tag-mom-text` | `#00A98D` | 예비맘 글자 |
| `--color-tag-mom-bg` | `#E8F8F4` | 예비맘 배경 |
| `--color-tag-parent-text` | `#8E6FB8` | 육아맘 글자 |
| `--color-tag-parent-bg` | `#F2ECFA` | 육아맘 배경 |

### 프로모션 배너

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-promo-bg` | `#EBE7FF` | 가입 유도 배너 배경 |
| `--color-promo-title` | `#2E2640` | 배너 제목 |
| `--color-promo-body` | `#6B6385` | 배너 본문 |
| `--color-promo-link` | `#6B4E9B` | 배너 링크 |

### 카테고리 식별 색

좌측 카테고리 목록의 점, 그리고 해당 카테고리를 나타내는 모든 지점에 동일하게 쓴다.

| 토큰 | 값 | 카테고리 |
|---|---|---|
| `--color-cat-all` | `#00A98D` | 전체 피드 |
| `--color-cat-pregnancy` | `#5BA9D6` | 임신 이야기 |
| `--color-cat-parenting` | `#8E6FB8` | 육아 이야기 |
| `--color-cat-neighborhood` | `#E8A05C` | 우리 동네 |
| `--color-cat-health` | `#E0808F` | 건강·병원 |
| `--color-cat-living` | `#6BBF93` | 살림·추천 |

### 기능 색

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-sale` | `#E0808F` | 할인율 |
| `--color-warning` | `#E0808F` | 경고·삭제 버튼 |

> 할인율과 경고가 같은 값이다. 의미가 다르므로 토큰은 분리해 두고, 한쪽이 바뀌어도 다른 쪽에 영향이 없게 한다.

---

## Typography

```
font-family: NanumSquareRound, Pretendard, -apple-system, sans-serif
```

| 토큰 | 크기 | 굵기 | 용도 |
|---|---|---|---|
| `--text-h1` | 56 | ExtraBold | — |
| `--text-h2` | 48 | ExtraBold | 페이지 제목 |
| `--text-h3` | 32 | ExtraBold | — |
| `--text-h4` | 26 | ExtraBold | — |
| `--text-h5` | 24 | ExtraBold | — |
| `--text-h6` | 20 | ExtraBold | — |
| `--text-title` | 18 | Regular | 큰 버튼 |
| `--text-subtitle` | 16 | Regular | — |
| `--text-body` | 16 | Regular | 본문, 목록 항목, 게시글 제목 |
| `--text-body-strong` | 14 | Bold | 모듈 제목, 버튼 |
| `--text-small` | 14 | Regular | 브레드크럼, 보조 설명 |
| `--text-caption` | 12 | Regular | 작성자명, 카운트, 상품명 |
| `--text-micro` | 10 | Bold | 태그 칩, 기준 시각 |

> `--text-caption`과 `--text-micro`는 초기 가이드에 없었으나 화면에서 실제로 쓰이고 있다. 가이드 최소 크기(14)만으로는 디자인을 재현할 수 없어 두 단계를 추가했다.

행간은 지정하지 않으면 `1.5`를 쓴다. 태그 칩처럼 높이가 고정된 요소는 해당 화면 명세의 값을 따른다.

---

## Spacing

4의 배수를 쓴다.

| 토큰 | 값 | 주 용도 |
|---|---|---|
| `--space-1` | 4 | 아이콘과 숫자 사이 |
| `--space-2` | 8 | 칩 내부 좌우 |
| `--space-3` | 12 | 인풋 내부 상하 |
| `--space-4` | 16 | 인풋 내부 좌우 |
| `--space-5` | 20 | 카드 내부 패딩 |
| `--space-6` | 24 | 그리드 거터 |
| `--space-7` | 28 | 단 사이 간격 |
| `--space-8` | 32 | 섹션 사이 |
| `--space-10` | 40 | — |
| `--space-12` | 48 | — |
| `--space-14` | 56 | 큰 섹션 사이 |

---

## Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius-sm` | 5 | 인풋 |
| `--radius-md` | 8 | 썸네일, 소형 카드 |
| `--radius-lg` | 14 | 패널·콘텐츠 카드 |
| `--radius-pill` | 999 | 태그 칩, 메인 CTA |

---

## Shadow

**사용하지 않는다.**

면의 구분은 `--color-border` 1px 테두리로 한다. 디자인에 없는 그림자를 임의로 추가하지 않는다.

---

## Grid

| 프리셋 | 프레임 | 컬럼 | margin | gutter | content |
|---|---|---|---|---|---|
| Desktop | 1920 | 12 | 240 | 24 | 1440 |
| **Desktop N** | **1920** | **12** | **300** | **24** | **1320** |
| Mobile | 360 | 6 | 20 | 16 | 320 |

현재 작업 중인 화면은 **Desktop N**을 사용한다. 모바일 대응은 아직 범위 밖이다.

---

## Z-index

| 토큰 | 값 | 용도 |
|---|---|---|
| `--z-base` | 0 | 일반 콘텐츠 |
| `--z-sticky` | 10 | sticky 사이드 패널 |
| `--z-header` | 50 | 전역 헤더 |
| `--z-dropdown` | 80 | 드롭다운, 툴팁 |
| `--z-modal` | 100 | 모달, 다이얼로그 |

이 외의 값을 임의로 쓰지 않는다.

---

## Button

padding은 `상하 / 좌우`다.

| 크기 | padding | 글자 |
|---|---|---|
| Small | 8 / 16 | `--text-small` (14) |
| Normal | 10 / 50 | `--text-body` (16) |
| Large | 14 / 80 | `--text-title` (18) |
| Full | 20 / — | `--text-title` (18), width 100% |

**상태** — Normal / Hover / Active / Disabled
**종류** — Default(아웃라인) / Primary Light / Primary(솔리드) / Warning

| 종류 | 배경 | 글자 | 테두리 |
|---|---|---|---|
| Default | `--color-surface` | `--color-text` | 1px `--color-border` |
| Primary Light | `--color-brand-subtle` | `--color-brand-text` | 없음 |
| Primary | `--color-brand` | `--color-surface` | 없음 |
| Warning | `--color-warning` | `--color-surface` | 없음 |

Disabled는 opacity 40%, 커서 `not-allowed`.

---

## Input

| 항목 | 값 |
|---|---|
| height | 42 |
| min-width | 200 |
| padding | 12 / 16 |
| gap | 10 |
| radius | `--radius-sm` (5) |
| border | 1px `#8D8D8D` |
| icon | 22 × 22, padding 10 |

**상태** — Normal / Hover / Active / Value / Success / Error / Disabled

---

## 적용 방법 (Tailwind v4)

`app/globals.css`에 아래와 같이 선언한다. 토큰명은 이 문서와 **동일하게** 유지한다.

```css
@import "tailwindcss";

@theme {
  /* Color — brand */
  --color-brand: #00CBA8;
  --color-brand-hover: #00C6A5;
  --color-brand-dark: #009A80;
  --color-brand-text: #00A98D;
  --color-brand-subtle: #E8F8F4;

  /* Color — text */
  --color-text: #27313A;
  --color-muted: #7F8A90;
  --color-muted-light: #9AA4AA;

  /* Color — surface */
  --color-surface: #FFFFFF;
  --color-surface-alt: #F7F8FA;
  --color-border: #ECEEF3;
  --color-placeholder: #EEF1F3;

  /* Color — tag */
  --color-tag-mom-text: #00A98D;
  --color-tag-mom-bg: #E8F8F4;
  --color-tag-parent-text: #8E6FB8;
  --color-tag-parent-bg: #F2ECFA;

  /* Color — promo */
  --color-promo-bg: #EBE7FF;
  --color-promo-title: #2E2640;
  --color-promo-body: #6B6385;
  --color-promo-link: #6B4E9B;

  /* Color — category */
  --color-cat-all: #00A98D;
  --color-cat-pregnancy: #5BA9D6;
  --color-cat-parenting: #8E6FB8;
  --color-cat-neighborhood: #E8A05C;
  --color-cat-health: #E0808F;
  --color-cat-living: #6BBF93;

  /* Color — functional */
  --color-sale: #E0808F;
  --color-warning: #E0808F;

  /* Typography */
  --font-sans: NanumSquareRound, Pretendard, sans-serif;
  --text-micro: 0.625rem;   /* 10 */
  --text-caption: 0.75rem;  /* 12 */
  --text-small: 0.875rem;   /* 14 */
  --text-body: 1rem;        /* 16 */
  --text-title: 1.125rem;   /* 18 */

  /* Radius */
  --radius-sm: 5px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-pill: 999px;
}
```

선언 후에는 `bg-brand`, `text-brand-text`, `border-border`, `rounded-lg`, `text-caption` 처럼 클래스로 사용한다.

```tsx
// 올바른 예
<span className="bg-tag-mom-bg text-tag-mom-text text-micro rounded-pill px-2">
  예비맘
</span>

// 금지
<span style={{ background: '#E8F8F4', color: '#00A98D' }}>예비맘</span>
<span className="bg-[#E8F8F4] text-[#00A98D]">예비맘</span>
```

---

## 금지

- HEX 값을 코드에 직접 적지 않는다. Tailwind 임의값(`bg-[#...]`) 도 금지다.
- 이 문서에 없는 색·크기를 만들지 않는다. 필요하면 먼저 질문한다.
- 그림자, 그라데이션을 임의로 추가하지 않는다.
- 토큰명을 코드에서 다르게 바꾸지 않는다. 문서와 코드가 어긋나면 문서가 죽는다.

---

## 부록 — 초기 스타일 가이드 원본값

실제 화면과 달라 **사용하지 않는다.** 이력 확인용으로만 남긴다.

| 토큰 | 가이드 값 | 실사용 값 | 비고 |
|---|---|---|---|
| brand | `#00CBAB` | `#00CBA8` | 끝자리 차이 |
| brand-dark | `#14A857` | `#009A80` | 색상 계열 자체가 다름 |
| brand-light | `#B6F2D1` | 미사용 | — |
| accent-purple | `#907EFF` | `#8E6FB8` | 채도를 낮춰 사용 |
| accent-yellow | `#FFEC6B` | 확인 필요 | "오늘의 한마디" 배경 실측 필요 |
| text | `#000000` | `#27313A` | 순수 검정은 쓰지 않음 |
| border | `#E7ECEA` | `#ECEEF3` | — |

---

## 확인 필요

| # | 항목 | 현재 값 | 확인할 것 |
|---|---|---|---|
| 1 | "오늘의 한마디" 배경 | 미정 | 실제 HEX 확인 후 `--color-quote-bg`로 등록 |
| 2 | 폰트 로드 방식 | 미정 | NanumSquareRound 웹폰트 경로. Pretendard는 대체용인지 |
| 3 | Mobile 그리드 | 360 / 6col | 모바일 대응 시점 |
| 4 | Disabled 스타일 | opacity 40% | 디자인에 정의된 값이 따로 있는지 |