import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import { getCommunityPost } from "@/api/community/community.api";
import CommunityCommentForm from "../_components/CommunityCommentForm";

export const metadata: Metadata = {
    title: "커뮤니티 | NESTEP",
};

export default async function Page({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const post = await getCommunityPost(postId);
    if (!post) notFound();

    return (
        <div className="pb-16 font-pretendard text-[#253B3A]">
            <Link href="/community" className="inline-flex items-center gap-2 pt-8 text-sm font-semibold text-[#7F8F86] hover:text-primary">
                <ArrowLeft aria-hidden="true" className="size-4" />
                커뮤니티 피드
            </Link>

            <div className="mt-8 grid grid-cols-[minmax(0,1fr)_312px] items-start gap-6">
                <article className="rounded-3xl bg-white p-10 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
                    <div className="flex items-center gap-3 text-sm text-[#8A9A90]">
                        <span className="rounded-full bg-[#E6F9F4] px-3 py-1 font-semibold text-[#00A88A]">{post.badge}</span>
                        <span>· {post.postedAgo}</span>
                    </div>
                    <h1 className="mt-5 text-4xl leading-[1.35] font-bold">{post.title}</h1>

                    <div className="mt-7 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full bg-[#F4EFE8] text-xl">{post.author.avatar}</span>
                            <div>
                                <p className="font-bold">{post.author.name}</p>
                                <p className="mt-1 text-sm text-[#8A9A90]">우리의 소중한 순간 나눠요</p>
                            </div>
                        </div>
                        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-[#F4F7F5] text-[#61766D]">
                            <ArrowUpRight className="size-4" />
                        </span>
                    </div>

                    <div aria-hidden="true" className="mt-8 h-[300px] rounded-2xl bg-[#EEF2EF]" />

                    <div className="mt-8 space-y-5 text-lg leading-8 text-[#4F5F57]">
                        {post.contents.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>

                    <ul className="mt-6 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <li key={tag} className="rounded-full bg-[#F4F7F5] px-4 py-2 text-sm text-[#61766D]">{tag}</li>
                        ))}
                    </ul>

                    <div className="mt-8 flex items-center gap-6 border-y border-[#E4ECE7] py-5 text-sm text-[#7D8C83]">
                        <span className="flex items-center gap-1.5"><Heart aria-hidden="true" className="size-4" />공감 {post.likes}</span>
                        <span className="flex items-center gap-1.5"><MessageCircle aria-hidden="true" className="size-4" />댓글 {post.commentList.length}</span>
                    </div>

                    <section aria-labelledby="community-comments-title" className="mt-8">
                        <div className="flex items-baseline gap-3">
                            <h2 id="community-comments-title" className="text-xl font-bold">따뜻한 응원</h2>
                            <span className="text-lg font-bold text-primary">{post.commentList.length}</span>
                            <span className="text-sm text-[#8A9A90]">서로를 배려하는 댓글을 남겨주세요</span>
                        </div>

                        <CommunityCommentForm />

                        <ul className="mt-6">
                            {post.commentList.map((comment) => (
                                <li key={comment.id} className="flex gap-4 border-b border-[#E4ECE7] py-6 last:border-b-0">
                                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F4F7F5]">{comment.author.avatar}</span>
                                    <div>
                                        <p className="font-bold">{comment.author.name}</p>
                                        <p className="mt-2 text-base leading-7 text-[#4F5F57]">{comment.content}</p>
                                        <p className="mt-2 text-sm text-[#A0AEA5]">{comment.postedAgo} · 답글 달기</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </article>

                <aside className="flex flex-col gap-5">
                    <section className="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
                        <p aria-hidden="true" className="text-sm">💚</p>
                        <h2 className="mt-3 text-base font-bold">함께여서 든든한 순간</h2>
                        <p className="mt-3 text-sm leading-6 text-[#8A9A90]">작은 응원도 나누면<br />누군가에게 큰 힘이 돼요.</p>
                        <Link href="/community" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">다른 이야기 둘러보기 →</Link>
                    </section>

                    <section className="rounded-2xl bg-[#FFFBEA] p-6">
                        <h2 className="text-sm font-bold">이 글의 태그</h2>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <li key={tag} className="rounded-full bg-white/70 px-3 py-2 text-sm text-[#61766D]">{tag}</li>
                            ))}
                        </ul>
                    </section>
                </aside>
            </div>
        </div>
    );
}
