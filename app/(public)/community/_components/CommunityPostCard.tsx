import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import type { CommunityPost } from "@/types/community/community.type";

export default function CommunityPostCard({ post }: { post: CommunityPost }) {
    return (
        <article className="flex gap-8 rounded-3xl bg-white p-8 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 text-sm text-[#8A9A90]">
                    <span className="rounded-full bg-[#E6F9F4] px-3 py-1 font-semibold text-[#00A88A]">{post.badge}</span>
                    <span>· {post.postedAgo}</span>
                </div>
                <h3 className="mt-4 text-2xl leading-9 font-bold">
                    <Link href={`/community/${post.id}`} className="hover:text-primary">{post.title}</Link>
                </h3>
                <p className="mt-3 text-lg leading-8 whitespace-pre-line text-[#6F7F76]">{post.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <li key={tag} className="rounded-full bg-[#F4F7F5] px-4 py-2 text-sm text-[#61766D]">{tag}</li>
                    ))}
                </ul>
                <div className="mt-6 flex items-center justify-between text-sm text-[#7D8C83]">
                    <div className="flex items-center gap-2">
                        <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-[#F4EFE8]">{post.author.avatar}</span>
                        <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5"><Heart aria-hidden="true" className="size-4" />{post.likes}<span className="sr-only">좋아요</span></span>
                        <span className="flex items-center gap-1.5"><MessageCircle aria-hidden="true" className="size-4" />{post.comments}<span className="sr-only">댓글</span></span>
                    </div>
                </div>
            </div>
            <div aria-hidden="true" className="relative h-35 w-50 shrink-0 rounded-2xl bg-[#EEF2EF]">
                <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#61766D]">{post.badge}</span>
            </div>
        </article>
    );
}
