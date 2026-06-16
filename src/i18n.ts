import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import esES from './locales/es-ES.json';
import es419 from './locales/es-419.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      'es-ES': esES,
      'es-419': es419,
      fr: fr,
      ja: ja
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;