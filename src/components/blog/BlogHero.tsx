"use client";

import Link from "next/link";
import Image from "next/image";

export function BlogHero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/landscape.webp"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-black/50"
          aria-hidden
        />
      </div>

      <div className="relative flex min-h-[70vh] flex-col justify-center px-6 py-32 sm:px-10 md:px-14 lg:px-20">
        <div className="mx-auto w-full max-w-4xl">
          <p className="font-barlow-c flex items-center gap-4 font-normal uppercase tracking-[0.35em] text-header-accent" style={{ fontSize: "0.875rem" }}>
            <span className="h-px w-8 bg-header-accent/80" aria-hidden />
            News
            <span className="h-px w-8 bg-header-accent/80" aria-hidden />
          </p>
          <h1 className="font-gilda mt-5 text-4xl font-normal uppercase tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Our Blog
          </h1>
          <Link
            href="/#our-menu-heading"
            className="font-barlow-c mt-10 inline-flex items-center justify-center rounded-md border-2 border-header-accent bg-[#2a1f17] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:border-header-accent-hover hover:bg-[#35281e]"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
