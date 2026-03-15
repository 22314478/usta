"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useState } from 'react';

const LOCALES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const changeLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setShowMenu(false);
  };

  const currentLocale = LOCALES.find(l => l.code === locale);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 text-white hover:text-header-accent transition-colors"
        aria-label="Change language"
      >
        <span className="text-2xl">{currentLocale?.flag}</span>
        <span className="text-sm">{currentLocale?.name}</span>
      </button>
      {showMenu && (
        <div className="absolute bottom-full mb-2 bg-[#1a1a1a] rounded-lg shadow-xl border border-header-accent/20 py-2 min-w-[150px]">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => changeLocale(loc.code)}
              className={`w-full px-4 py-2 text-left hover:bg-header-accent/10 transition-colors flex items-center gap-2 ${
                locale === loc.code ? 'text-header-accent' : 'text-white'
              }`}
            >
              <span>{loc.flag}</span>
              <span className="text-sm">{loc.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
