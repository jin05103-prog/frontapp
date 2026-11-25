import { FOCUS_RING } from "../_constants/feed";

interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

const VISIBLE_PAGES = 5;

const buttonClass = `flex size-10 items-center justify-center rounded-feed-md text-base transition-colors ${FOCUS_RING}`;

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
    const start = Math.max(1, Math.min(page - Math.floor(VISIBLE_PAGES / 2), totalPages - VISIBLE_PAGES + 1));
    const end = Math.min(totalPages, start + VISIBLE_PAGES - 1);
    const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

    return (
        <nav aria-label="페이지 이동">
            <ul className="flex items-center justify-center gap-3">
                <li>
                    <button type="button" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onChange(page - 1)} className={`${buttonClass} text-mute hover:bg-surface-alt disabled:cursor-not-allowed disabled:text-mute-light disabled:hover:bg-transparent`}>
                        ‹
                    </button>
                </li>
                {pages.map((item) => (
                    <li key={item}>
                        <button
                            type="button"
                            aria-label={`${item}페이지`}
                            aria-current={item === page ? "page" : undefined}
                            onClick={() => item !== page && onChange(item)}
                            className={`${buttonClass} ${item === page ? "bg-brand-subtle font-bold text-brand-text" : "text-mute hover:bg-surface-alt"}`}
                        >
                            {item}
                        </button>
                    </li>
                ))}
                <li>
                    <button type="button" aria-label="다음 페이지" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className={`${buttonClass} text-mute hover:bg-surface-alt disabled:cursor-not-allowed disabled:text-mute-light disabled:hover:bg-transparent`}>
                        ›
                    </button>
                </li>
            </ul>
        </nav>
    );
}
