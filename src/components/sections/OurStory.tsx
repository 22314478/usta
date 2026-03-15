"use client";

import React from "react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getSiteSettings, SiteSettings } from "@/lib/siteStore";

const STORY_MOBILE_BREAKPOINT = 1024;

export function OurStory() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstMarkerRef = useRef<HTMLDivElement>(null);
  const lastMarkerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [lineStartTop, setLineStartTop] = useState(0);
  const [isMobileLayout, setIsMobileLayout] = useState(true);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  const story = settings?.story;

  const STORY_BLOCKS = [
    {
      id: "01",
      image: story?.blocks[0]?.image || "/images/landscape3.webp",
      imageAlt: "Story 1",
      heading: story?.blocks[0]?.heading || "",
      body: story?.blocks[0]?.description || "",
    },
    {
      id: "02",
      image: story?.blocks[1]?.image || "/images/wine_menu2.webp",
      imageAlt: "Story 2",
      heading: story?.blocks[1]?.heading || "",
      body: story?.blocks[1]?.description || "",
    },
    {
      id: "03",
      image: story?.blocks[2]?.image || "/images/square_table.webp",
      imageAlt: "Story 3",
      heading: story?.blocks[2]?.heading || "",
      body: story?.blocks[2]?.description || "",
    },
  ];

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${STORY_MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = (e: MediaQueryListEvent) => setIsMobileLayout(e.matches);
    setIsMobileLayout(mq.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const firstMarker = firstMarkerRef.current;
    const lastMarker = lastMarkerRef.current;
    if (!section || !container || !firstMarker || !lastMarker || isMobileLayout) return;

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const firstMarkerRect = firstMarker.getBoundingClientRect();
      const lastMarkerRect = lastMarker.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const containerRect = container.getBoundingClientRect();
      const lineStartOffset = firstMarkerRect.height * 0.3;
      const lineStartY = firstMarkerRect.top + lineStartOffset;
      const lineStartPosition = lineStartY - containerRect.top;
      setLineStartTop(lineStartPosition);

      const lastMarkerCenter = lastMarkerRect.top + lastMarkerRect.height / 2;
      const calculatedLineHeight = (lastMarkerCenter - lineStartY) - 100;
      setLineHeight(calculatedLineHeight);

      const lastMarkerCenterY = lastMarkerRect.top + lastMarkerRect.height / 2;
      const lineEndY = lastMarkerCenterY - 100;
      
      const totalDistance = lineEndY - lineStartY;
      
      let progress = 0;
      if (lineStartY <= viewportHeight) {
        const scrolledFromLineStart = viewportHeight - lineStartY;
        if (totalDistance > 0) {
          progress = Math.max(0, Math.min(1, scrolledFromLineStart / totalDistance));
        } else {
          progress = 1;
        }
      }
      setScrollProgress(progress);

      const scrolledIntoView = viewportHeight - rect.top;
      setParallaxOffset(scrolledIntoView * 0.2);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [isMobileLayout]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#111] py-24 px-6 sm:px-8 lg:py-32"
      aria-labelledby="our-story-heading"
    >
      <div ref={containerRef} className="relative mx-auto max-w-7xl">
        <header className="mb-16 text-center lg:mb-20">
          <h2 id="our-story-heading" className="font-gilda text-4xl font-normal tracking-wide text-[#f5f0e8] sm:text-5xl lg:text-6xl">
            {story?.heading}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#c9a962]/60 sm:w-24" aria-hidden />
            <span className="text-[#c9a962]" aria-hidden>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="opacity-80">
                <path d="M6 2L4 6h4L6 2zm0 4L4 10h4L6 6z" />
              </svg>
            </span>
            <span className="h-px w-16 bg-[#c9a962]/60 sm:w-24" aria-hidden />
          </div>
          <p className="mt-2 font-barlow-c text-sm font-medium uppercase tracking-[0.35em] text-[#a39e94]">
            {story?.subtitle}
          </p>
        </header>

        <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-12 sm:left-8 sm:w-16 lg:left-0 lg:block lg:w-48" aria-hidden style={{ zIndex: 0 }}>
          <div className="absolute left-1/2 w-px -translate-x-1/2 overflow-hidden" style={{ top: lineStartTop > 0 ? `${lineStartTop}px` : "148px", height: lineHeight > 0 ? `${lineHeight}px` : "500px" }}>
            <div className="w-px bg-[#c9a962] transition-[height] duration-150 ease-out" style={{ height: scrollProgress > 0 ? `${Math.min(scrollProgress * 100, 100)}%` : "0%" }} />
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-x-8 gap-y-0 lg:grid-cols-[12rem_1fr] lg:gap-x-12">
          {STORY_BLOCKS.map((block, index) => (
            <React.Fragment key={block.id}>
              <div ref={index === 0 ? firstMarkerRef : index === 2 ? lastMarkerRef : null} className="relative hidden min-h-[220px] items-start justify-center py-8 lg:flex lg:min-h-[280px] lg:py-0" style={{ zIndex: 10, position: 'relative' }}>
                <div className="relative top-[68px] lg:top-[150px]" style={{ zIndex: 10, position: 'relative' }}>
                  <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#111' }}>
                    <Image src="/images/Button-Shape-Large-Filled-75-10.png" alt="" width={160} height={160} className="relative h-auto w-32 sm:w-40 lg:w-40" style={{ position: 'relative', zIndex: 10 }} aria-hidden />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-barlow-c text-2xl font-semibold text-white lg:text-3xl" style={{ zIndex: 11 }}>
                      {block.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`flex min-h-0 flex-col pb-12 lg:min-h-[280px] lg:pb-24 ${index === 2 ? "lg:-mt-[100px]" : ""}`}>
                <div className="relative h-[280px] w-full overflow-hidden sm:h-[340px] lg:h-[500px]">
                  <div className="absolute inset-0 transition-transform duration-75 ease-out" style={{ transform: isMobileLayout ? "none" : `translateY(${parallaxOffset * (index % 2 === 0 ? 0.3 : -0.2)}px)` }}>
                    <Image src={block.image} alt={block.imageAlt} fill className={`object-cover ${index === 2 ? "object-bottom" : ""}`} sizes="(min-width: 1024px) 100vw, 100vw" />
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 px-0 sm:flex-row sm:items-center sm:gap-4 lg:mt-8 lg:gap-6 lg:px-28">
                  {index % 2 === 0 ? (
                    <>
                      <h3 className="flex-shrink-0 text-left font-gilda text-2xl font-normal text-[#f5f0e8] sm:text-3xl sm:text-4xl lg:text-5xl">{block.heading}</h3>
                      <span className="hidden h-full w-px shrink-0 self-stretch bg-[#c9a962] lg:block" aria-hidden />
                      <p className="flex-1 text-left font-barlow leading-relaxed text-[#a39e94] text-base sm:text-lg lg:text-[24px]">{block.body}</p>
                    </>
                  ) : (
                    <>
                      <p className="flex-1 text-left font-barlow leading-relaxed text-[#a39e94] sm:text-right lg:text-right text-base sm:text-lg lg:text-[24px]">{block.body}</p>
                      <span className="hidden h-full w-px shrink-0 self-stretch bg-[#c9a962] lg:block" aria-hidden />
                      <h3 className="flex-shrink-0 text-left font-gilda text-2xl font-normal text-[#f5f0e8] sm:text-3xl sm:text-4xl lg:text-5xl">{block.heading}</h3>
                    </>
                  )}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
