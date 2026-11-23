import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { getCommunityPosts } from "@/api/community/community.api";
import CommunityAside from "./_components/CommunityAside";
import CommunityBoard from "./_components/CommunityBoard";

export const metadata: Metadata = {
    title: "커뮤니티 | NESTEP",
    description: "임신과 육아의 순간을 나누고, 서로의 하루를 응원하는 커뮤니티입니다.",
};

export default async function Page() {
    const posts = await getCommunityPosts();

    return (
        <div className="pb-16 font-pretendard text-[#253B3A]">
            <Link href="/" className="inline-flex items-center gap-2 pt-8 text-sm font-semibold text-[#7F8F86] hover:text-primary">
                <ArrowLeft aria-hidden="true" className="size-4" />
                메인으로
            </Link>

            <section className="mt-10 flex items-end justify-between gap-6">
                <div>
                    <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[#8A9A90]">
                        <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
                        NESTEP COMMUNITY
                    </p>
                    <h1 className="mt-5 text-5xl font-extrabold tracking-tight">
                        우리의 이야기가 <span className="text-primary">모이는 곳</span>
                    </h1>
                    <p className="mt-5 text-lg text-[#8A9A90]">임신과 육아의 순간을 나누고, 서로의 하루를 응원해요.</p>
                </div>
                <Link href="/community/new" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-white hover:opacity-90">
                    <Plus aria-hidden="true" className="size-4" />
                    이야기 나누기
                </Link>
            </section>

            <CommunityBoard posts={posts} aside={<CommunityAside />} />
        </div>
    );
}
