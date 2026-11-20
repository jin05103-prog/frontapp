import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LoginButtonProps = Omit<ComponentProps<typeof Link>, "href"> & {
    href?: ComponentProps<typeof Link>["href"];
};

export default function LoginButton({
    href = "/login",
    children = "로그인",
    className,
    ...props
}: LoginButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                "inline-flex min-h-8.5 w-27.5 shrink-0 items-center justify-center rounded-full bg-primary px-5 py-1.5 text-base leading-5.5 font-semibold text-white no-underline transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none",
                className,
            )}
            {...props}>
            {children}
        </Link>
    );
}
