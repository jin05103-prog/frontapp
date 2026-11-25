import type { Metadata } from "next";
import Link from "next/link";
import CommunityLayout from "./_components/CommunityLayout";

export const metadata: Metadata = {
    title: "커뮤니티 | NESTEP",
    description: "임신과 육아의 순간을 나누고, 서로의 하루를 응원하는 커뮤니티입니다.",
};

export default function Page() {
    return (
        <div className="bg-white font-pretendard text-ink">
            <nav aria-label="현재 위치" className="flex gap-1 pt-11 text-sm text-mute">
                <Link href="/" className="hover:text-ink">홈</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">커뮤니티</span>
            </nav>
            <h1 className="mt-[29px] font-nanum-square-round text-5xl leading-[1.2] font-extrabold">
                우리의 이야기가 <span className="text-primary">모이는 곳</span>
            </h1>
            <CommunityLayout />
        </div>
    );
}
