"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

interface CommunityCommentFormProps {
    onSubmit: (content: string) => void;
}

export default function CommunityCommentForm({ onSubmit }: CommunityCommentFormProps) {
    const [draft, setDraft] = useState("");
    const trimmed = draft.trim();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!trimmed) return;
        onSubmit(trimmed);
        setDraft("");
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3 flex h-[60px] items-center gap-3 rounded-feed-lg border border-line pr-2.5 pl-3.5">
            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-placeholder text-sm">🌱</span>
            <label htmlFor="community-comment" className="sr-only">응원의 댓글 작성</label>
            <input
                id="community-comment"
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="응원의 댓글을 남겨보세요"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-mute-light focus-visible:outline-2 focus-visible:outline-brand-text"
            />
            <button
                type="submit"
                disabled={!trimmed}
                aria-label="댓글 등록"
                className="flex size-10 shrink-0 items-center justify-center rounded-feed-md bg-primary text-white hover:bg-brand-hover disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text"
            >
                <Send aria-hidden="true" className="size-4" />
            </button>
        </form>
    );
}
