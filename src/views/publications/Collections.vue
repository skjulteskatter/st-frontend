<template>
    <div class="flex grid grid-cols-2 gap-4">
        <BaseCard
            v-for="collection in collections"
            :key="collection.id"
            class="cursor-pointer"
            @click="collection.view()"
        >
            <template v-if="!collection.image" #header>{{collection.name.default}}</template>
            <img v-if="collection.image" :src="collection.image" />
        </BaseCard>
    </div>
</template>
<script lang="ts">
import { Collection } from "@/classes";
import { appSession } from "@/services/session";
import { defineComponent } from "vue";

export default defineComponent({
    name: "publication-collections",
    data() {
        return {
            collections: [] as Collection[],
        };
    },
    mounted() {
        this.collections = appSession.collections.filter(i => i.type === "publication");
    },
});
</script>
