"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations('footer');
  const tHeader = useTranslations('header');

  const EXPLORE_LINKS = [
    { href: "/", label: tHeader('home') },
    { href: "/#our-story-heading", label: tHeader('about') },
    { href: "/menu", label: tHeader('menu') },
    { href: "/events", label: tHeader('events') },
    { href: "/contact", label: tHeader('contact') },
  ];

  return (
    <footer className="text-white font-barlow">
      <div className="bg-[#212121]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Branding + Social */}
            <div className="space-y-4">
              <h2 className="font-allura text-4xl font-normal text-white">
                Usta Cadde
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-white/90">
                {t('description')}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 transition hover:text-white"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 transition hover:text-white"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 transition hover:text-white"
                  aria-label="YouTube"
                >
                  <YouTubeIcon />
                </a>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                {t('explore')}
              </h3>
              <ul className="space-y-3">
                {EXPLORE_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href as any}
                      className="text-sm text-white/90 transition hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                {t('contact')}
              </h3>
              <address className="not-italic">
                <p className="text-sm text-white/90">
                  {t('address')}
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/90">
                  <PhoneIcon />
                  <a href={`tel:${t('phone')}`} className="hover:text-white">
                    {t('phone')}
                  </a>
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/90">
                  <EmailIcon />
                  <a
                    href={`mailto:${t('email')}`}
                    className="hover:text-white"
                  >
                    {t('email')}
                  </a>
                </p>
              </address>
            </div>

            {/* Column 4: Language Switcher */}
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                {t('language')}
              </h3>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#1e1e1e]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-white/60 sm:flex-row lg:px-8">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
