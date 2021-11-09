<template>
    <div v-if="scripture">
        <h1 class="text-xl">{{scripture.title.default}}</h1>
        <div class="scripture-content">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import Scripture from "@/classes/scriptures/scripture";
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "scripture-view",
})
export default class ScriptureView extends Vue {
    private service = scriptures;
    public scripture: Scripture | null = null;

    async mounted() {
        await this.load();
    }

    private async load() {
        const id = this.$route.params.scriptureId as string | undefined;
        if (id) {
            this.scripture = await this.service.get(id);
        }
    }
}
</script>
