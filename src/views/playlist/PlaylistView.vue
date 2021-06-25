<template>
    <div v-if="playlist">
        <back-button class="md:hidden mb-4" />
        <header class="flex justify-between items-start mb-4">
            <span>
                <h1 class="font-bold text-xl">
                    <span v-if="!editName">{{ playlist.name }}</span>
                    <input type="text" v-else v-model="newPlaylistName" :placeholder="playlist.name" @keydown.enter="saveName" />
                    <icon @click="saveName" class="ml-2 cursor-pointer opacity-50" :name="editName ? 'check' : 'pencil'" v-if="playlist.userId == userId" />
                </h1>
                <span class="text-gray-500">
                    {{ playlist.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </span>
            </span>
            <div class="flex gap-2 md:gap-4">
                <base-button
                    icon="share"
                    v-if="playlist.userId == userId"
                    @click="toggleSharePlaylist()"
                    :loading="loading['share']"
                >
                    {{ $t('common.share') + " " + $t('common.collection').toLowerCase() }}
                </base-button>
                <base-button icon="trash" theme="error" @click="deletePlaylist">
                    {{ $t("common.delete") }}
                </base-button>
            </div>
        </header>
        <h2 v-if="!playlist.entries.length" class="opacity-50">
            {{ $t("playlist.nosongs") }}
        </h2>
        <draggable
            class="flex flex-col gap-4"
            v-else
            v-model="playlist.entries"
            group="entries"
            @start="drag=true"
            @end="drag=false"
            item-key="id"
            ghost-class="opacity-50"
        >
            <template #item="{element}">
                <playlist-song-card
                    :entry="element"
                    :playlist="playlist"
                />
            </template>
        </draggable>
        <base-button class="mt-2 bg-green-100" @click="saveOrder" :loading="loading['entryOrder']" icon="save" v-if="entryOrderEdited">{{$t('common.save')}}</base-button>
        <base-modal
            :show="showModal['share'] == true"
            @close="showModal['share'] = false"
        >
            <div class="relative w-72">
                <button class="absolute top-0 right-0 text-gray-400 flex justify-center items-center" @click="showModal['share'] = false">
                    <icon name="error" size="20" />
                </button>
                <h3 class="font-bold mb-4">{{ $t('playlist.sharePlaylist') }}</h3>
                <div class="flex flex-col gap-2">
                    <div
                        v-for="key in Keys" :key="key.key"
                        class="flex flex-col gap-2"
                    >
                        <span class="w-full flex gap-2 justify-between">
                            <input type="text" ref="shareLink" :value="getLink(key.key)" class="p-2 border-gray-300 text-sm flex-grow bg-transparent">
                            <!-- <base-button @click="copyLink" theme="tertiary" class="flex-grow">{{ $t('playlist.copyLink') }}</base-button> -->
                            <base-button
                                theme="error"
                                icon="trash"
                                :disabled="deleted[key.key]"
                                :loading="loading[key.key]"
                                @click="deleteKey(key)"
                                :content="false"
                                class="px-3"
                            />
                        </span>
                        <small class="block text-gray-400">{{ $t('playlist.validTo') }} {{new Date(key.validTo).toLocaleDateString()}}</small>
                    </div>
                    <base-button @click="sharePlaylist" :loading="sharingPlaylist" v-if="!Keys.length">{{ $t('playlist.createShareLink') }}</base-button>
                </div>
                <div class="flex flex-col gap-2 mt-4 max-h-64 overflow-y-auto" v-if="Users.length">
                    <h3 class="text-xs font-bold">{{ $t('playlist.sharedWith') }}</h3>
                    <div v-for="u in Users" :key="u.id" class="flex justify-between rounded p-2 bg-black bg-opacity-10 dark:bg-opacity-20">
                        <span class="flex gap-2 items-center">
                            <img
                                :src="
                                    u.image ?? '/img/portrait-placeholder.png'
                                "
                                class="w-6 h-6 object-cover rounded-full"
                            />
                            <small>{{ u.displayName }}</small>
                        </span>
                        <icon class="text-red-700 cursor-pointer" name="error" :disabled="deleted[u.id]" :loading="loading[u.id]" @click="deleteUser(u)" />
                    </div>
                </div>
            </div>
        </base-modal>
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
import Draggable from "vuedraggable";

const keys = reactive<{value?: ShareKey[]}>({value: undefined});

@Options({
    name: "playlist-view",
    components: {
        BackButton,
        PlaylistSongCard,
        BaseModal,
        Icon,
        Draggable,
    },
})
export default class PlaylistView extends Vue {
    private store = useStore();
    public drag = false;
    public editName = false;
    public orders: {
        [key: string]: string[];
    } = {};
    public newPlaylistName = "";
    public showModal: {
        [key: string]: boolean;
    } = {
        sharedWith: false,
        share: false,
    };

    public get originalEntryOrder(): string[] {
        if (!this.playlist) return [];
        let order = this.orders[this.playlist.id];

        if (!order) {
            order = this.playlist.entries.map(e => e.id);
            this.orders[this.playlist.id] = order;
        }

        return order;
    }

    public get currentEntryOrder() {
        return this.playlist?.entries.map(e => e.id) ?? [];
    }

    public get entryOrderEdited() {
        for (let i = 0; i < this.currentEntryOrder.length; i++) {
            if (this.currentEntryOrder[i] != this.originalEntryOrder[i]) return true;
        }
        return false;
    }

    public loading: {
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

    public getLink(key: string) {
        return `${window.location.host}/sharing?token=${key}`;
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
        this.loading["share"] = true;
        if (!this.showModal["share"]) {
            if (keys.value == undefined && this.playlist) {
                await this.loadKeys();
                this.users = this.users ?? await playlists.getUsers(this.playlist.id);
            }
            this.showModal["share"] = true;
        } else {
            this.showModal["share"] = false;
        }
        this.loading["share"] = false;
    }

    public async toggleSharedWith() {
        if (!this.showModal["sharedWith"]) {
            if (this.playlist)
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
        this.loading[key.key] = true;
        await sharing.deleteKey(key.key);
        this.loading[key.key] = false;
        this.deleted[key.key] = true;
    }

    public async deleteUser(user: PublicUser) {
        this.loading[user.id] = true;
        if (this.playlist)
            await playlists.deleteUser(this.playlist.id, user.id);
        this.loading[user.id] = false;
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

    public async saveName() {
        // console.log("savingName");

        if (this.editName) {
            this.editName = false;
            if (this.playlist && this.newPlaylistName) {
                this.playlist.name = this.newPlaylistName;

                await playlists.updatePlaylist(this.playlist.id, {
                    name: this.newPlaylistName,
                });

                this.newPlaylistName = "";
            }
        } else {
            this.editName = true;
        }
    }

    public async saveOrder() {
        if (this.entryOrderEdited) {
            this.loading["entryOrder"] = true;
            if (this.playlist) {
                await playlists.updatePlaylist(this.playlist.id, {
                    entryOrder: this.currentEntryOrder,
                });

                this.orders[this.playlist.id] = this.currentEntryOrder;
            }
            this.loading["entryOrder"] = false;
        }
    }
}
</script>
