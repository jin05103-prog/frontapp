import AuthHydration from "@/components/auth/AuthHydration";
import Link from "next/link";


export default function Page() {

  return (
    <div>
      <Link
          className="flex justify-center items-center w-50 h-10 bg-blue-500 text-white rounded-2xl mt-5 mb-5 cursor-pointer"
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`}
      >구글 로그인</Link>
      <Link
          className="flex justify-center items-center w-50 h-10 bg-blue-500 text-white rounded-2xl mt-5 mb-5 cursor-pointer"
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/kakao`}
      >카카오 로그인</Link>
      <Link
          className="flex justify-center items-center w-50 h-10 bg-blue-500 text-white rounded-2xl mt-5 mb-5 cursor-pointer"
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/naver`}
      >네이버 로그인</Link>
    </div>
  )







  // return <h1>일반 사용자 로그인</h1>;
}
