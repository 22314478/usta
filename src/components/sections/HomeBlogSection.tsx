"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getLatestPosts } from "@/lib/blog";
import { ImageWithOverlay } from "@/components/blog/BlogPostList";

const transitionClasses =
  "transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]";
const visibleClasses = "translate-y-0 opacity-100";
const hiddenClasses = "translate-y-12 opacity-0";

export function HomeBlogSection() {
  const t = useTranslations('homeBlog');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [revealedByIndex, setRevealedByIndex] = useState<Record<number, boolean>>({});
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const latestPosts = getLatestPosts(2);

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

  useEffect(() => {
    const observed = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const idx = el.getAttribute("data-post-index");
          if (idx === null) return;
          const i = parseInt(idx, 10);
          if (observed.has(i)) return;
          observed.add(i);
          setRevealedByIndex((prev) => ({ ...prev, [i]: true }));
        });
      },
      { threshold: 0.8, rootMargin: "0px 0px -10% 0px" }
    );

    for (let i = 0; i < latestPosts.length; i++) {
      const el = articleRefs.current[i];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [latestPosts.length]);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: "#111" }}
      aria-labelledby="resources-articles-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <header className="mb-12 text-center md:mb-16">
          <h2
            id="resources-articles-heading"
            className={`font-gilda text-4xl font-normal tracking-wide text-[#f5f0e8] sm:text-5xl lg:text-6xl ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
          >
            {t('heading')}
          </h2>
          {/* Golden line + fork/knife icon + golden line */}
          <div
            className={`mt-4 flex items-center justify-center gap-3 ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "50ms" : "0ms" }}
          >
            <span
              className="h-px w-16 bg-[#c9a962]/70 sm:w-24 lg:w-32"
              aria-hidden
            />
            <span
              className="flex items-center justify-center text-[#c9a962]"
              aria-hidden
            >
              <Image
                src="/images/restaurant.svg"
                alt=""
                width={28}
                height={29}
                className="h-6 w-6 object-contain opacity-90 sm:h-7 sm:w-7"
              />
            </span>
            <span
              className="h-px w-16 bg-[#c9a962]/70 sm:w-24 lg:w-32"
              aria-hidden
            />
          </div>
          <p
            className={`mt-3 font-barlow-c text-lg font-medium uppercase tracking-[0.35em] text-[#c9a962] ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
          >
            {t('subtitle')}
          </p>
          <p
            className={`mx-auto mt-4 max-w-2xl font-barlow text-base leading-relaxed text-[#cccccc] sm:text-lg ${transitionClasses} ${
              isVisible ? visibleClasses : hiddenClasses
            }`}
            style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
          >
            {t('description')}
          </p>
        </header>

        {/* Latest 2 blog posts — alternating layout, same overlay animation as blog page */}
        <div className="space-y-8 md:space-y-10">
          {latestPosts.map((post, index) => {
            const imageBlock = (
              <ImageWithOverlay
                key={`${post.title}-img`}
                post={post}
                shouldReveal={!!revealedByIndex[index]}
              />
            );
            const contentBlock = (
              <div
                key={`${post.title}-content`}
                className="flex flex-col justify-center px-8 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
              >
                <span className="mb-4 inline-block w-fit border border-[#c9a962] bg-[#111] px-6 py-1 font-barlow-c text-[20px] font-medium uppercase tracking-widest text-[#c9a962]">
                  {post.tag}
                </span>
                <h3 className="font-gilda text-2xl font-normal leading-tight text-white sm:text-3xl lg:text-4xl">
                  {post.title}
                </h3>
                <p className="mt-4 font-barlow text-base leading-relaxed text-[#cccccc] sm:text-lg">
                  {post.excerpt}
                </p>
                <p className="mt-5 font-barlow text-sm text-[#cccccc]">
                  <span className="text-[#c9a962]">by</span> {post.author}
                </p>
                <Link
                  href={post.href}
                  className="mt-8 inline-flex w-fit items-center justify-center rounded-md border border-[#c9a962] bg-[#111] px-8 py-3 font-barlow-c text-base font-semibold uppercase tracking-widest text-[#c9a962] transition-colors hover:bg-[#1a1a1a] hover:border-[#d4b978]"
                >
                  {t('readMore')}
                </Link>
              </div>
            );
            const isImageLeft = index % 2 === 0;
            return (
              <article
                ref={(el) => {
                  articleRefs.current[index] = el;
                }}
                data-post-index={index}
                key={post.title}
                className={`grid min-h-0 grid-cols-1 overflow-hidden rounded-sm bg-[#1e1e1e] md:grid-cols-[1fr_1fr] md:min-h-[320px] ${transitionClasses} ${
                  isVisible ? visibleClasses : hiddenClasses
                }`}
                style={{
                  transitionDelay: isVisible ? `${200 + index * 100}ms` : "0ms",
                }}
              >
                {isImageLeft ? imageBlock : contentBlock}
                {isImageLeft ? contentBlock : imageBlock}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
