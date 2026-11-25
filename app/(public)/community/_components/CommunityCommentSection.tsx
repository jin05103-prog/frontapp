"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import type { CommunityComment } from "@/types/community/community.type";
import { LOGIN_PATH } from "../_constants/feed";
import CommunityCommentForm from "./CommunityCommentForm";

interface CommunityCommentSectionProps {
    postId: string;
    initialComments: CommunityComment[];
    initialCount: number;
}

export default function CommunityCommentSection({ postId, initialComments, initialCount }: CommunityCommentSectionProps) {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [comments, setComments] = useState(initialComments);
    const [addedCount, setAddedCount] = useState(0);

    // 로그인한 사용자의 닉네임과 입력한 글을 목록 맨 위에 보여 줍니다. 비로그인이면 로그인 후 이 글로 돌아오도록 이동합니다.
    // 댓글 저장 API가 아직 없어 새로고침하면 사라집니다.
    const handleSubmit = (content: string) => {
        if (!isAuthenticated || !user) {
            router.push(`${LOGIN_PATH}?redirect=/community/${postId}`);
            return;
        }

        const nickname = user.user_nickname;
        setComments((current) => [
            { id: `local-${Date.now()}`, author: { name: nickname, avatar: nickname.slice(0, 1) }, content, postedAgo: "방금 전" },
            ...current,
        ]);
        setAddedCount((count) => count + 1);
    };

    const count = initialCount + addedCount;

    return (
        <section aria-labelledby="community-comments-title" className="mt-[22px]">
            <div className="flex items-baseline gap-3">
                <h2 id="community-comments-title" className="text-lg font-bold">따뜻한 응원</h2>
                <span className="text-sm font-bold text-brand-text">{count}</span>
                <span className="text-xs text-mute-light">서로를 배려하는 댓글을 남겨주세요</span>
            </div>

            <CommunityCommentForm onSubmit={handleSubmit} />

            <ul className="mt-5">
                {comments.map((comment) => (
                    <li key={comment.id} className="flex gap-3 border-b border-line py-[21px] first:pt-0 last:border-b-0 last:pb-0">
                        <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-placeholder text-sm">{comment.author.avatar}</span>
                        <div>
                            <p className="text-sm font-bold">{comment.author.name}</p>
                            <p className="mt-1.5 text-sm leading-[22px] whitespace-pre-line">{comment.content}</p>
                            <p className="mt-1.5 text-xs text-mute-light">{comment.postedAgo} · 답글 달기</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
