const pad = (value: number) => String(value).padStart(2, "0");

// 작성 시각을 상대 시간으로 표시합니다. 24시간 이상은 "N일 전", 7일을 넘기면 YYYY.MM.DD 입니다.
export const formatRelativeTime = (iso: string, now: number = Date.now()): string => {
    const minutes = Math.floor(Math.max(0, now - Date.parse(iso)) / 60_000);
    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;

    const days = Math.floor(hours / 24);
    if (days <= 7) return `${days}일 전`;

    const date = new Date(iso);
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
};

export const formatPrice = (price: number): string => `${price.toLocaleString("ko-KR")}원`;

// 좋아요·댓글 수는 999를 넘으면 "999+" 로 줄여 표시합니다.
export const formatCount = (count: number): string => (count > 999 ? "999+" : String(count));
