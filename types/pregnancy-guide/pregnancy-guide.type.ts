export type GuideCategory = "임신 준비" | "임신 생활" | "출산 준비" | "지원 혜택";

// 화면에서 사용하는 자료 형식입니다. 백엔드 DTO가 정해지면 응답을 이 형식에 맞춥니다.
export type GuideArticle = {
    id: string;
    category: GuideCategory;
    title: string;
    summary: string;
    sections: { title: string; content: string[] }[];
    source: { name: string; url: string; file: string; sheet: string; rows: string; collectedAt?: string };
};
