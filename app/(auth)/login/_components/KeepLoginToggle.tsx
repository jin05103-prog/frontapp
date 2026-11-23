"use client";

import { useState } from "react";

// 로그인 유지 체크 토글 (현재는 UI 상태만 관리합니다)
export default function KeepLoginToggle() {
    const [keep, setKeep] = useState(false);

    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={keep}
            onClick={() => setKeep((prev) => !prev)}
            className="flex h-7 items-center gap-1.5 rounded-xs border border-[#c9c9c9] bg-white pr-3 pl-2 text-sm tracking-[-0.3px] text-[#333]">
            <span className="flex size-3.5 items-center justify-center rounded-xs border border-[#9a9a9a] text-[11px] leading-none font-bold text-primary">
                {keep ? "✓" : ""}
            </span>
            로그인 유지
        </button>
    );
}
