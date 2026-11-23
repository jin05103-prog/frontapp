"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

export default function CommunityCommentForm() {
    const [draft, setDraft] = useState("");
    const trimmed = draft.trim();

    // TODO: 댓글 등록 API가 준비되면 제출 시 저장 요청을 추가합니다. 현재는 입력값만 비웁니다.
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!trimmed) return;
        setDraft("");
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-4 rounded-2xl border border-[#E1E9E4] py-3 pr-3 pl-4">
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEF7F2]">🌱</span>
            <label htmlFor="community-comment" className="sr-only">응원의 댓글 작성</label>
            <input
                id="community-comment"
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="응원의 댓글을 남겨보세요"
                className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#98A89F]"
            />
            <button
                type="submit"
                disabled={!trimmed}
                aria-label="댓글 등록"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-40"
            >
                <Send aria-hidden="true" className="size-5" />
            </button>
        </form>
    );
}
