<template>
    <div>
        <h2 class="font-bold">
            {{ $t('common_language') }}
        </h2>
        <loader :loading="!languages" />
        <ul class="flex flex-col gap-2 mb-2" v-if="languages">
            <li v-for="l in languages" :key="l">
                <label class="flex items-center gap-2">
                    <input
                        v-model="FilterOnLanguages[l.key]"
                        type="checkbox"
                        :name="l.name"
                        class="border-gray-300 rounded text-primary focus:ring-primary"
                    />
                    {{ l.name }}
                </label>
            </li>
        </ul>
        <template v-for="translation in Translations" :key="translation.id">
            <base-button class="mb-2" @click="translation.view()">{{translation.title}} &middot; <span class="opacity-50">{{translation.language}}</span></base-button>
        </template>
    </div>
</template>
<script lang="ts">
import Translation from "@/classes/scriptures/translation";
import scriptures from "@/services/modules/scriptures";
import { appSession } from "@/services/session";
import { Vue } from "vue-class-component";

export default class SelectTranslation extends Vue {
    private service = scriptures;
    
    private translations: Translation[] | null = null;

    public languages: Language[] | null = null;

    public filterOnLanguages: ILocale<boolean> | null = null;

    public get FilterOnLanguages() {
        return this.filterOnLanguages ?? {};
    }
    public set FilterOnLanguages(v) {
        this.filterOnLanguages = v;
    }

    public get Translations() {
        return this.translations?.filter(i => this.FilterOnLanguages[i.language] === true) ?? [];
    }

    async mounted() {
        await this.load();
    }

    private async load() {
        const scriptureId = this.$route.params.scriptureId as string | undefined;
        if (scriptureId) {
            this.translations = await this.service.getTranslations(scriptureId);

            this.languages = appSession.languages.filter(l => this.translations?.some(t => t.language === l.key));
            this.filterOnLanguages = this.languages.reduce((a, b) => {
                a[b.key] = appSession.user.settings.languageKey === b.key;
                return a;
            }, {} as ILocale<boolean>);
        }
    }
}
</script>
