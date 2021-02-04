import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: 'was9nyja',
    dataset: 'production',
    useCdn: true,
});

type Translation = {
    key: string;
    value: string;
}

class Sanity {
    async getAllTranslations(languageKey: string) {
        return await client.fetch(`*[_type == 'localization']{'key': code.current, 'value': ${languageKey}}`) as Translation[];
    }
}

const sanity = new Sanity();

export default sanity;