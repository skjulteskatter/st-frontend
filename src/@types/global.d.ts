
interface Step {
    name: string;
    id: string;
    type: string;
}

interface LocaleString {
    [code: string]: string;
}

interface Language {
    key: string;
    name: string;
}

interface Origin {
    id: string;
    name: LocaleString;
}

interface Country {
    name: string;
    countryCode: string;
}
