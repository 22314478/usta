"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function LaDolceVita() {
  const t = useTranslations('dolceVita');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    <section
      ref={sectionRef}
      className="relative -mt-[100px] bg-[#111] py-24 px-6 sm:px-8 lg:py-32"
      aria-labelledby="la-dolce-vita-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Grid: text 1/3, image 2/3 on large screens */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:items-stretch">
          {/* Left column - text (1/3) */}
          <div
            className={`flex flex-col justify-center ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}
          >
            <p className="font-barlow-c text-sm font-medium uppercase tracking-[0.2em] text-[#f5f0e8] flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-[#c9a962]" aria-hidden />
              {t('subtitle')}
              <span className="h-px w-8 bg-[#c9a962]" aria-hidden />
            </p>
            <h2
              id="la-dolce-vita-heading"
              className="font-gilda text-4xl font-normal leading-tight text-[#f5f0e8] sm:text-5xl lg:text-5xl xl:text-6xl mb-6"
            >
              {t('heading')}
            </h2>
            <p className="font-barlow text-lg leading-relaxed text-[#f5f0e8]/90 max-w-xl">
              {t('description')}
            </p>
          </div>

          {/* Right column - image (2/3 of row) */}
          <div
            className={`relative w-full min-h-[320px] sm:min-h-[400px] lg:aspect-[4/3] lg:min-h-0 overflow-hidden shadow-xl border-b-[0.5px] border-b-[#ffcf82] opacity-0 ${
              isVisible ? "animate-fade-in-up [animation-fill-mode:forwards]" : ""
            }`}
            style={isVisible ? { animationDelay: "600ms" } : undefined}
          >
            <div className="absolute inset-0">
              <Image
                src="/images/Bolognese.webp"
                alt="Spaghetti bolognese with fresh basil and cherry tomatoes"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority={false}
              />
            </div>
            <div
              className={`absolute inset-0 z-10 bg-[#ffcf82] ${isMobile ? "" : "transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"}`}
              style={{
                transform: isVisible ? "translateY(-100%)" : "translateY(0)",
                transitionDelay: isMobile ? "0ms" : isVisible ? "1300ms" : "0ms",
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
