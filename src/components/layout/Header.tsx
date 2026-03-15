"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

function CrestLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-header-accent"
      aria-hidden
    >
      <path
        d="M5 25C10 20 15 30 20 25C25 20 30 30 35 25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M5 20C10 15 15 25 20 20C25 15 30 25 35 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-60"
      />
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1" className="opacity-20" />
    </svg>
  );
}

const LOCALES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const changeLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setShowLangMenu(false);
  };

  const currentLocale = LOCALES.find(l => l.code === locale);

  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-50 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-header-accent transition-opacity hover:opacity-80" aria-label="Maza Lefkoşa home">
            <CrestLogo />
          </Link>

          <Link
            href="/"
            className="font-allura text-4xl tracking-wide text-header-accent text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Maza
          </Link>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="text-header-accent transition-opacity hover:opacity-80 text-2xl"
                aria-label="Change language"
              >
                {currentLocale?.flag}
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-header-accent/20 py-2 min-w-[150px] z-50">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => changeLocale(loc.code)}
                      className={`w-full px-4 py-2 text-left hover:bg-header-accent/10 transition-colors flex items-center gap-2 ${locale === loc.code ? 'text-header-accent' : 'text-white'
                        }`}
                    >
                      <span>{loc.flag}</span>
                      <span className="text-sm">{loc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
