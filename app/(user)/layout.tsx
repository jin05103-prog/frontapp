import { Suspense, type ReactNode } from "react";
import UserHeader from "@/components/user/UserHeader";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <UserHeader />
      </Suspense>
      <main className="mx-auto w-330 min-w-330">{children}</main>
    </>
  );
}
