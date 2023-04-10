<template>
    <div v-if="loaded">
        <!-- <BackButton class="mb-4" to="/collections" />
        <div class="mb-4 flex flex-wrap gap-4 items-start md:items-center">
            <h1 class="font-bold text-2xl md:text-3xl">
                {{ collection?.name.default }}
            </h1>
        </div> -->
        <router-view />
    </div>
</template>
<script lang="ts">
import { Collection } from "@/classes";
// import { BackButton } from "@/components";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
    name: "collection-lists",
    components: {
        // BackButton,
    },
    mounted() {
        this.loadCollection();
    },
    data() {
        return {
            store: useStore(),
            loaded: false,
        };
    },
    computed: {
        collection(): Collection {
            return this.store.getters.collection;
        },
    },
    methods: {
        async loadCollection() {
            const cId = this.$route.params.collection as string;

            this.loaded = false;
            if (!this.collection?.getKeys().includes(cId)) {
                await this.store.dispatch(
                    SongsActionTypes.SELECT_COLLECTION,
                    this.$route.params.collection as string,
                );
            }
            this.loaded = true;
        },
    },
});
</script>
