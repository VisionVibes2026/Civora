/**
 * Civora Language Hook.
 *
 * Provides language switching, persistence, and translation string access.
 */

import { useState, useCallback } from 'react';
import type { Language } from '../types';
import type { TranslationSet } from '../constants/languages';
import { LANGUAGES } from '../constants/languages';

export function useLanguage(initialLang: Language = 'en') {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('civora_language');
    if (saved && ['en', 'ta', 'hi', 'te', 'kn'].includes(saved)) {
      return saved as Language;
    }
    return initialLang;
  });

  const changeLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('civora_language', lang);
  }, []);

  const t: TranslationSet = LANGUAGES[currentLanguage] || LANGUAGES.en;

  return {
    currentLanguage,
    changeLanguage,
    t,
  };
}
