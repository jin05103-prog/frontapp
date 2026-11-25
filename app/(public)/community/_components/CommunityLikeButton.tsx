"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { isPostLiked, subscribeLocalStore, togglePostLiked } from "@/lib/communityLocalStore";
import { FOCUS_RING } from "../_constants/feed";

interface CommunityLikeButtonProps {
    postId: string;
    baseLikes: number;
}

// 누르면 하트가 채워지고 공감 수가 1 늘어납니다. 다시 누르면 원래대로 돌아갑니다.
export default function CommunityLikeButton({ postId, baseLikes }: CommunityLikeButtonProps) {
    const liked = useSyncExternalStore(subscribeLocalStore, () => isPostLiked(postId), () => false);

    return (
        <button
            type="button"
            aria-pressed={liked}
            aria-label={liked ? "공감 취소" : "공감하기"}
            onClick={() => togglePostLiked(postId)}
            className={`flex items-center gap-1.5 rounded-feed-sm ${FOCUS_RING} ${liked ? "text-sale" : "hover:text-ink"}`}
        >
            <Heart aria-hidden="true" className={`size-3.5 ${liked ? "fill-sale" : ""}`} />
            공감 {baseLikes + (liked ? 1 : 0)}
        </button>
    );
}
