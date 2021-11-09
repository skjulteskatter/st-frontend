<template>
    <div v-if="scripture">
        <div>
            <h1 class="text-xl">{{scripture.title.default}}</h1>
            <select-translation 
                :filterOnLanguages="filterOnLanguages" 
                :languages="languages" 
                :translations="translations"
                @setTranslation="setTranslation"
            ></select-translation>
        </div>
        <div class="scripture-content" v-if="translation">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { Translation } from "@/classes/scriptures";
import Scripture from "@/classes/scriptures/scripture";
import scriptures from "@/services/modules/scriptures";
import { appSession } from "@/services/session";
import { Options, Vue } from "vue-class-component";
import { SelectTranslation } from "@/components/scriptures";

@Options({
    name: "scripture-view",
    components: {
        SelectTranslation,
    },
})
export default class ScriptureView extends Vue {
    private service = scriptures;
    public scripture: Scripture | null = null;
    public translation: Translation | null = null;
    public translations: Translation[] | null = null;
    public languages: Language[] | null = null;
    public filterOnLanguages: ILocale<boolean> | null = null;

    async mounted() {
        await this.load();
    }

    private async load() {
        const id = this.$route.params.scriptureId as string | undefined;
        if (id) {
            this.scripture = await this.service.get(id);
            await this.service.setScripture(this.scripture.id);
            this.translation = await this.service.getCurrentTranslation();

            if (!this.translation) {
                this.translations = await this.service.getTranslations(this.scripture.id);

                this.languages = appSession.languages.filter(l => this.translations?.some(t => t.language === l.key));
                this.filterOnLanguages = this.languages.reduce((a, b) => {
                    a[b.key] = appSession.user.settings.languageKey === b.key;
                    return a;
                }, {} as ILocale<boolean>);
            }
        }
    }

    public async setTranslation(translation: Translation) {
        await this.service.setTranslation(translation.id);
        translation.view();
    }
}
</script>
