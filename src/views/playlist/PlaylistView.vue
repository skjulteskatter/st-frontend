<template>
    <div v-if="playlist">
        <back-button class="md:hidden mb-4" />
        <header class="flex justify-between items-start mb-4">
            <span>
                <h1 class="font-bold text-xl">{{ playlist.name }}</h1>
                <span class="text-gray-500">
                    {{ playlist.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </span>
            </span>
            <div v-if="playlist.userId == userId">
                <base-button icon="user" @click="toggleSharePlaylist()">Share</base-button>
                <base-button icon="user" @click="toggleSharedWith()">Shared With</base-button>
            </div>
            <base-modal
                :show="showModal['sharedWith'] == true"
                @close="showModal['sharedWith'] = false"
            >
                <h1>Shared with</h1> 
                <table class="table-fixed">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="w-1/5 text-left p-2">{{ $t("common.name") }}</th>
                            <th class="w-1/5 text-left p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in Users" :key="u.id">
                            <td class="flex gap-4 items-center">
                                <img
                                    :src="
                                        u.image ?? '/img/portrait-placeholder.png'
                                    "
                                    class="w-8 h-8 object-cover rounded-full"
                                />
                                <span>{{ u.displayName }}</span>
                            </td>
                            <td class="items-center">
                                <Icon name="trash" :disabled="deleted[u.id]" :loading="loadingDelete[u.id]" @click="deleteUser(u)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <base-button @click="showModal['sharedWith'] = false">Close</base-button>
                <base-button @click="sharePlaylist" :loading="sharingPlaylist">Share</base-button>
            </base-modal>
            <base-button icon="trash" theme="error" @click="deletePlaylist">
                {{ $t("playlist.delete") }}
            </base-button>
            <base-modal
                :show="showModal['share'] == true"
                @close="showModal['share'] = false"
            >
                <h1>Share playlist</h1>
                <div v-for="key in Keys" :key="key.key">
                    <small><a :href="`/sharing?token=${key.key}`">{{key.key}}</a></small>
                    <br/>
                    <small>{{new Date(key.validTo).toLocaleDateString()}}</small>
                    <base-button :disabled="deleted[key.key]" :loading="loadingDelete[key.key]" @click="deleteKey(key)">X</base-button>
                </div>
                <base-button @click="showModal['share'] = false">Close</base-button>
                <base-button @click="sharePlaylist" :loading="sharingPlaylist">Share</base-button>
            </base-modal>
        </header>
        <h2 v-if="!playlist.entries.length" class="opacity-50">
            {{ $t("playlist.nosongs") }}
        </h2>
        <div class="flex flex-col gap-4" v-else>
            <playlist-song-card
                v-for="entry in playlist.entries"
                :key="entry.id"
                :entry="entry"
                :playlist="playlist"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton, BaseModal } from "@/components";
import { PlaylistSongCard } from "@/components/playlist";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { notify } from "@/services/notify";
import { playlists, sharing } from "@/services/api";
import { appSession } from "@/services/session";
import { PublicUser, ShareKey } from "dmb-api";
import { reactive } from "@vue/reactivity";
import { Icon } from "@/components/icon"; 

const keys = reactive<{value?: ShareKey[]}>({value: undefined});

@Options({
    name: "playlist-view",
    components: {
        BackButton,
        PlaylistSongCard,
        BaseModal,
        Icon,
    },
})
export default class PlaylistView extends Vue {
    private store = useStore();
    public showModal: {
        [key: string]: boolean;
    } = {
        sharedWith: false,
        share: false,
    };

    public loadingDelete: {
        [key: string]: boolean;
    } = {};
    public deleted: {
        [key: string]: boolean;
    } = {};
    public loadingKeys = false;
    public sharingPlaylist = false;

    public get Keys() {
        return keys.value?.filter(k => k.itemId == this.playlist?.id) ?? [];
    }

    public users?: PublicUser[];

    public get Users() {
        return this.users ?? [];
    }

    public async deletePlaylist() {
        const name = this.playlist?.name;

        await this.store.dispatch(
            SessionActionTypes.PLAYLIST_DELETE,
            this.playlist?.id,
        );
        this.$router.push("/playlists");

        notify("success",  this.$t("playlist.deletedplaylist"), "trash", `${this.$t("playlist.deletedplaylist")} "${name}"`);
    }

    public async toggleSharePlaylist() {
        if (!this.showModal["share"]) {
            if (keys.value == undefined) {
                await this.loadKeys();
            }
            this.showModal["share"] = true;
        } else {
            this.showModal["share"] = false;
        }
    }

    public async toggleSharedWith() {
        if (!this.showModal["sharedWith"]) {
            if (this.playlist)
                this.users = this.users ?? await playlists.getUsers(this.playlist.id);
            this.showModal["sharedWith"] = true;
        } else {
            this.showModal["sharedWith"] = false;
        }
    }

    public async loadKeys() {
        this.loadingKeys = true;
        keys.value = await appSession.getKeys();
        this.loadingKeys = false;
    }

    public async sharePlaylist() {
        if (this.playlist) {
            this.sharingPlaylist = true;
            const key = await sharing.shareItem(this.playlist.id, "playlist");

            appSession.addKey(key);
            keys.value?.push(key);
            this.sharingPlaylist = false;
        }
    }

    public async deleteKey(key: ShareKey) {
        this.loadingDelete[key.key] = true;
        await sharing.deleteKey(key.key);
        this.loadingDelete[key.key] = false;
        this.deleted[key.key] = true;
    }

    public async deleteUser(user: PublicUser) {
        this.loadingDelete[user.id] = true;
        if (this.playlist)
            await playlists.deleteUser(this.playlist.id, user.id);
        this.loadingDelete[user.id] = false;
        this.deleted[user.id] = true;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get playlist() {
        return this.store.getters.playlists.find(
            (p) => p.id == this.$route.params.id,
        );
    }

    public get userId() {
        return this.store.getters.user?.id;
    }
}
</script>
