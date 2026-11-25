interface DailyQuoteCardProps {
    message: string;
}

export default function DailyQuoteCard({ message }: DailyQuoteCardProps) {
    return (
        <section className="rounded-feed-lg bg-quote-bg px-[17px] pt-3.5 pb-[15px]">
            <h2 className="text-sm font-bold text-ink">☀ 오늘의 한마디</h2>
            <p className="mt-3 text-xs leading-5 whitespace-pre-line text-mute">{message}</p>
        </section>
    );
}
