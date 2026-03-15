import { OurMenu } from "@/components/sections/OurMenu";
import { Suspense } from "react";

export default function MenuPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="min-h-screen bg-[#111]" />}>
        <OurMenu />
      </Suspense>
    </main>
  );
}
