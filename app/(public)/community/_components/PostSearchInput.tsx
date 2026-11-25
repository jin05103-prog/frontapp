import { Search } from "lucide-react";
import { FOCUS_RING } from "../_constants/feed";

interface PostSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export default function PostSearchInput({ value, onChange, placeholder }: PostSearchInputProps) {
    return (
        <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mute" />
            <label htmlFor="community-search" className="sr-only">게시글 제목 검색</label>
            <input
                id="community-search"
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className={`h-[51px] w-full rounded-feed-sm border border-line pr-4 pl-11 text-sm text-ink placeholder:text-mute-light ${FOCUS_RING}`}
            />
        </div>
    );
}
