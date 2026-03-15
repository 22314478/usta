import { Hero } from "@/components/sections/Hero";
import { BookATable } from "@/components/sections/BookATable";
import { ScrollToHash } from "@/components/ui/ScrollToHash";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollToHash />
      <Hero />
      <BookATable />
    </main>
  );
}
