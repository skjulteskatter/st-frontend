<template>
    <base-card v-if="scripture">
        <template #header>
            {{scripture.title.default}}
        </template>
    </base-card>
</template>
<script lang="ts">
import { Scripture } from "@/classes/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "scripture-card",
    props: {
        scripture: {
            type: Object,
        },
    },
})
export default class ScriptureCard extends Vue {
    public scripture?: Scripture;
}
</script>
