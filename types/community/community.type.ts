export type CommunityBadge = "예비맘" | "아이맘";

export type CommunityCategory = "임신 이야기" | "육아 이야기" | "우리 동네" | "건강·병원" | "살림·추천";

export interface CommunityAuthor {
    name: string;
    avatar: string;
}

// 화면에서 사용하는 게시글 형식입니다. 백엔드 DTO가 정해지면 응답을 이 형식에 맞춥니다.
export interface CommunityPost {
    id: string;
    badge: CommunityBadge;
    category: CommunityCategory;
    title: string;
    body: string;
    tags: string[];
    author: CommunityAuthor;
    publishedAt: string;
    postedAgo: string;
    likes: number;
    comments: number;
    views: number;
    isFollowing: boolean;
}

export interface CommunityComment {
    id: string;
    author: CommunityAuthor;
    content: string;
    postedAgo: string;
}

// 게시글 상세 화면에서 사용하는 형식입니다.
export interface CommunityPostDetail extends CommunityPost {
    contents: string[];
    commentList: CommunityComment[];
}

export type CommunityPrefix = "질문" | "후기" | "정보 공유" | "일상";

export interface CommunityPostPayload {
    isPublic: boolean;
    category: CommunityCategory;
    prefix: CommunityPrefix | null;
    title: string;
    content: string;
}
