'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';

const CONSENT_COOKIE_NAME = 'escreva_mais_cookie_notice';
const CONSENT_COOKIE_VALUE = 'accepted';
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;
const COOKIE_NOTICE_EVENT = 'cookie-notice-change';

function readConsentCookie() {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie
    .split(';')
    .map((entry) => entry.trim())
    .some((entry) => entry === `${CONSENT_COOKIE_NAME}=${CONSENT_COOKIE_VALUE}`);
}

function persistConsentCookie() {
  document.cookie = `${CONSENT_COOKIE_NAME}=${CONSENT_COOKIE_VALUE}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
  window.dispatchEvent(new Event(COOKIE_NOTICE_EVENT));
}

function subscribeToCookieNotice(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const notify = () => onStoreChange();

  window.addEventListener(COOKIE_NOTICE_EVENT, notify);
  window.addEventListener('focus', notify);
  window.addEventListener('pageshow', notify);
  document.addEventListener('visibilitychange', notify);

  return () => {
    window.removeEventListener(COOKIE_NOTICE_EVENT, notify);
    window.removeEventListener('focus', notify);
    window.removeEventListener('pageshow', notify);
    document.removeEventListener('visibilitychange', notify);
  };
}

export function CookieBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const isVisible = useSyncExternalStore(subscribeToCookieNotice, () => !readConsentCookie(), () => false);

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#d9def8] bg-white/94 p-4 shadow-[0_22px_60px_rgba(43,40,108,0.16)] backdrop-blur-md transition-colors dark:border-slate-700/70 dark:bg-slate-950/88 dark:shadow-[0_22px_60px_rgba(0,0,0,0.34)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#22347e] dark:text-slate-100">Aviso de cookies</p>
            <p className="mt-2 text-sm leading-7 text-[#61719b] dark:text-slate-300">
              Utilizamos cookies necessários para login, segurança, checkout e para lembrar sua preferência sobre este aviso.
              Consulte a{' '}
              <Link href="/politica-de-cookies" className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-[#9eb2ff] dark:decoration-slate-600">
                política de cookies
              </Link>{' '}
              e a{' '}
              <Link href="/privacidade" className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-[#9eb2ff] dark:decoration-slate-600">
                política de privacidade e LGPD
              </Link>
              .
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/politica-de-cookies"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#d7defe] px-5 text-sm font-semibold text-[#22347e] transition-colors hover:bg-[#f7f8ff] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800/84"
            >
              Ver política
            </Link>
            <button
              type="button"
              onClick={() => {
                persistConsentCookie();
                setIsDismissed(true);
              }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--cta-start)_0%,var(--cta-end)_100%)] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(255,106,74,0.24)] transition-all hover:-translate-y-0.5"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
