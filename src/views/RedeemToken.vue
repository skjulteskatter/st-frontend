<template>
    <div v-if="result?.type === 'playlist'">
        <h1>{{result.name}}</h1>
    </div>
    <div v-if="result?.type === 'tag'">
        <h1>{{result.name}}</h1>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { sharing } from "@/services/api";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { ICustomCollection, ITag } from "songtreasures-api";

export default defineComponent({
    name: "redeem-token",
    data: () => ({
        store: useStore(),
        searchParams: new URLSearchParams(window.location.search),
        result: null as ICustomCollection | ITag | null,
    }),
    async mounted() {
        if (this.token) {
            const r = await sharing.activateKey(this.token);
            this.result = r;
            if (r.type == "playlist") {
                this.store.commit(SessionMutationTypes.SET_PLAYLIST, r);
                this.$router.push({name: "playlist-view", params: {id: r.id}});
            }
        }
    },
    computed: {
        token() {
            return this.searchParams.get("token") as string | null;
        },
    },
});
</script>
