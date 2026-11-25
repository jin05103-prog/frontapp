import { FOCUS_RING } from "../_constants/feed";

interface CategoryItemProps {
    label: string;
    color: string;
    active: boolean;
    onClick: () => void;
}

export default function CategoryItem({ label, color, active, onClick }: CategoryItemProps) {
    return (
        <button
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={onClick}
            className={`flex h-[46px] w-full items-center gap-3 rounded-feed-md px-3.5 text-left text-base transition-colors ${FOCUS_RING} ${active ? "bg-brand-subtle font-bold text-brand-text" : "text-mute hover:bg-surface-alt"}`}
        >
            <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${color}`} />
            <span className="flex-1">{label}</span>
            {active && <span aria-hidden="true">›</span>}
        </button>
    );
}
