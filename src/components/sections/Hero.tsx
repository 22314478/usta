"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { getSiteSettings, SiteSettings } from "@/lib/siteStore";

const TRANSITION_MS = 1000;
const MOBILE_BREAKPOINT = 768;

function ButtonArrow({
  arrowReEntering,
  onAnimationEnd,
}: {
  arrowReEntering: boolean;
  onAnimationEnd: () => void;
}) {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
      <Image
        src="/images/Button-Shape.png"
        alt=""
        width={40}
        height={40}
        className="absolute inset-0 h-full w-full object-contain"
        aria-hidden
      />
      <span
        className={`relative z-10 flex h-10 w-10 items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-full ${arrowReEntering ? "animate-enter-from-left" : ""}`}
        onAnimationEnd={onAnimationEnd}
      >
        <Image
          src="/images/RightArrow.png"
          alt=""
          width={24}
          height={8}
          className="object-contain"
          aria-hidden
        />
      </span>
    </span>
  );
}

function SlideContent({
  slide,
  index,
  showLink,
  arrowReEntering,
  onButtonMouseLeave,
  onArrowAnimationEnd,
}: {
  slide: SiteSettings['hero']['slides'][number];
  index: number;
  showLink: boolean;
  arrowReEntering: boolean;
  onButtonMouseLeave: () => void;
  onArrowAnimationEnd: () => void;
}) {
  const t = useTranslations('hero');
  const slideKey = `slide${index + 1}`;
  
  return (
    <>
      <p
        className="font-barlow-c flex items-center gap-4 font-normal uppercase tracking-[0.35em] text-header-accent"
        style={{ fontSize: "28px" }}
      >
        <span className="h-px w-8 bg-header-accent/70" aria-hidden />
        {t(`${slideKey}.subheading`) || slide.subheading}
        <span className="h-px w-8 bg-header-accent/70" aria-hidden />
      </p>
      <h1 className="font-gilda mt-6 text-4xl font-normal uppercase tracking-wide text-white sm:text-5xl md:text-6xl lg:text-7xl">
        {t(`${slideKey}.heading1`) || slide.heading1}
        <br />
        {t(`${slideKey}.heading2`) || slide.heading2}
      </h1>
      <p className="mt-6 max-w-lg font-gilda text-base leading-relaxed text-white/95 sm:text-lg md:text-2xl">
        {t(`${slideKey}.description`) || slide.description}
      </p>
      {showLink && (
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/menu"
            className="group font-barlow-c inline-flex h-14 w-full max-w-[280px] items-center justify-center gap-6 overflow-hidden rounded-lg border border-[#A68B5B] bg-[#1A1A1A] px-5 py-3 text-base font-semibold uppercase leading-none tracking-wide text-white transition-colors hover:border-[#B89B6B] hover:bg-[#252525] sm:h-[78px] sm:max-w-[280px] sm:gap-8 sm:px-6 sm:py-4 sm:text-[20px]"
            onMouseLeave={onButtonMouseLeave}
          >
            {t('viewMenu')}
            <ButtonArrow
              arrowReEntering={arrowReEntering}
              onAnimationEnd={onArrowAnimationEnd}
            />
          </Link>
        </div>
      )}
    </>
  );
}

type Phase = "idle" | "out" | "in";

export function Hero() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [initialFadeDone, setInitialFadeDone] = useState(false);
  const [prevFlip, setPrevFlip] = useState(false);
  const [nextFlip, setNextFlip] = useState(false);
  const [arrowReEntering, setArrowReEntering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const slides = settings?.hero.slides || [];

  const goPrev = useCallback(() => {
    if (phase !== "idle" || slides.length === 0) return;
    clearTimer();
    const next = (index - 1 + slides.length) % slides.length;
    setPhase("out");
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIndex(next);
      setPhase("in");
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setPhase("idle");
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  }, [index, phase, clearTimer, slides.length]);

  const goNext = useCallback(() => {
    if (phase !== "idle" || slides.length === 0) return;
    clearTimer();
    const next = (index + 1) % slides.length;
    setPhase("out");
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIndex(next);
      setPhase("in");
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setPhase("idle");
      }, TRANSITION_MS);
    }, TRANSITION_MS);
  }, [index, phase, clearTimer, slides.length]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const currentSlideIndex = isMobile ? 0 : index;

  const handleButtonMouseLeave = useCallback(() => setArrowReEntering(true), []);
  const handleArrowAnimationEnd = useCallback(() => setArrowReEntering(false), []);

  const showTransition =
    !isMobile &&
    (!initialFadeDone && phase === "idle"
      ? "animate-fade-in-up"
      : phase === "out"
        ? "animate-fade-out"
        : phase === "in"
          ? "animate-fade-in"
          : "");

  return (
    <section className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0">
        {isMobile ? (
          slides[0] && (
            <Image
              key={slides[0].image}
              src={slides[0].image}
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          )
        ) : (
          slides.map((slide, i) => (
            <Image
              key={slide.image}
              src={slide.image}
              alt=""
              fill
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              priority={i === 0}
              sizes="100vw"
            />
          ))
        )}
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      </div>

      <div className="relative min-h-screen">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-32 text-center sm:px-8">
          <div
            key={isMobile ? "mobile" : `${phase}-${index}`}
            className={`flex w-full max-w-2xl flex-col items-center ${showTransition}`}
            onAnimationEnd={() => {
              if (!initialFadeDone && phase === "idle" && !isMobile)
                setInitialFadeDone(true);
            }}
          >
            {slides[currentSlideIndex] && (
              <SlideContent
                slide={slides[currentSlideIndex]}
                index={currentSlideIndex}
                showLink
                arrowReEntering={arrowReEntering}
                onButtonMouseLeave={handleButtonMouseLeave}
                onArrowAnimationEnd={handleArrowAnimationEnd}
              />
            )}
          </div>
        </div>
      </div>

      {!isMobile && (
        <>
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              type="button"
              onClick={goPrev}
              onMouseLeave={() => setPrevFlip(true)}
              className="group flex h-[120px] w-[120px] -translate-x-1/4 origin-center items-center justify-center rounded-full border border-white/50 bg-transparent transition-[transform,background-color,border-color] duration-500 ease-in-out delay-0 hover:scale-150 hover:border-white/50 hover:delay-500 lg:h-60 lg:w-60"
              aria-label="Previous slide"
            >
              <span
                className={`inline-flex origin-center scale-50 opacity-50 transition-transform duration-500 ease-in-out group-hover:translate-x-2 lg:scale-100 ${prevFlip ? "animate-flip-x" : ""}`}
                onAnimationEnd={() => setPrevFlip(false)}
              >
                <Image src="/images/LeftArrow.png" alt="" width={60} height={20} className="object-contain" aria-hidden />
              </span>
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center justify-end">
            <button
              type="button"
              onClick={goNext}
              onMouseLeave={() => setNextFlip(true)}
              className="group flex h-[120px] w-[120px] translate-x-1/4 origin-center items-center justify-center rounded-full border border-white/50 bg-transparent transition-[transform,background-color,border-color] duration-500 ease-in-out delay-0 hover:scale-150 hover:border-white/50 hover:delay-500 lg:h-60 lg:w-60"
              aria-label="Next slide"
            >
              <span
                className={`inline-flex origin-center scale-50 opacity-50 transition-transform duration-500 ease-in-out group-hover:-translate-x-2 lg:scale-100 ${nextFlip ? "animate-flip-x" : ""}`}
                onAnimationEnd={() => setNextFlip(false)}
              >
                <Image src="/images/RightArrow.png" alt="" width={60} height={20} className="object-contain" aria-hidden />
              </span>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
