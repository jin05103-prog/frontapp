import { mockPopularProducts, queryMockPosts } from "@/app/(public)/community/_mock/posts";
import { getLikedIds, getLocalPosts } from "@/lib/communityLocalStore";
import type { FeedPostListParams, FeedPostListResponse, PopularProduct } from "@/types/community/communityFeed.type";

const MOCK_LATENCY_MS = 400;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// 백엔드 API(GET /api/posts)가 준비되면 이 함수 본문을 fetch 로 바꿉니다. 시그니처와 타입은 그대로 둡니다.
export const getFeedPosts = async (params: FeedPostListParams): Promise<FeedPostListResponse> => {
    await wait(MOCK_LATENCY_MS);

    // 이 브라우저에서 새로 쓴 글을 함께 보여 주고, 내가 누른 좋아요를 공감 수에 더합니다.
    const response = queryMockPosts(params, getLocalPosts());
    const likedIds = new Set(getLikedIds());
    return {
        ...response,
        items: response.items.map((post) => (likedIds.has(String(post.id)) ? { ...post, likeCount: post.likeCount + 1 } : post)),
    };
};

export const getPopularProducts = async (): Promise<PopularProduct[]> => {
    await wait(MOCK_LATENCY_MS);
    return mockPopularProducts;
};
