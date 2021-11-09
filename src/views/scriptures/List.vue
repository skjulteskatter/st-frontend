<template>
    <!-- TODO: Define correct classes. -->
    <div>
        <scripture-card
            class="max-w-md cursor-pointer"
            @click="scripture.view()" 
            v-for="scripture in Scriptures" 
            :key="scripture.id"
            :scripture="scripture"
        />
    </div>
</template>

<script lang="ts">
import { ScriptureCard } from "@/components/scriptures";
import scriptures from "@/services/modules/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "scripture-list",
    components: {
        ScriptureCard,
    },
})
export default class ScriptureList extends Vue {
    private service = scriptures;

    public get Scriptures() {
        return this.service.Scriptures;
    }
}
</script>
