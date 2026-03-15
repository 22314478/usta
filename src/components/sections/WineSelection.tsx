"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getWines, Wine } from "@/lib/api";

const transitionClasses =
  "transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]";
const visibleClasses = "translate-y-0 opacity-100";
const hiddenClasses = "translate-y-12 opacity-0";

export function WineSelection() {
  const t = useTranslations('wine');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWines(locale).then(data => {
      setWines(data);
      setLoading(false);
    });
  }, [locale]);

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

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: "#111" }}
      aria-labelledby="wine-selection-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Wine bottle at top on mobile only */}
        <div
          className={`relative mx-auto mb-10 min-h-[200px] w-full max-w-[200px] lg:hidden ${transitionClasses} ${
            isVisible ? visibleClasses : hiddenClasses
          }`}
          style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
        >
          <Image
            src="/images/Italianwine3.webp"
            alt="Wine bottle"
            fill
            className="object-contain object-center"
            sizes="200px"
            priority={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-stretch">
          {/* Left: Wine bottle image - desktop only (on mobile shown at top above) */}
          <div
            className={`relative hidden min-h-[280px] lg:block lg:min-h-0 lg:max-w-none lg:h-full lg:w-full ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
          >
            <Image
              src="/images/Italianwine3.webp"
              alt=""
              fill
              className="object-contain object-center"
              sizes="33vw"
              priority={false}
              aria-hidden
            />
          </div>

          {/* Right: Wine menu content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <header className="mb-8 md:mb-10">
              <div
                className={`flex items-center justify-center lg:justify-start gap-4 mb-4 ${transitionClasses} ${
                  isVisible ? visibleClasses : hiddenClasses
                }`}
                style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
              >
                <span className="h-px flex-1 max-w-[60px] md:max-w-[80px] bg-[#c9a962] hidden lg:block" />
                <span className="font-[family-name:var(--font-barlow-c)] text-[28px] uppercase tracking-widest text-[#c9a962]">
                  {t('subtitle')}
                </span>
                <span className="h-px flex-1 max-w-[60px] md:max-w-[80px] bg-[#c9a962]" />
              </div>
              <h2
                id="wine-selection-heading"
                className={`font-[family-name:var(--font-gilda)] text-4xl md:text-5xl lg:text-6xl text-white tracking-wide text-center lg:text-left ${transitionClasses} ${
                  isVisible ? visibleClasses : hiddenClasses
                }`}
                style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
              >
                {t('heading')}
              </h2>
              <p
                className={`mt-4 font-[family-name:var(--font-barlow)] text-sm md:text-base text-white/70 leading-relaxed text-center lg:text-left max-w-xl ${transitionClasses} ${
                  isVisible ? visibleClasses : hiddenClasses
                }`}
                style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
              >
                {t('description')}
              </p>
            </header>

            {/* Wine list */}
            <div
              className={`space-y-8 ${transitionClasses} ${
                isVisible ? visibleClasses : hiddenClasses
              }`}
              style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}
            >
              {loading ? (
                <p className="text-white/70">Loading...</p>
              ) : (
                wines.map((wine) => (
                  <article key={wine.id} className="group">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-[family-name:var(--font-gilda)] text-xl md:text-2xl text-white shrink-0">
                        {wine.name}
                      </h3>
                      <span className="flex-1 min-w-[20px] border-b border-dotted border-white/40 self-end mb-1.5" />
                      <span className="font-[family-name:var(--font-gilda)] text-lg md:text-xl text-white shrink-0">
                        {wine.price}
                      </span>
                    </div>
                    <p className="mt-2 font-[family-name:var(--font-barlow)] text-sm md:text-base text-white/70 leading-relaxed pl-0">
                      {wine.description}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
