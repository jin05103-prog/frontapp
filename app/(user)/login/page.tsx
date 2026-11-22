import Image from "next/image";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 백엔드가 제공자 로그인 페이지로 리다이렉트하므로 페이지 이동(<a>)으로 호출한다.
const SOCIAL_LOGIN_BUTTONS = [
  {
    href: `${BACKEND_URL}/auth/kakao`,
    label: "카카오로 로그인",
    className: "bg-[#FEE500] text-[#191919] hover:bg-[#f5dc00]",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <ellipse cx="18" cy="16" rx="15" ry="12.5" fill="#391B1B" />
        <path d="M11 28 L10 33 L16 29 Z" fill="#391B1B" />
        <text x="18" y="19.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#FEE500">TALK</text>
      </svg>
    ),
  },
  {
    href: `${BACKEND_URL}/auth/naver`,
    label: "네이버로 로그인",
    className: "bg-[#03C75A] text-white hover:bg-[#02b351]",
    icon: (
      <span className="flex h-9 w-9 items-center justify-center text-[30px] leading-none font-black" aria-hidden="true">
        N
      </span>
    ),
  },
  {
    href: `${BACKEND_URL}/auth/google`,
    label: "구글로 로그인",
    className: "border border-[#dadce0] bg-white text-[#191919] hover:bg-[#f8f8f8]",
    icon: (
      <span className="flex h-9 w-9 items-center justify-center text-[30px] leading-none font-bold text-[#4285F4]" aria-hidden="true">
        G
      </span>
    ),
  },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-4">
      <div className="flex w-full max-w-[917px] flex-col items-center rounded-[40px] bg-white px-6 pt-[60px] pb-[50px] md:px-[110px]">
        {/* 로고 */}
        <div className="flex items-center gap-3">
          <Image src="/icons/nestep_main_icon.png" alt="" width={56} height={56} />
          <span className="text-[44px] font-extrabold tracking-tight text-[#1DC078]">NESTEP</span>
        </div>

        {/* 문구 */}
        <h1 className="mt-16 text-[32px] font-bold text-[#191919]">환영해요! 👋</h1>
        <p className="mt-4 text-center text-[18px] leading-[1.6] text-[#8a8a8a]">
          오늘의 기분부터 아기의 작은 변화까지,
          <br />
          함께한 하루를 차곡차곡 담아보세요.
        </p>

        {/* 로그인 유지 (UI만 제공, 백엔드 쿠키 만료 설정은 고정) */}
        <label className="mt-6 flex w-full cursor-pointer items-center justify-end gap-2 text-[15px] text-[#191919]">
          <input type="checkbox" className="h-4 w-4 rounded border-[#bdbdbd]" />
          로그인 유지
        </label>

        {/* 소셜 로그인 버튼 */}
        <div className="mt-8 flex w-full flex-col gap-4">
          {SOCIAL_LOGIN_BUTTONS.map(({ href, label, className, icon }) => (
            <a
              key={label}
              href={href}
              className={`flex h-[86px] w-full items-center justify-center gap-4 rounded-[16px] text-[22px] font-bold transition-colors ${className}`}
            >
              {icon}
              <span>{label}</span>
            </a>
          ))}
        </div>

        {/* 하단 링크 */}
        <div className="mt-12 flex gap-4 text-[16px]">
          <Link href="/terms" className="text-[#8a8a8a] hover:underline">
            이용약관
          </Link>
          <Link href="/privacy" className="font-semibold text-[#444] hover:underline">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </div>
  );
}
