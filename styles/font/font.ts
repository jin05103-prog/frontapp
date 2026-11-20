import localFont from 'next/font/local'

const pretendard = localFont({
    src: [
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-Thin.woff2",
            weight: "100",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-ExtraLight.woff2",
            weight: "200",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-Light.woff2",
            weight: "300",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-Regular.woff2",
            weight: "400",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-Medium.woff2",
            weight: "500",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-SemiBold.woff2",
            weight: "600",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-Bold.woff2",
            weight: "700",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-ExtraBold.woff2",
            weight: "800",
        },
        {
            path: "../../public/assets/fonts/pretendard/Pretendard-Black.woff2",
            weight: "900",
        },
    ],
    display: "swap",
    variable: "--font-pretendard-local"
})

const nanumSquareRound = localFont({
    src: [
        {
            path: "../../public/assets/fonts/nanum-square-round/NanumSquareRoundL.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../../public/assets/fonts/nanum-square-round/NanumSquareRoundR.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/assets/fonts/nanum-square-round/NanumSquareRoundB.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/assets/fonts/nanum-square-round/NanumSquareRoundEB.ttf",
            weight: "800",
            style: "normal",
        },
    ],
    display: "swap",
    variable: "--font-nanum-square-round-local",
})

export { pretendard, nanumSquareRound }