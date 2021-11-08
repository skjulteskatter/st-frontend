<template>
    <div>
        <base-button @click="scripture.view()" v-for="scripture in Scriptures" :key="scripture.id">
            {{scripture.title.default}}
        </base-button>
    </div>
</template>

<script lang="ts">
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "scripture-list",
})
export default class ScriptureList extends Vue {
    private service = scriptures;

    public get Scriptures() {
        return this.service.Scriptures;
    }
}
</script>

<style>

</style>
