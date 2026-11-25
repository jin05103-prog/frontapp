"use client";

import { useEffect, useRef, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFeedPosts, getPopularProducts } from "@/api/community/communityFeed.api";
import useAuthStore from "@/stores/useAuthStore";
import type { FeedCategoryId, FeedSort } from "@/types/community/communityFeed.type";
import {
    FEED_CATEGORIES,
    FEED_PAGE_SIZE,
    INITIAL_VISIBLE_COUNT,
    LOAD_MORE_COUNT,
    LOAD_MORE_DELAY_MS,
    SCROLL_SETTLE_MS,
    SEARCH_DEBOUNCE_MS,
} from "../_constants/feed";
import useHydrated from "../_hooks/useHydrated";
import CategoryList from "./CategoryList";
import DailyQuoteCard from "./DailyQuoteCard";
import JoinPromoBanner from "./JoinPromoBanner";
import Pagination from "./Pagination";
import PopularProductCard from "./PopularProductCard";
import PostList from "./PostList";
import PostSearchInput from "./PostSearchInput";
import SortTabs from "./SortTabs";
import WritePostButton, { getWritePostHref } from "./WritePostButton";

const DAILY_QUOTE = "완벽하지 않아도 괜찮아요.\n오늘도 충분히 잘하고 있어요. 💛";

