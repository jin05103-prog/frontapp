import Image from "next/image";
import { formatPrice } from "@/lib/format";

interface ProductRankItemProps {
    rank: number;
    name: string;
    discountRate: number;
    price: number;
    thumbnailUrl: string | null;
}

export default function ProductRankItem({ rank, name, discountRate, price, thumbnailUrl }: ProductRankItemProps) {
    return (
        <li className="flex h-[52px] items-center">
            <span className="w-[22px] pl-1 text-xs font-bold text-brand-text">{rank}</span>
            <div className="relative size-[52px] shrink-0 overflow-hidden rounded-feed-md bg-placeholder">
                {thumbnailUrl && <Image src={thumbnailUrl} alt="" fill sizes="52px" className="object-cover" />}
            </div>
            <div className="ml-3 min-w-0">
                <p className="truncate text-xs text-ink">{name}</p>
                <p className="mt-1 flex items-center gap-2 text-xs font-bold">
                    {discountRate > 0 && <span className="text-sale">{discountRate}%</span>}
                    <span className="text-ink">{formatPrice(price)}</span>
                </p>
            </div>
        </li>
    );
}
