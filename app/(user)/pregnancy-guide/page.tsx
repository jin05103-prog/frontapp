import type { Metadata } from "next";
import Link from "next/link";
import GuideHero from "./_components/GuideHero";
import GuideList from "./_components/GuideList";
import { guideArticles } from "./_data/guide-articles";

export const metadata: Metadata = {
    title: "임신·지원 정보 | NESTEP",
    description: "임신 준비와 임신 생활 정보, 출산·양육 지원 혜택을 확인하세요.",
};

export default function Page() {
    // TODO: 백엔드 정보 조회 API 연결. 현재는 첨부 자료를 요약한 초기 콘텐츠를 사용합니다.
    return (
        <div className="pb-14 font-pretendard text-[#253B3A]">
            <nav aria-label="현재 위치" className="flex items-center gap-3 py-8 text-sm text-[#84918D]"><Link href="/" className="hover:text-primary">홈</Link><span aria-hidden="true">/</span><span aria-current="page">임신·지원 정보</span></nav>
            <GuideHero />
            <GuideList articles={guideArticles} />
            <p className="mt-14 text-sm leading-6 text-[#8D9B90]">수집 자료를 바탕으로 선별·요약한 정보입니다. 지원 조건과 최신 내용은 각 항목의 출처에서 확인해 주세요.</p>
        </div>
    );
}
