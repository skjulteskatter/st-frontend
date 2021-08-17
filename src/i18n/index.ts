import api from "@/services/api";
import { useStore } from "@/store";
import { createI18n } from "vue-i18n";
import countries from "i18n-iso-countries";

const countryInMyLanguage = (lan: string) => import(`i18n-iso-countries/langs/${lan}.json`);

const i18n = createI18n({
    locale: "current",
    fallbackLocale: "en",
    silentFallbackWarn: true,
    silentTranslationWarn: true,
});

const validLanguages = ["en", "no"];

let translations: {
    [key: string]: string;
};

const lanKey = localStorage.getItem("languageKey") ?? "en";

let currentTranslation = validLanguages.includes(lanKey) ? lanKey : "en";

export async function setLocale(locale: string) {
    try {
        translations = await (await fetch(`/translations/${locale}.json`)).json();
        i18n.global.setLocaleMessage("current", translations);
    }
    catch {
        //
    }
    currentTranslation = locale;
}

let englishIsFetched = false;

export async function ensureLanguageIsFetched() {
    const lan = useStore().getters.languageKey;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    if (!englishIsFetched) {
        try {
            countries.registerLocale(await countryInMyLanguage("en"));
        }
        catch {
            //
        }
        // countries.getNames(lan);
        englishIsFetched = true;
        const result = await api.items.getTranslations(["en"]);
        const english: {
            [key: string]: string;
        } = countries.getNames(lan);
        for (const l of Object.keys(result)) {
            english[l] = result[l]["en"];
        }
        i18n.global.setLocaleMessage("en", english);
    }
    if (!translations || currentTranslation !== lan) {
        try {
            countries.registerLocale(await countryInMyLanguage(lan));
        }
        catch {
            //
        }
        await setLocale(lan);
    }
}

export default i18n;
