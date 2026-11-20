import type { ReactNode } from "react";

export default function ClinicianLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-330 min-w-330">{children}</main>;
}
