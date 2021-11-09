<template>
    <base-card v-if="translation">
        {{translation.title}}
    </base-card>
</template>
<script lang="ts">
import { Translation } from "@/classes/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "translation-card",
    props: {
        translation: {
            type: Object,
        },
    },
})
export default class ScriptureCard extends Vue {
    public translation?: Translation;
}
</script>
