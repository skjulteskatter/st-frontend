import { appSession } from "@/services/session";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
    locale: "current",
    fallbackLocale: "en",
    silentFallbackWarn: true,
    silentTranslationWarn: true,
});

const version = 1;
const fetchTranslations = async (language: string) => (await (await fetch(`/translations/v${version}/${language}.json`)).json()) as {
    [key: string]: string;
};

const validLanguages = ["en", "no"];

let translations: {
    [key: string]: string;
};

const lanKey = localStorage.getItem("languageKey") ?? "en";

let currentTranslation = validLanguages.includes(lanKey) ? lanKey : "en";

export async function setLocale(locale: string) {
    try {
        translations = await fetchTranslations(locale);
        i18n.global.setLocaleMessage("current", translations);
    }
    catch {
        //
    }
    currentTranslation = locale;
}

let englishIsFetched = false;

export async function ensureLanguageIsFetched() {
    const lan = appSession.Language;
    if (!englishIsFetched) {
        englishIsFetched = true;
        const english = await fetchTranslations("en");

        i18n.global.setLocaleMessage("en", english);
    }
    if (!translations || currentTranslation !== lan) {
        await setLocale(lan);
    }
}

export default i18n;
