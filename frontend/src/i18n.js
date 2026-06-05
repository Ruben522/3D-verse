import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";
import it from "./locales/it.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import pt from "./locales/pt.json";

const resources = {
    en: { translation: en },
    es: { translation: es },
    zh: { translation: zh },
    it: { translation: it },
    fr: { translation: fr },
    de: { translation: de },
    ja: { translation: ja },
    ko: { translation: ko },
    pt: { translation: pt }
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "es",
        supportedLngs: ["es", "en", "zh", "it", "fr", "de", "ja", "ko", "pt"],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;
