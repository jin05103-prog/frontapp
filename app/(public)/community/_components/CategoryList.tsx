import type { FeedCategoryId } from "@/types/community/communityFeed.type";
import type { FeedCategory } from "../_constants/feed";
import CategoryItem from "./CategoryItem";

interface CategoryListProps {
    items: FeedCategory[];
    activeId: FeedCategoryId;
    onSelect: (id: FeedCategoryId) => void;
}

export default function CategoryList({ items, activeId, onSelect }: CategoryListProps) {
    return (
        <div>
            <h2 id="community-category-title" className="text-sm font-bold text-ink">카테고리</h2>
            <ul aria-labelledby="community-category-title" className="mt-2.5">
                {items.map((item, index) => (
                    <li key={item.id}>
                        <CategoryItem label={item.label} color={item.color} active={item.id === activeId} onClick={() => onSelect(item.id)} />
                        {index < items.length - 1 && <div aria-hidden="true" className="mx-3.5 my-0.5 h-px bg-line" />}
                    </li>
                ))}
            </ul>
        </div>
    );
}
