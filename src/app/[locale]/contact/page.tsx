"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const transitionClasses =
  "transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]";
const visibleClasses = "translate-y-0 opacity-100";
const hiddenClasses = "translate-y-12 opacity-0";

export default function ContactPage() {
  const t = useTranslations('contact');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={sectionRef} className="min-h-screen bg-[#111] pt-32 pb-24 px-6 sm:px-8 lg:px-12 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#c9a962]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#c9a962]/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div
            className={`flex items-center justify-center gap-3 ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses
              }`}
          >
            <span className="h-px w-12 bg-[#c9a962]/60" aria-hidden />
            <span className="font-barlow-c text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a962]">
              {t('subtitle')}
            </span>
            <span className="h-px w-12 bg-[#c9a962]/60" aria-hidden />
          </div>
          <h1 className={`mt-6 font-gilda text-5xl sm:text-6xl lg:text-7xl text-[#f5f0e8] tracking-wide ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses
            }`} style={{ transitionDelay: "100ms" }}>
            {t('heading')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Side: Contact Info */}
          <div className={`${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: "200ms" }}>
            <h2 className="font-gilda text-3xl text-[#f5f0e8] mb-8">{t('visitHeading')}</h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-full border border-[#c9a962]/30 flex items-center justify-center shrink-0 group-hover:bg-[#c9a962]/10 transition-colors">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-sm font-bold mb-2">{t('locationLabel')}</h3>
                  <p className="font-barlow text-[#a39e94] text-lg leading-relaxed whitespace-pre-line">
                    {t('locationText')}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-full border border-[#c9a962]/30 flex items-center justify-center shrink-0 group-hover:bg-[#c9a962]/10 transition-colors">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-sm font-bold mb-2">{t('hoursLabel')}</h3>
                  <p className="font-barlow text-[#a39e94] text-lg leading-relaxed whitespace-pre-line">
                    {t('hoursText')}
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-full border border-[#c9a962]/30 flex items-center justify-center shrink-0 group-hover:bg-[#c9a962]/10 transition-colors">
                  <svg className="w-5 h-5 text-[#c9a962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-sm font-bold mb-2">{t('contactLabel')}</h3>
                  <p className="font-barlow text-[#a39e94] text-lg leading-relaxed whitespace-pre-line">
                    {t('contactText')}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle Map Placeholder */}
            <div className="mt-12 group overflow-hidden rounded-xl border border-[#c9a962]/20 relative aspect-video">
              <div className="absolute inset-0 bg-[#c9a962]/5 animate-pulse" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <svg className="w-12 h-12 text-[#c9a962] mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <div className="font-barlow-c text-[#c9a962] uppercase tracking-[0.2em] text-xs">{t('mapLoading')}</div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className={`${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`} style={{ transitionDelay: "300ms" }}>
            <div className="bg-[#1a1a1a]/50 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-[#c9a962]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a962]/10 rounded-full blur-3xl -mr-16 -mt-16" />

              <h2 className="font-gilda text-3xl text-[#f5f0e8] mb-2 relative z-10">{t('formHeading')}</h2>
              <p className="font-barlow text-[#a39e94] mb-10 relative z-10">{t('formDescription')}</p>

              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-[11px] font-bold">{t('firstName')}</label>
                    <input type="text" className="w-full bg-[#111]/80 border-b border-[#c9a962]/20 focus:border-[#c9a962] px-0 py-3 font-barlow text-[#f5f0e8] outline-none transition-colors" placeholder={t('firstNamePlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <label className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-[11px] font-bold">{t('lastName')}</label>
                    <input type="text" className="w-full bg-[#111]/80 border-b border-[#c9a962]/20 focus:border-[#c9a962] px-0 py-3 font-barlow text-[#f5f0e8] outline-none transition-colors" placeholder={t('lastNamePlaceholder')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-[11px] font-bold">{t('email')}</label>
                  <input type="email" className="w-full bg-[#111]/80 border-b border-[#c9a962]/20 focus:border-[#c9a962] px-0 py-3 font-barlow text-[#f5f0e8] outline-none transition-colors" placeholder={t('emailPlaceholder')} />
                </div>

                <div className="space-y-2">
                  <label className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-[11px] font-bold">{t('subject')}</label>
                  <select className="w-full bg-[#111]/80 border-b border-[#c9a962]/20 focus:border-[#c9a962] px-0 py-3 font-barlow text-[#f5f0e8] outline-none transition-colors appearance-none cursor-pointer">
                    <option className="bg-[#111]">{t('subjectReservation')}</option>
                    <option className="bg-[#111]">{t('subjectEvent')}</option>
                    <option className="bg-[#111]">{t('subjectGeneral')}</option>
                    <option className="bg-[#111]">{t('subjectFeedback')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-barlow-c text-[#c9a962] uppercase tracking-widest text-[11px] font-bold">{t('message')}</label>
                  <textarea rows={4} className="w-full bg-[#111]/80 border-b border-[#c9a962]/20 focus:border-[#c9a962] px-0 py-3 font-barlow text-[#f5f0e8] outline-none transition-colors resize-none" placeholder={t('messagePlaceholder')}></textarea>
                </div>

                <button className="w-full mt-4 bg-[#c9a962] hover:bg-[#d4b978] text-[#111] font-barlow-c font-bold uppercase tracking-[0.2em] py-5 rounded transition-all duration-300 transform hover:translate-y-[-2px] active:translate-y-[0px] shadow-lg shadow-[#c9a962]/20">
                  {t('submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
