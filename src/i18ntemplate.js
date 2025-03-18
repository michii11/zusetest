import { createI18n } from 'vue-i18n';
import de from './locales/de.json';
import en from './locales/en.json';

// Sprache aus LocalStorage holen oder Standard auf Deutsch setzen
const savedLanguage = localStorage.getItem('language') || 'de';

const i18n = createI18n({
  legacy: false, // Falls du Vue 3 benutzt
  locale: savedLanguage,
  fallbackLocale: 'de',
  messages: { de, en },
});

export default i18n;
