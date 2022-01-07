<template>
    <div>
        <BaseCard
            v-for="collection in collections"
            :key="collection.id"
            class="cursor-pointer"
            @click="collection.view()"
        >
            <template #header>{{collection.name.default}}</template>
            <img v-if="collection.image" :src="collection.image" />
        </BaseCard>
    </div>
</template>
<script lang="ts">
import { Collection } from "@/classes";
import { appSession } from "@/services/session";
import { defineComponent } from "@vue/runtime-core";

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
