import Link from "next/link";
import { Plus } from "lucide-react";
import { FOCUS_RING, LOGIN_PATH, WRITE_POST_PATH } from "../_constants/feed";

interface WritePostButtonProps {
    isLoggedIn: boolean;
}

// 비로그인 상태에서도 숨기거나 비활성화하지 않고, 로그인 후 돌아올 경로를 붙여 로그인으로 보냅니다.
export const getWritePostHref = (isLoggedIn: boolean) => (isLoggedIn ? WRITE_POST_PATH : `${LOGIN_PATH}?redirect=${WRITE_POST_PATH}`);

export default function WritePostButton({ isLoggedIn }: WritePostButtonProps) {
    return (
        <Link
            href={getWritePostHref(isLoggedIn)}
            className={`inline-flex h-[52px] w-[170px] items-center justify-center gap-2 rounded-full bg-primary text-base font-bold text-white transition-colors hover:bg-brand-hover ${FOCUS_RING}`}
        >
            <Plus aria-hidden="true" className="size-4" />
            이야기 나누기
        </Link>
    );
}
