"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

export function ImageWithOverlay({
  post,
  shouldReveal,
}: {
  post: BlogPost;
  shouldReveal: boolean;
}) {
  return (
    <div className="relative min-h-[260px] sm:min-h-[320px] md:h-full md:min-h-[320px] overflow-hidden border-b-[0.5px] border-b-[#ffcf82]">
      <Image
        src={post.image}
        alt={post.imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0 z-10 bg-[#ffcf82] transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: shouldReveal ? "translateY(-100%)" : "translateY(0)",
        }}
        aria-hidden
      />
    </div>
  );
}

export function BlogPostList({ posts }: { posts: BlogPost[] }) {
  const [revealedByIndex, setRevealedByIndex] = useState<Record<number, boolean>>({});
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

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

    for (let i = 0; i < posts.length; i++) {
      const el = articleRefs.current[i];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [posts.length]);

  return (
    <div className="mx-auto max-w-5xl space-y-16">
      {posts.map((post, index) => {
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
            <span className="mb-4 inline-block w-fit bg-[#111] px-6 py-1 font-barlow-c text-[20px] font-medium uppercase tracking-widest text-header-accent">
              {post.tag}
            </span>
            <h2 className="font-gilda text-2xl font-normal leading-tight text-white sm:text-3xl lg:text-4xl">
              {post.title}
            </h2>
            <p className="mt-4 font-barlow text-base leading-relaxed text-[#cccccc] sm:text-lg">
              {post.excerpt}
            </p>
            <p className="mt-5 font-barlow text-sm text-[#cccccc]">
              <span className="text-header-accent">by</span> {post.author}
            </p>
            <Link
              href={post.href}
              className="mt-8 inline-flex w-fit items-center justify-center rounded-md border border-[#dfb18780] bg-[#111] px-8 py-3 font-barlow-c text-base font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#1a1a1a]"
            >
              Read More
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
            className="grid min-h-0 grid-cols-1 overflow-hidden rounded-sm bg-[#1e1e1e] md:grid-cols-[1fr_1fr] md:min-h-[320px] opacity-0 animate-fade-in-up [animation-fill-mode:forwards]"
            style={{ animationDelay: index === 0 ? "0ms" : "350ms" }}
          >
            {isImageLeft ? imageBlock : contentBlock}
            {isImageLeft ? contentBlock : imageBlock}
          </article>
        );
      })}
    </div>
  );
}
