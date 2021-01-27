import sanity from "@/services/sanity";
import { sessionStore } from "@/store";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
    locale: 'current'
})

const validLanguages = ['en', 'no']

let translations: {
    [key: string]: string;
};

const lanKey = localStorage.getItem('languageKey') ?? 'en'

let currentTranslation = validLanguages.includes(lanKey) ? lanKey : 'en';

export async function setLocale(locale: string) {
    translations = (await sanity.getAllTranslations(locale)).reduce((a, b) => ({...a, [b.key]: b.value}), {});
    i18n.global.setLocaleMessage('current', translations);
    currentTranslation = locale;
}

export async function ensureLanguageIsFetched() {
    const key = sessionStore.getters.languageKey;
    const lan = validLanguages.includes(key) ? key : 'en';
    if (!translations || currentTranslation !== lan) {
        await setLocale(lan);
    }
}

export default i18n;