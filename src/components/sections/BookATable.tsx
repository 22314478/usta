"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const transitionClasses =
  "transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]";
const visibleClasses = "translate-y-0 opacity-100";
const hiddenClasses = "translate-y-12 opacity-0";

export function BookATable() {
  const t = useTranslations('booking');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      date: formData.get('date'),
      guests: formData.get('guests'),
      createdAt: serverTimestamp(),
      status: 'pending'
    };

    try {
      await addDoc(collection(db, "reservations"), data);
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Error adding reservation: ", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden pt-[60px]"
      style={{ backgroundColor: "#111" }}
      aria-labelledby="book-a-table-heading"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 h-full min-h-[520px] sm:min-h-[600px] lg:min-h-[680px]">
        <Image
          src="/images/slide-2.webp"
          alt="Elegant restaurant interior with tables and warm ambiance"
          fill
          className="object-cover object-center opacity-50"
          sizes="100vw"
          priority={false}
        />
        {/* Radial overlay (vignette) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(17,17,17,0.3) 60%, #111 100%)",
          }}
          aria-hidden
        />
        {/* Left fade */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #111 0%, #111 8%, rgba(17,17,17,0.6) 22%, transparent 42%)",
          }}
          aria-hidden
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, #111 0%, #111 8%, rgba(17,17,17,0.6) 22%, transparent 42%)",
          }}
          aria-hidden
        />
        {/* Top fade */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #111 0%, rgba(17,17,17,0.5) 12%, transparent 28%)",
          }}
          aria-hidden
        />
        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #111 0%, rgba(17,17,17,0.5) 12%, transparent 28%)",
          }}
          aria-hidden
        />
      </div>

      {/* Centered content: no form container background */}
      <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[600px] sm:px-6 sm:py-16 lg:min-h-[680px]">
        {/* GET IN TOUCH with lines — centered */}
        <div
          className={`flex items-center justify-center gap-3 ${transitionClasses} ${
            isVisible ? visibleClasses : hiddenClasses
          }`}
          style={{ transitionDelay: isVisible ? "50ms" : "0ms" }}
        >
          <span
            className="h-px w-8 bg-[#c9a962]/80 sm:w-12"
            aria-hidden
          />
          <span
            className="font-barlow-c text-[28px] font-semibold uppercase tracking-[0.25em] text-[#c9a962]"
            aria-hidden
          >
            {t('subtitle')}
          </span>
          <span
            className="h-px w-8 bg-[#c9a962]/80 sm:w-12"
            aria-hidden
          />
        </div>

        <h2
          id="book-a-table-heading"
          className={`mt-4 font-gilda text-4xl font-normal tracking-wide text-[#f5f0e8] sm:text-5xl ${transitionClasses} ${
            isVisible ? visibleClasses : hiddenClasses
          }`}
          style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
        >
          {t('heading')}
        </h2>
        <p
          className={`mx-auto mt-3 max-w-xl font-barlow text-base leading-relaxed text-[#f5f0e8] sm:text-lg ${transitionClasses} ${
            isVisible ? visibleClasses : hiddenClasses
          }`}
          style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
        >
          {t('description')}
        </p>

        {/* Form: no wrapper background, rounded layout with spacing */}
        <form
          className={`mt-10 w-full max-w-md space-y-4 rounded-lg px-2 sm:px-0 ${transitionClasses} ${
            isVisible ? visibleClasses : hiddenClasses
          }`}
          style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">{t('form.name')}</span>
              <input
                type="text"
                name="name"
                required
                placeholder={t('form.name')}
                className="w-full rounded-md border-0 bg-[#1F1F1F]/90 px-4 py-3 font-barlow text-[#e8e8e8] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#c9a962]/50"
              />
            </label>
            <label className="block">
              <span className="sr-only">{t('form.date')}</span>
              <input
                type="date"
                name="date"
                required
                placeholder={t('form.date')}
                className="w-full rounded-md border-0 bg-[#1F1F1F]/90 px-4 py-3 font-barlow text-[#e8e8e8] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#c9a962]/50"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">{t('form.email')}</span>
              <input
                type="email"
                name="email"
                required
                placeholder={t('form.email')}
                className="w-full rounded-md border-0 bg-[#1F1F1F]/90 px-4 py-3 font-barlow text-[#e8e8e8] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#c9a962]/50"
              />
            </label>
            <label className="block">
              <span className="sr-only">{t('form.guests')}</span>
              <input
                type="number"
                name="guests"
                required
                placeholder={t('form.guests')}
                min={1}
                max={20}
                className="w-full rounded-md border-0 bg-[#1F1F1F]/90 px-4 py-3 font-barlow text-[#e8e8e8] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#c9a962]/50"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`mt-2 w-full rounded-md px-6 py-4 font-barlow-c text-base font-semibold uppercase tracking-widest text-[#1a1a1a] transition-all focus:outline-none focus:ring-2 focus:ring-[#c9a962]/50 ${
              status === 'loading' ? 'bg-[#c9a962]/50 cursor-not-allowed' : 'bg-[#EBAA54] hover:bg-[#d4a04a]'
            }`}
          >
            {status === 'loading' ? '...' : t('form.submit')}
          </button>

          {status === 'success' && (
            <p className="mt-4 text-[#c9a962] font-barlow animate-in fade-in slide-in-from-top-2">
              {t('form.success')}
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-500 font-barlow animate-in fade-in slide-in-from-top-2">
              {t('form.error')}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
