"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { GuideArticle, GuideCategory } from "@/types/pregnancy-guide/pregnancy-guide.type";

const categories: ("전체" | GuideCategory)[] = ["전체", "임신 준비", "임신 생활", "출산 준비", "지원 혜택"];
const pageSize = 6;

export default function GuideList({ articles }: { articles: GuideArticle[] }) {
    const [category, setCategory] = useState<(typeof categories)[number]>("전체");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [openId, setOpenId] = useState<string | null>(articles[0]?.id ?? null);
    const keyword = query.trim().toLocaleLowerCase();
    const filtered = articles.filter((article) => {
        const matchesCategory = category === "전체" || article.category === category;
        const searchText = [article.title, article.summary, article.source.name, ...article.sections.flatMap((section) => [section.title, ...section.content])].join(" ").toLocaleLowerCase();
        return matchesCategory && searchText.includes(keyword);
    });
    const pageCount = Math.ceil(filtered.length / pageSize);
    const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

    function resetList() { setPage(1); setOpenId(null); }
    function movePage(nextPage: number) { setPage(nextPage); setOpenId(null); }

    return (
        <section aria-labelledby="guide-search-title" className="mt-9">
            <div className="flex items-center justify-between gap-6">
                <h2 id="guide-search-title" className="font-nanum-square-round text-3xl font-extrabold">어떤 정보가 필요하세요?</h2>
                <div className="relative w-127">
                    <Search aria-hidden="true" className="pointer-events-none absolute top-4 left-5 size-6 text-[#98A89F]" />
                    <label htmlFor="guide-search" className="sr-only">정보와 지원 혜택 검색</label>
                    <input id="guide-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); resetList(); }} placeholder="궁금한 정보나 지원 혜택을 검색해 보세요" className="h-14 w-full rounded-2xl border border-[#DDE7E1] pr-12 pl-14 text-base outline-none placeholder:text-[#98A89F] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" />
                    {query && <button type="button" aria-label="검색어 지우기" onClick={() => { setQuery(""); resetList(); }} className="absolute top-3 right-3 rounded-full p-2 text-[#778A7D] hover:bg-[#F1F6F3]"><X aria-hidden="true" className="size-4" /></button>}
                </div>
            </div>
            <div role="group" aria-label="정보 분류" className="mt-6 flex gap-3">
                {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => { setCategory(item); resetList(); }} className={`rounded-full px-7 py-3 text-lg font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${category === item ? "bg-primary text-white" : "bg-[#F4F7F5] text-[#61766D] hover:bg-[#E6F5ED]"}`}>{item}</button>)}
            </div>
            <div className="mt-12 flex items-end justify-between border-b border-[#CAD9CF] pb-6">
                <div><h3 className="text-2xl font-bold">{category === "전체" ? "전체 정보" : category}</h3><p className="mt-3 text-base text-[#85938A]">궁금한 항목을 펼쳐 내용을 확인해 보세요.</p></div>
                <p role="status" className="text-sm text-[#85938A]">{query.trim() ? "검색 결과" : "등록된 정보"} <strong className="font-semibold text-[#009B82]">{filtered.length}</strong>건</p>
            </div>
            <div>
                {visible.map((article) => {
                    const isOpen = openId === article.id;
                    return <article key={article.id} className="border-b border-[#E4ECE7]">
                        <h4>
                            <button id={`guide-trigger-${article.id}`} type="button" aria-expanded={isOpen} aria-controls={`guide-content-${article.id}`} onClick={() => setOpenId(isOpen ? null : article.id)} className="group flex w-full items-start gap-5 px-7 py-7 text-left hover:bg-[#FAFCFA] focus-visible:outline-2 focus-visible:outline-primary">
                                <span className={`mt-0.5 inline-flex w-26 shrink-0 justify-center rounded-full px-3 py-2 text-sm font-semibold ${article.category === "지원 혜택" ? "bg-[#E8F8F2] text-[#009B80]" : "bg-[#F2F6F3] text-[#728A78]"}`}>{article.category}</span>
                                <span className="min-w-0 flex-1"><span className="block text-2xl leading-9 font-semibold">{article.title}</span><span className="mt-3 block text-base leading-7 font-normal text-[#89978D]">{article.summary}</span></span>
                                <span className="mt-3 w-36 shrink-0 text-right text-sm font-normal text-[#94A197]">{article.source.name}</span>
                                <ChevronDown aria-hidden="true" className={`mt-3 ml-8 size-5 shrink-0 text-[#7E9186] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                        </h4>
                        <div id={`guide-content-${article.id}`} role="region" aria-labelledby={`guide-trigger-${article.id}`} hidden={!isOpen} className="bg-[#F7FAF8] px-11 py-8">
                            <dl>{article.sections.map((section, index) => <div key={section.title} className={`grid grid-cols-[180px_1fr] gap-6 ${index ? "mt-6" : ""}`}><dt className="pt-1 text-lg font-semibold">{section.title}</dt><dd className={`${index !== article.sections.length - 1 ? "border-b border-[#E4ECE7] pb-6" : ""} text-lg leading-8 text-[#62766A]`}>{section.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</dd></div>)}</dl>
                            <div className="mt-10 flex items-end justify-between gap-6">
                                <p className="text-sm leading-6 text-[#8C9C90]">출처 {article.source.name}{article.source.collectedAt && ` · 수집일 ${article.source.collectedAt}`}</p>
                                <a href={article.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-5 rounded-xl border border-[#D9E4DC] bg-white px-5 py-3 text-base font-semibold text-[#398069] hover:bg-[#EAF6EE] focus-visible:outline-2 focus-visible:outline-primary">{article.category === "지원 혜택" || article.category === "출산 준비" ? "공식 안내 확인" : "원문 확인"}<ArrowUpRight aria-hidden="true" className="size-5" /><span className="sr-only"> (새 창)</span></a>
                            </div>
                        </div>
                    </article>;
                })}
                {filtered.length === 0 && <div className="py-20 text-center"><Search aria-hidden="true" className="mx-auto mb-5 size-8 text-[#A2B2A7]" /><p className="text-xl font-semibold">일치하는 정보가 없어요.</p><p className="mt-3 text-[#85938A]">다른 검색어나 분류로 다시 찾아보세요.</p><button type="button" onClick={() => { setQuery(""); setCategory("전체"); resetList(); }} className="mt-6 rounded-full bg-[#E8F8F2] px-6 py-3 font-semibold text-[#009B80]">전체 정보 보기</button></div>}
            </div>
            {pageCount > 1 && <nav aria-label="정보 목록 페이지" className="mt-8 flex items-center justify-center gap-3"><button type="button" aria-label="이전 페이지" disabled={page === 1} onClick={() => movePage(page - 1)} className="rounded-lg p-3 text-[#7D9183] disabled:cursor-default disabled:opacity-30"><ChevronLeft aria-hidden="true" className="size-4" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" aria-current={page === number ? "page" : undefined} onClick={() => movePage(number)} className={`size-10 rounded-xl ${page === number ? "bg-[#E5F8F0] font-semibold text-[#00A88A]" : "text-[#8E9B91] hover:bg-[#F4F7F5]"}`}>{number}</button>)}<button type="button" aria-label="다음 페이지" disabled={page === pageCount} onClick={() => movePage(page + 1)} className="rounded-lg p-3 text-[#7D9183] disabled:cursor-default disabled:opacity-30"><ChevronRight aria-hidden="true" className="size-4" /></button></nav>}
        </section>
    );
}
