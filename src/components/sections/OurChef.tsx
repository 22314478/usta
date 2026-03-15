"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { getSiteSettings, SiteSettings } from "@/lib/siteStore";

export function OurChef() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  const chef = settings?.chef;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handle = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const transitionClasses = "transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]";
  const visibleClasses = "translate-y-0 opacity-100";
  const hiddenClasses = "translate-y-12 opacity-0";

  return (
    <section ref={sectionRef} className="relative bg-[#111] py-24 px-6 sm:px-8 lg:py-32" aria-labelledby="our-chef-heading">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h2 id="our-chef-heading" className={`font-gilda text-4xl font-normal tracking-wide text-[#f5f0e8] sm:text-5xl lg:text-6xl ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}>
            {chef?.heading}
          </h2>
          <div className={`mt-4 flex items-center justify-center gap-3 ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}>
            <span className="h-px w-16 bg-[#c9a962]/70 sm:w-24 lg:w-32" aria-hidden />
            <span className="flex items-center justify-center text-[#c9a962]" aria-hidden>
              <Image src="/images/restaurant.svg" alt="" width={28} height={29} className="h-6 w-6 opacity-90 sm:h-7 sm:w-7 object-contain" />
            </span>
            <span className="h-px w-16 bg-[#c9a962]/70 sm:w-24 lg:w-32" aria-hidden />
          </div>
          <p className={`mt-3 font-barlow-c text-lg font-medium uppercase tracking-[0.35em] text-[#c9a962] ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}>
            {chef?.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className={`relative aspect-[3/4] w-full overflow-hidden shadow-xl border-b-[0.5px] border-b-[#ffcf82] opacity-0 ${isVisible ? "animate-fade-in-up [animation-fill-mode:forwards]" : ""}`} style={isVisible ? { animationDelay: "550ms" } : undefined}>
            <Image src={chef?.image || "/images/Chef.webp"} alt={chef?.name || "Chef"} fill className="object-cover object-center" sizes="(min-width: 1024px) 50vw, 100vw" priority={false} />
            <div className={`absolute inset-0 z-10 bg-[#ffcf82] ${isMobile ? "" : "transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"}`} style={{ transform: isVisible ? "translateY(-100%)" : "translateY(0)", transitionDelay: isMobile ? "0ms" : isVisible ? "1250ms" : "0ms" }} aria-hidden />
          </div>

          <div className={`flex flex-col text-left ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}>
            <blockquote className="mb-6 font-gilda text-4xl md:text-6xl font-normal leading-snug text-[#f5f0e8]">&ldquo;{chef?.quote}&rdquo;</blockquote>
            <p className="mb-8 max-w-xl font-barlow text-xl leading-relaxed text-[#f5f0e8]/90">{chef?.bio1}</p>
            <p className="mb-8 max-w-xl font-barlow text-xl leading-relaxed text-[#f5f0e8]/90">{chef?.bio2}</p>
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a]" aria-hidden>
                <Image src="/images/restaurant.svg" alt="" width={32} height={33} className="h-14 w-14 object-contain opacity-90" />
              </div>
              <div>
                <p className="font-barlow-c text-xl font-semibold uppercase tracking-[0.2em] text-[#c9a962] sm:text-2xl">{chef?.passionTitle}</p>
                <p className="mt-1 font-barlow text-xl leading-relaxed text-[#a39e94]">{chef?.passionDesc}</p>
              </div>
            </div>
            <p className="mb-2 font-barlow-c text-2xl font-medium uppercase tracking-[0.2em] text-[#c9a962]">{chef?.title}</p>
            <p className="font-allura text-4xl text-[#f5f0e8] sm:text-5xl">{chef?.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
