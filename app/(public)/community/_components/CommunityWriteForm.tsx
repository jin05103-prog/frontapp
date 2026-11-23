"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createCommunityPost } from "@/api/community/community.api";
import type { CommunityCategory, CommunityPrefix } from "@/types/community/community.type";

interface CommunityWriteFormProps {
    formId: string;
}

const boards: CommunityCategory[] = ["임신 이야기", "육아 이야기", "우리 동네", "건강·병원", "살림·추천"];
const prefixes: CommunityPrefix[] = ["질문", "후기", "정보 공유", "일상"];
const toolbarItems = [
    { label: "사진", icon: "📷" },
    { label: "동영상", icon: "🎥" },
    { label: "스티커", icon: "😊" },
    { label: "인용구", icon: "❝" },
    { label: "구분선", icon: "—" },
    { label: "파일", icon: "📎" },
    { label: "링크", icon: "🔗" },
    { label: "장소", icon: "📍" },
    { label: "일정", icon: "📅" },
    { label: "투표", icon: "📊" },
];

export default function CommunityWriteForm({ formId }: CommunityWriteFormProps) {
    const router = useRouter();
    const [isPublic, setIsPublic] = useState(true);
    const [category, setCategory] = useState<CommunityCategory>("임신 이야기");
    const [prefix, setPrefix] = useState<CommunityPrefix | "">("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !isSubmitting;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);
        try {
            await createCommunityPost({
                isPublic,
                category,
                prefix: prefix || null,
                title: title.trim(),
                content: content.trim(),
            });
            router.push("/community");
        } catch {
            setIsSubmitting(false);
            window.alert("게시글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="rounded-3xl bg-white p-10 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-lg font-bold">공개 설정</h2>
                    <p className="mt-2 text-sm text-[#8A9A90]">커뮤니티 멤버에게만 보여요. 검색에는 노출되지 않습니다.</p>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={isPublic}
                    aria-label="커뮤니티 멤버에게 공개"
                    onClick={() => setIsPublic((prev) => !prev)}
                    className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${isPublic ? "bg-primary" : "bg-[#D5DDD8]"}`}
                >
                    <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition-all ${isPublic ? "left-7" : "left-1"}`} />
                </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="community-board" className="text-sm font-bold">게시판</label>
                    <select
                        id="community-board"
                        value={category}
                        onChange={(event) => setCategory(event.target.value as CommunityCategory)}
                        className="mt-3 h-14 w-full rounded-xl border border-[#E1E9E4] bg-white px-5 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    >
                        {boards.map((board) => <option key={board} value={board}>{board}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="community-prefix" className="text-sm font-bold">말머리</label>
                    <select
                        id="community-prefix"
                        value={prefix}
                        onChange={(event) => setPrefix(event.target.value as CommunityPrefix | "")}
                        className="mt-3 h-14 w-full rounded-xl border border-[#E1E9E4] bg-white px-5 text-base text-[#253B3A] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    >
                        <option value="">말머리를 선택해 주세요</option>
                        {prefixes.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>
            </div>

            <div className="mt-8">
                <label htmlFor="community-title" className="text-sm font-bold">제목</label>
                <input
                    id="community-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="어떤 이야기를 나누고 싶으세요?"
                    className="mt-3 h-14 w-full rounded-xl border border-[#E1E9E4] px-5 text-base outline-none placeholder:text-[#98A89F] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
            </div>

            <div className="mt-8">
                <span className="text-sm font-bold">내용</span>
                <div role="toolbar" aria-label="본문 도구" className="mt-3 flex flex-wrap gap-2 rounded-t-xl border border-b-0 border-[#E1E9E4] px-4 pt-4 pb-3">
                    {toolbarItems.map((item) => (
                        <button key={item.label} type="button" className="flex w-16 flex-col items-center gap-1 rounded-lg py-2 text-xs text-[#61766D] hover:bg-[#F4F7F5]">
                            <span aria-hidden="true" className="text-base">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
                <label htmlFor="community-content" className="sr-only">내용</label>
                <textarea
                    id="community-content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="경험이나 궁금한 점을 자유롭게 적어주세요."
                    className="min-h-[560px] w-full resize-y rounded-b-xl border border-[#E1E9E4] p-6 text-lg leading-8 outline-none placeholder:text-[#98A89F] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
            </div>
        </form>
    );
}
