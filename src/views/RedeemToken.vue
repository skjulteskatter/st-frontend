<template>
    <div>
        <div v-if="result">
            <div v-if="result.type == 'playlist'">
                <h1>{{result.name}}</h1>
            </div>
            <div v-if="result.type == 'tag'">
                <h1>{{result.name}}</h1>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { sharing } from "@/services/api";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { ApiPlaylist, ApiTag } from "dmb-api";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "redeem-token",
})
export default class RedeemToken extends Vue {
    private searchParams = new URLSearchParams(window.location.search);
    private store = useStore();

    public result: ApiPlaylist | ApiTag | null = null;

    public async mounted() {
        if (this.token) {
            const r = await sharing.activateKey(this.token);
            this.result = r;
            if (r.type == "playlist") {
                this.store.commit(SessionMutationTypes.SET_PLAYLIST, r);
                this.$router.push({name: "playlist-overview"});
            }
        }
    }

    public get token() {
        return this.searchParams.get("token") as string | null;
    }
}
</script>