// 3단 레이아웃입니다. 좌측 패널, 중앙 목록, 우측 패널이 모두 구현되어 있습니다.
// 폭: 좌 294 / 중앙 682 / 우 288, 단 사이 간격 28 (Desktop N 콘텐츠 1320).
export default function CommunityLayout() {
    const [searchInput, setSearchInput] = useState("");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<FeedCategoryId>("all");
    const [sort, setSort] = useState<FeedSort>("popular");
    const [page, setPage] = useState(1);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [loadingMore, setLoadingMore] = useState(false);

    const centerRef = useRef<HTMLElement>(null);
    const listEndRef = useRef<HTMLDivElement>(null);
    const ignoreScrollUntilRef = useRef(0);

    const hydrated = useHydrated();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoggedIn = hydrated && isAuthenticated;

    const posts = useQuery({
        queryKey: ["community", "posts", { category, sort, q: query, page }],
        queryFn: () => getFeedPosts({ category, sort, q: query, page, size: FEED_PAGE_SIZE }),
        placeholderData: keepPreviousData,
        retry: false,
    });

    const products = useQuery({
        queryKey: ["community", "popular-products"],
        queryFn: getPopularProducts,
    });

    const items = posts.data?.items ?? [];
    // 카테고리·정렬·페이지·검색어가 바뀌면 이전 데이터를 보여 주지 않고 스켈레톤을 보여 줍니다.
    const loading = posts.isPending || posts.isPlaceholderData;
    const canLoadMore = !loading && !posts.isError && items.length > visibleCount;
    const visibleItems = items.slice(0, visibleCount);
    const loadingMoreCount = loadingMore ? Math.min(LOAD_MORE_COUNT, items.length - visibleCount) : 0;

    const resetView = () => {
        setPage(1);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setLoadingMore(false);
    };

    // 검색어는 입력 후 SEARCH_DEBOUNCE_MS 뒤에 반영합니다. 공백만 입력하면 요청하지 않고 직전 목록을 유지합니다.
    useEffect(() => {
        const timer = window.setTimeout(() => {
            const next = searchInput.trim();
            if (searchInput !== "" && next === "") return;
            setQuery(next);
            setPage(1);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
            setLoadingMore(false);
        }, SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(timer);
    }, [searchInput]);

    // 사용자가 아래로 스크롤해 목록 하단에 닿으면 다음 5개를 이어서 보여 줍니다. 스크롤하기 전에는 동작하지 않습니다.
    // 페이지 이동으로 인한 스크롤 위치 보정은 무시하고, 스크롤할 공간이 없는 큰 화면을 위해 휠 입력도 함께 봅니다.
    useEffect(() => {
        if (!canLoadMore || loadingMore) return;

        let lastScrollY = window.scrollY;
        const requestMore = () => {
            const end = listEndRef.current;
            if (Date.now() < ignoreScrollUntilRef.current) return;
            if (end && end.getBoundingClientRect().top <= window.innerHeight) setLoadingMore(true);
        };
        const handleScroll = () => {
            const scrolledDown = window.scrollY > lastScrollY;
            lastScrollY = window.scrollY;
            if (scrolledDown) requestMore();
        };
        const handleWheel = (event: WheelEvent) => {
            if (event.deltaY > 0) requestMore();
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("wheel", handleWheel, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleWheel);
        };
    }, [canLoadMore, loadingMore]);

    useEffect(() => {
        if (!loadingMore) return;

        const timer = window.setTimeout(() => {
            setVisibleCount((count) => count + LOAD_MORE_COUNT);
            setLoadingMore(false);
        }, LOAD_MORE_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [loadingMore]);

    // 이미 선택된 카테고리를 다시 눌러도 해제되지 않고 아무 변화도 없습니다.
    const handleCategorySelect = (id: FeedCategoryId) => {
        if (id === category) return;
        setCategory(id);
        resetView();
    };

    const handleSortChange = (value: FeedSort) => {
        if (value === sort) return;
        setSort(value);
        resetView();
    };

    const handlePageChange = (nextPage: number) => {
        if (nextPage === page) return;
        setPage(nextPage);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        setLoadingMore(false);
        ignoreScrollUntilRef.current = Date.now() + SCROLL_SETTLE_MS;
        centerRef.current?.scrollIntoView({ block: "start" });
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setQuery("");
        resetView();
    };

    return (
        <div className="relative mt-[30px] pb-16">
            <div className="absolute -top-[26px] right-0">
                <WritePostButton isLoggedIn={isLoggedIn} />
            </div>

            <div className="grid grid-cols-[294px_682px_288px] items-start gap-7">
                <aside
                    aria-label="카테고리 및 검색"
                    className="sticky top-26 flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto rounded-feed-lg border border-line bg-surface px-5 pt-9 pb-5"
                >
                    <PostSearchInput value={searchInput} onChange={setSearchInput} placeholder="궁금한 이야기를 찾아보세요" />
                    <div className="mt-[26px]">
                        <CategoryList items={FEED_CATEGORIES} activeId={category} onSelect={handleCategorySelect} />
                    </div>
                    {/* 로그인 상태에서는 렌더하지 않습니다. 하이드레이션 전에는 로그인 여부를 몰라 렌더를 미룹니다. */}
                    {hydrated && !isAuthenticated && (
                        <div className="mt-20">
                            <JoinPromoBanner />
                        </div>
                    )}
                </aside>

                <section ref={centerRef} aria-label="게시글 목록" className="min-w-0 scroll-mt-26">
                    <SortTabs value={sort} onChange={handleSortChange} />
                    <p aria-live="polite" className="sr-only">
                        {!loading && !posts.isError && `${posts.data?.totalCount ?? 0}개의 이야기가 있어요`}
                    </p>

                    <div className="mt-[18px]">
                        <PostList
                            posts={visibleItems}
                            loading={loading}
                            loadingMoreCount={loadingMoreCount}
                            error={posts.isError}
                            searchQuery={query}
                            writeHref={getWritePostHref(isLoggedIn)}
                            onRetry={() => posts.refetch()}
                            onClearSearch={handleClearSearch}
                        />
                    </div>
                    <div ref={listEndRef} aria-hidden="true" className="h-px" />

                    {!loading && !posts.isError && items.length > 0 && (
                        <div className="mt-[38px]">
                            <Pagination page={posts.data?.page ?? page} totalPages={posts.data?.totalPages ?? 1} onChange={handlePageChange} />
                        </div>
                    )}
                </section>

                <aside aria-label="추천 정보" className="sticky top-26 mt-[61px] flex max-h-[calc(100vh-8rem)] flex-col gap-[17px] overflow-y-auto">
                    <DailyQuoteCard message={DAILY_QUOTE} />
                    <PopularProductCard products={products.data ?? []} />
                </aside>
            </div>
        </div>
    );
}
