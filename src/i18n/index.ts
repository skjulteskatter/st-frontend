import sanity from "@/services/sanity";
import { sessionStore } from "@/store";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
    locale: 'current'
})

let translations: {
    [key: string]: string;
};

let currentTranslation = localStorage.getItem('languageKey') ?? 'en';

export async function setLocale(locale: string) {
    translations = (await sanity.getAllTranslations(locale)).reduce((a, b) => ({...a, [b.key]: b.value}), {});
    i18n.global.setLocaleMessage('current', translations);
    currentTranslation = locale;
}

export async function ensureLanguageIsFetched() {
    const lan = sessionStore.getters.languageKey;
    if (!translations || currentTranslation !== lan) {
        await setLocale(sessionStore.getters.languageKey);
    }
    console.log(lan)
}

export default i18n;