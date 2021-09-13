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
        const cs = countries.getNames(locale);
        for (const e of Object.entries(cs)) {
            translations[e[0]] = e[1];
        }
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
        englishIsFetched = true;
        const english = await fetchTranslations("en");

        const cs = countries.getNames("en");
        for (const e of Object.entries(cs)) {
            english[e[0]] = e[1];
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
