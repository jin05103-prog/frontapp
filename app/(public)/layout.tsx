import type { ReactNode } from "react";
import UserPageLayout from "@/components/user/UserPageLayout";

export default function Layout({ children }: { children: ReactNode }) {
    return <UserPageLayout>{children}</UserPageLayout>;
}
