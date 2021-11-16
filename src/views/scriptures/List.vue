<template>
    <!-- TODO: Define correct classes. -->
    <div v-if="Scriptures.length">
        <ScriptureCard
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
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "scripture-list",
    components: {
        ScriptureCard,
    },
    computed: {
        Scriptures() {
            return scriptures.Scriptures;
        },
    },
});
</script>
