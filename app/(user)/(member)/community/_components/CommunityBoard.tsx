"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { CommunityCategory, CommunityPost } from "@/types/community/community.type";
import CommunityPostCard from "./CommunityPostCard";

type CommunityFeedCategory = "전체 피드" | CommunityCategory;
type CommunityTab = "popular" | "latest" | "following";

interface CommunityBoardProps {
    posts: CommunityPost[];
    aside: ReactNode;
}

const categories: CommunityFeedCategory[] = ["전체 피드", "임신 이야기", "육아 이야기", "우리 동네", "건강·병원", "살림·추천"];
const tabs: { key: CommunityTab; label: string }[] = [
    { key: "popular", label: "인기글" },
    { key: "latest", label: "최신글" },
    { key: "following", label: "팔로잉" },
];
const trendingTags = ["#임신28주", "#초유즙", "#이유식단계", "#수면교육"];

export default function CommunityBoard({ posts, aside }: CommunityBoardProps) {
    const [category, setCategory] = useState<CommunityFeedCategory>("전체 피드");
    const [tab, setTab] = useState<CommunityTab>("popular");
    const [query, setQuery] = useState("");

    const visiblePosts = useMemo(() => {
        const keyword = query.trim().toLocaleLowerCase();
        return posts
            .filter((post) => {
                const matchesCategory = category === "전체 피드" || post.category === category;
                const matchesTab = tab !== "following" || post.isFollowing;
                const searchText = [post.title, post.body, ...post.tags].join(" ").toLocaleLowerCase();
                return matchesCategory && matchesTab && searchText.includes(keyword);
            })
            .sort((a, b) => (tab === "latest" ? Date.parse(b.publishedAt) - Date.parse(a.publishedAt) : b.likes - a.likes));
    }, [posts, category, tab, query]);

    return (
        <div className="mt-10 grid grid-cols-[312px_minmax(0,1fr)_312px] items-start gap-6">
            <aside className="flex flex-col gap-7 rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
                <div className="relative">
                    <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#98A89F]" />
                    <label htmlFor="community-search" className="sr-only">궁금한 이야기 검색</label>
                    <input
                        id="community-search"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="궁금한 이야기를 찾아보세요"
                        className="h-12 w-full rounded-xl border border-[#E1E9E4] pr-4 pl-11 text-sm outline-none placeholder:text-[#98A89F] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                </div>

                <div>
                    <h2 className="text-sm font-bold">카테고리</h2>
                    <div role="group" aria-label="카테고리" className="mt-4 flex flex-col gap-1">
                        {categories.map((item) => (
                            <button
                                key={item}
                                type="button"
                                aria-pressed={category === item}
                                onClick={() => setCategory(item)}
                                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] transition-colors ${category === item ? "bg-[#E6F9F4] font-semibold text-primary" : "text-[#61766D] hover:bg-[#F4F7F5]"}`}
                            >
                                {item}
                                {category === item && <span aria-hidden="true">›</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold">요즘 많이 찾아요</h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {trendingTags.map((tag) => (
                            <button key={tag} type="button" onClick={() => setQuery(tag)} className="rounded-full bg-[#F4F7F5] px-3 py-2 text-xs text-[#61766D] hover:bg-[#E6F9F4]">{tag}</button>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl bg-[#E9FAF5] p-5">
                    <h3 className="text-sm font-bold">🔔 함께라서 더 든든해요</h3>
                    <p className="mt-2 text-xs leading-5 text-[#61766D]">궁금한 이야기가 생길 때마다<br />매일 새로운 소식을 받아보세요.</p>
                    <a href="/login" className="mt-4 inline-block text-xs font-semibold text-primary hover:underline">가입하고 둘러보기 →</a>
                </div>
            </aside>

            <section className="min-w-0">
                <div className="flex items-center justify-between">
                    <div role="tablist" aria-label="게시글 정렬" className="flex gap-7">
                        {tabs.map(({ key, label }) => (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={tab === key}
                                onClick={() => setTab(key)}
                                className={`border-b-2 pb-3 text-lg transition-colors ${tab === key ? "border-primary font-bold text-[#253B3A]" : "border-transparent text-[#8A9A90] hover:text-[#253B3A]"}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#E1E9E4] bg-white px-4 py-2.5 text-sm text-[#61766D] hover:bg-[#F4F7F5]">
                        <SlidersHorizontal aria-hidden="true" className="size-4" />
                        필터
                    </button>
                </div>
                <p className="mt-5 text-sm text-[#8A9A90]">{category} · 이야기 {visiblePosts.length}개</p>

                <div className="mt-5 flex flex-col gap-5">
                    {visiblePosts.map((post) => (
                        <CommunityPostCard key={post.id} post={post} />
                    ))}
                    {visiblePosts.length === 0 && (
                        <div className="rounded-3xl bg-white py-20 text-center">
                            <p className="text-lg font-semibold">아직 등록된 이야기가 없어요.</p>
                            <p className="mt-3 text-sm text-[#8A9A90]">다른 카테고리나 검색어로 다시 찾아보세요.</p>
                        </div>
                    )}
                </div>
            </section>

            {aside}
        </div>
    );
}
