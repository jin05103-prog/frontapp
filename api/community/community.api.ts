import { findMockPostById } from "@/app/(public)/community/_mock/posts";
import { formatRelativeTime } from "@/lib/format";
import type { CommunityCategory, CommunityPost, CommunityPostDetail, CommunityPostPayload } from "@/types/community/community.type";
import type { FeedPost } from "@/types/community/communityFeed.type";

const feedCategoryLabels: Record<FeedPost["category"], CommunityCategory> = {
    pregnancy: "임신 이야기",
    parenting: "육아 이야기",
    neighborhood: "우리 동네",
    health: "건강·병원",
    living: "살림·추천",
};

// 피드 목록(FeedPost)의 글을 상세 화면 형식으로 바꿉니다. 본문과 댓글은 아직 API가 없어 비워 둡니다.
const toPostDetail = (post: FeedPost): CommunityPostDetail => {
    const category = feedCategoryLabels[post.category];

    return {
        id: String(post.id),
        badge: post.authorTag === "예비맘" ? "예비맘" : "아이맘",
        category,
        title: post.title,
        body: post.title,
        tags: [`#${category}`],
        author: { name: post.authorName, avatar: post.authorName.slice(0, 1) },
        publishedAt: post.createdAt,
        postedAgo: formatRelativeTime(post.createdAt),
        likes: post.likeCount,
        comments: post.commentCount,
        isFollowing: false,
        contents: [post.title],
        commentList: [],
    };
};

const communityPostsMock: CommunityPost[] = [
    {
        id: "1",
        badge: "예비맘",
        category: "임신 이야기",
        title: "오늘 정밀 초음파 보고 왔어요! 건강하게 잘 크고 있대요 😘",
        body: "매일 조금씩 자라는 모습을 볼 때마다 참 신기하고 고마워요.\n비슷한 경험 있으신 분들 이야기 들려주세요!",
        tags: ["#임신 28주", "#함께해요"],
        author: { name: "초코라떼맘", avatar: "🍫" },
        publishedAt: "2026-11-23T09:25:00+09:00",
        postedAgo: "35분 전",
        likes: 42,
        comments: 13,
        isFollowing: true,
    },
    {
        id: "2",
        badge: "아이맘",
        category: "육아 이야기",
        title: "우리 아이가 이뻐요. 이뻐도 너무 이쁜 거 아니에요?",
        body: "매일 조금씩 자라는 모습을 볼 때마다 참 신기하고 고마워요.\n비슷한 경험 있으신 분들 이야기 들려주세요!",
        tags: ["#육아 팁", "#함께해요"],
        author: { name: "포근한토리", avatar: "🌰" },
        publishedAt: "2026-11-23T09:48:00+09:00",
        postedAgo: "12분 전",
        likes: 28,
        comments: 6,
        isFollowing: true,
    },
    {
        id: "3",
        badge: "예비맘",
        category: "우리 동네",
        title: "동네 산부인과 야간 진료 가능한 곳 아시는 분?",
        body: "퇴근 후에도 편하게 다닐 수 있는 곳을 찾고 있어요.\n다녀보신 후기도 함께 나눠 주세요!",
        tags: ["#우리동네", "#병원추천"],
        author: { name: "동그람이", avatar: "🌙" },
        publishedAt: "2026-11-23T09:00:00+09:00",
        postedAgo: "1시간 전",
        likes: 19,
        comments: 8,
        isFollowing: false,
    },
    {
        id: "4",
        badge: "아이맘",
        category: "살림·추천",
        title: "수면교육 입문서 추천해 주세요",
        body: "밤잠을 조금씩 늘려 보고 싶은데 어떤 책이 도움이 됐는지 궁금해요.",
        tags: ["#수면교육", "#추천"],
        author: { name: "살구잼", avatar: "🍑" },
        publishedAt: "2026-11-23T07:00:00+09:00",
        postedAgo: "3시간 전",
        likes: 15,
        comments: 4,
        isFollowing: true,
    },
];

// TODO: 백엔드 커뮤니티 게시글 API가 준비되면 fetch로 교체합니다. 현재는 목업 데이터를 반환합니다.
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
    return communityPostsMock;
};

// 상세 화면용 목업입니다. 본문 문단과 댓글은 첫 번째 게시글만 준비되어 있습니다.
export const getCommunityPost = async (postId: string): Promise<CommunityPostDetail | null> => {
    const post = communityPostsMock.find((item) => item.id === postId);
    if (!post) {
        // 피드 목록(communityFeed.api)의 글은 숫자 id 를 쓰므로 여기서도 찾아 봅니다.
        const feedPost = findMockPostById(Number(postId));
        return feedPost ? toPostDetail(feedPost) : null;
    }

    return {
        ...post,
        contents: postId === "1"
            ? [
                "오늘 드디어 정밀 초음파를 보고 왔어요. 검사 전에는 꽤 긴장했는데, 아기가 주수에 맞게 잘 자라고 있다는 말에 마음이 놓였어요.",
                "초음파 화면에서 꼼지락거리는 모습을 보는데 벌써 이렇게 많이 컸나 싶더라고요. 비슷한 시기 예비맘들은 요즘 어떤 하루 보내고 계세요? 서로 응원해요 💚",
            ]
            : post.body.split("\n"),
        commentList: postId === "1"
            ? [
                { id: "c1", author: { name: "따뜻한햇살", avatar: "🌸" }, content: "저도 오늘 같은 검사 받고 왔어요. 건강하다는 말 들으면 정말 안심되죠 💚", postedAgo: "방금 전" },
                { id: "c2", author: { name: "아기별맘", avatar: "🌿" }, content: "아기랑 만날 날이 더 기대되네요! 축하드려요 🎉", postedAgo: "10분 전" },
            ]
            : [],
    };
};

// TODO: 백엔드 게시글 등록 API가 준비되면 POST 요청으로 교체합니다. 현재는 저장하지 않습니다.
export const createCommunityPost = async (payload: CommunityPostPayload): Promise<void> => {
    void payload;
};
