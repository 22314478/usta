"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { getReviews, Review } from "@/lib/api";

const transitionClasses =
  "transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]";
const visibleClasses = "translate-y-0 opacity-100";
const hiddenClasses = "translate-y-12 opacity-0";

export function CustomerReviews() {
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    getReviews(locale).then(data => {
      setReviews(data);
      setActiveId(data[0]?.id || "");
      setLoading(false);
    });
  }, [locale]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || loading) return;

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
  }, [loading]);

  const activeReview = reviews.find((r) => r.id === activeId) ?? reviews[0];

  if (loading || reviews.length === 0) {
    return null;
  }

  if (!activeReview) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: "#111" }}
      aria-label="Customer reviews"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-0 rounded overflow-hidden ${transitionClasses} ${
            isVisible ? visibleClasses : hiddenClasses
          }`}
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
        >
          {/* Left: Tab list */}
          <div className="lg:col-span-4 bg-[#1A1A1A] p-6 md:p-8">
            <ul className="space-y-0" role="tablist" aria-label="Customer reviews">
              {reviews.map((review) => {
                const isActive = activeId === review.id;
                return (
                  <li key={review.id}>
                    <div className="border-b border-white/5 last:border-b-0">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`review-panel-${review.id}`}
                        id={`tab-${review.id}`}
                        onClick={() => setActiveId(review.id)}
                        className="w-full flex items-center gap-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
                      >
                        <span
                          className={`relative flex-shrink-0 w-14 h-14 rounded-full overflow-hidden ring-2 transition-colors ${
                            isActive
                              ? "ring-[#c9a962] ring-offset-2 ring-offset-[#1A1A1A]"
                              : "ring-transparent"
                          }`}
                        >
                          <Image
                            src={review.image}
                            alt=""
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        </span>
                        <span className="font-[family-name:var(--font-barlow-c)] text-sm uppercase tracking-widest text-[#c9a962] leading-tight">
                          {review.name.split(" ").map((part, i) => (
                            <span key={i} className="block">
                              {part}
                            </span>
                          ))}
                        </span>
                      </button>
                      {isActive && (
                        <span
                          className="block h-0.5 w-full bg-[#c9a962]"
                          aria-hidden
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: Review content */}
          <div className="lg:col-span-8 bg-[#1A1A1A] p-6 md:p-8 lg:p-10 relative">
            <div
              role="tabpanel"
              id={`review-panel-${activeReview.id}`}
              aria-labelledby={`tab-${activeReview.id}`}
              className="relative"
            >
              {/* Decorative quote image */}
              <Image
                src="/images/quote.png"
                alt=""
                width={128}
                height={128}
                className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 object-contain opacity-40 pointer-events-none"
                aria-hidden
              />

              {/* Stars and text below quote */}
              <div className="pt-16 md:pt-20">
              <div className="flex gap-0.5 mb-4" aria-hidden>
                {Array.from({ length: activeReview.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#c9a962]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="font-[family-name:var(--font-barlow)] text-base md:text-lg text-[#EEEEEE] leading-relaxed max-w-2xl">
                {activeReview?.text}
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
