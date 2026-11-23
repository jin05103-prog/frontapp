import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CommunityAside() {
    return (
        <div className="flex flex-col gap-5">
            <section className="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
                <div className="flex items-center justify-between text-sm font-bold">
                    <span>🎈 NESTEP 소식</span>
                    <ChevronRight aria-hidden="true" className="size-4" />
                </div>
                <h3 className="mt-5 text-lg leading-7 font-bold">우리 동네 산모교실 신청이 열렸어요!</h3>
                <p className="mt-3 text-sm text-[#8A9A90]">함께 배우고 이야기 나눠요 · 11.20</p>
            </section>

            <section className="rounded-2xl bg-[#FFFBEA] p-6">
                <h3 className="text-sm font-bold">🌞 오늘의 한마디</h3>
                <p className="mt-4 text-sm leading-6 text-[#8A8160]">완벽하지 않아도 괜찮아요.<br />오늘도 충분히 잘하고 있어요. 💛</p>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
                <h3 className="text-base font-bold">도움이 필요하신가요?</h3>
                <p className="mt-3 text-sm leading-6 text-[#8A9A90]">전문 의료진에게<br />궁금한 점을 물어보세요.</p>
                <Link href="/facilities" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">건강 상담 알아보기 <ChevronRight aria-hidden="true" className="size-4" /></Link>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-[0_6px_24px_rgb(0_0_0/0.04)]">
                <div className="flex items-center justify-between text-sm font-bold">
                    <span>🌿 우리 동네 40주 여정</span>
                    <ChevronRight aria-hidden="true" className="size-4" />
                </div>
                <p className="mt-3 text-sm text-[#8A9A90]">예비 패밀리와 함께해요</p>
            </section>
        </div>
    );
}
