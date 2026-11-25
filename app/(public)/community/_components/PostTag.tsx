import type { FeedAuthorTag } from "@/types/community/communityFeed.type";

interface PostTagProps {
    type: FeedAuthorTag;
}

const tagStyles: Record<FeedAuthorTag, string> = {
    예비맘: "bg-brand-subtle text-brand-text",
    육아맘: "bg-tag-parent-bg text-tag-parent-text",
};

export default function PostTag({ type }: PostTagProps) {
    return <span className={`inline-flex h-5 items-center rounded-full px-2.5 text-[10px] font-bold ${tagStyles[type]}`}>{type}</span>;
}
