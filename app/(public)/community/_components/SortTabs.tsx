import type { FeedSort } from "@/types/community/communityFeed.type";
import { FOCUS_RING } from "../_constants/feed";

interface SortTabsProps {
    value: FeedSort;
    onChange: (value: FeedSort) => void;
}

const tabs: { key: FeedSort; label: string }[] = [
    { key: "popular", label: "인기글" },
    { key: "latest", label: "최신글" },
];

export default function SortTabs({ value, onChange }: SortTabsProps) {
    return (
        <div role="tablist" aria-label="게시글 정렬" className="flex gap-[30px]">
            {tabs.map(({ key, label }) => (
                <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={value === key}
                    onClick={() => onChange(key)}
                    className={`border-b-2 pb-2 text-base transition-colors ${FOCUS_RING} ${value === key ? "border-brand-text font-bold text-ink" : "border-transparent text-mute-light hover:text-ink"}`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
