import { HeartPulse, Leaf, Sparkle } from "lucide-react";

export default function GuideHero() {
    return (
        <section aria-labelledby="guide-title" className="relative flex min-h-85 items-center justify-between overflow-hidden rounded-4xl bg-[#ECFAF5] px-11 py-9">
            <div className="relative z-10">
                <span className="inline-flex rounded-full bg-white px-6 py-2 text-sm font-semibold text-[#009B82]">NESTEP GUIDE</span>
                <h1 id="guide-title" className="mt-6 font-nanum-square-round text-5xl leading-tight font-extrabold tracking-tight text-[#253B3A]">
                    새로운 시작을 위한<br />임신·출산 정보 한곳에
                </h1>
                <p className="mt-6 text-xl leading-8 text-[#61766D]">
                    차근차근 준비하는 건강 정보부터 우리 가족을 위한 지원 혜택까지.<br />지금 필요한 정보를 가볍게 살펴보세요.
                </p>
            </div>
            <div aria-hidden="true" className="relative mr-10 h-67 w-75 shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#D3F3E8]" />
                <div className="absolute -top-1 right-0 size-15 rounded-full bg-sub-1" />
                <Sparkle className="absolute top-9 -left-6 size-6 text-primary" />
                <div className="absolute top-9 left-8 h-47 w-41 -rotate-8 rounded-3xl bg-white p-5">
                    <div className="flex h-17 items-center justify-center rounded-2xl bg-sub-1"><Leaf className="size-11 text-[#387C4B]" strokeWidth={1.5} /></div>
                    <div className="mt-6 h-2 rounded-full bg-[#C1DDD2]" /><div className="mt-3 h-2 w-4/5 rounded-full bg-[#D8E9E2]" /><div className="mt-3 h-2 rounded-full bg-[#D8E9E2]" />
                </div>
                <div className="absolute right-0 bottom-0 flex size-27 rotate-10 items-center justify-center rounded-3xl bg-sub-2"><HeartPulse className="size-12 text-white" strokeWidth={1.5} /></div>
                <Sparkle className="absolute top-28 -right-3 size-5 text-sub-2" />
            </div>
        </section>
    );
}
