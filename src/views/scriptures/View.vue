<template>
    <div v-if="scripture">
        <h1 class="text-xl">{{scripture.title.default}}</h1>
        <div>
            <div class="mb-2" v-for="translation in translations" :key="translation.id">
                <base-button @click="translation.view()">{{translation.title}} | {{translation.language}}</base-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Scripture from "@/classes/scriptures/scripture";
import Translation from "@/classes/scriptures/translation";
import scriptures from "@/services/modules/scriptures";
import { Vue } from "vue-class-component";

export default class ScriptureView extends Vue {
    private service = scriptures;
    public scripture: Scripture | null = null;
    public translations: Translation[] | null = null;

    async mounted() {
        await this.load();
    }

    private async load() {
        const id = this.$route.params.id;
        if (id && typeof(id) === "string") {
            this.scripture = await this.service.get(id);
            this.translations = await this.service.getTranslations(this.scripture.id);
        }
    }
}
</script>
