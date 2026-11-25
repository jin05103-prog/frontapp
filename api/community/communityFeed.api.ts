import { mockPopularProducts, queryMockPosts } from "@/app/(public)/community/_mock/posts";
import type { FeedPostListParams, FeedPostListResponse, PopularProduct } from "@/types/community/communityFeed.type";

const MOCK_LATENCY_MS = 400;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// 백엔드 API(GET /api/posts)가 준비되면 이 함수 본문을 fetch 로 바꿉니다. 시그니처와 타입은 그대로 둡니다.
export const getFeedPosts = async (params: FeedPostListParams): Promise<FeedPostListResponse> => {
    await wait(MOCK_LATENCY_MS);
    return queryMockPosts(params);
};

export const getPopularProducts = async (): Promise<PopularProduct[]> => {
    await wait(MOCK_LATENCY_MS);
    return mockPopularProducts;
};
