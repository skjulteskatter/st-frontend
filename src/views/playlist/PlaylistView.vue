<template>
    <div v-if="playlist">
        <back-button class="mb-4" />
        <header class="flex justify-between items-start mb-4">
            <span>
                <h1 class="font-bold text-xl flex gap-2 items-center">
                    <span v-if="!editName">{{ playlist.name }}</span>
                    <input type="text" v-else v-model="newPlaylistName" :placeholder="playlist.name" @keydown.enter="saveName" />
                    <button @click="saveName" v-if="playlist.userId == userId" class="cursor-pointer opacity-50">
                        <CheckIcon v-if="editName" class="w-5 h-5" />
                        <PencilIcon v-else class="w-5 h-5" />
                    </button>
                </h1>
                <span class="text-gray-500">
                    {{ playlist.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </span>
            </span>
            <div class="flex gap-2 md:gap-4">
                <base-button
                    v-if="playlist.userId == userId"
                    @click="toggleSharePlaylist()"
                    :loading="loading['share']"
                >
                    <template #icon>
                        <ShareIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common.share') }} {{ $t('common.collection').toLocaleLowerCase() }}
                </base-button>
                <base-button theme="error" @click="deletePlaylist">
                    <template #icon>
                        <TrashIcon class="w-4 h-4" />
                    </template>
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
        <base-button class="mt-2 bg-green-100" @click="saveOrder" :loading="loading['entryOrder']" v-if="entryOrderEdited">
            <template #icon>
                <SaveIcon class="w-4 h-4" />
            </template>
            {{$t('common.save')}}
        </base-button>
        <base-modal
            :show="Show"
            @close="hideModal()"
        >
            <div class="relative w-72">
                <button class="absolute top-0 right-0 text-gray-400 flex justify-center items-center" @click="hideModal()">
                    <XIcon class="w-4 h-4" />
                </button>
                <h3 class="font-bold mb-4">{{ $t('common.share') }} {{ $t('common.collection').toLocaleLowerCase() }}</h3>
                <div class="flex flex-col gap-2">
                    <div
                        v-for="key in Keys" :key="key.key"
                        class="flex flex-col gap-2"
                    >
                        <span class="w-full flex gap-2 justify-between">
                            <input 
                                type="text"
                                ref="shareLink"
                                :value="getLink(key.key)"
                                class="p-2 border-gray-300 rounded-md text-sm flex-grow bg-transparent"
                                :disabled="new Date() > new Date(key.validTo)"
                                :class="{'text-gray-400 cursor-not-allowed border-red-700': new Date() > new Date(key.validTo) }"
                            >
                            <!-- <base-button @click="copyLink" theme="tertiary" class="flex-grow">{{ $t('playlist.copyLink') }}</base-button> -->
                            <base-button
                                theme="error"
                                :disabled="deleted[key.key]"
                                :loading="loading[key.key]"
                                @click="deleteKey(key)"
                                :content="false"
                                class="px-3"
                            >
                                <template #icon>
                                    <TrashIcon class="w-4 h-4" />
                                </template>
                            </base-button>
                        </span>
                        <small v-if="new Date() > new Date(key.validTo)" class="text-red-700">
                            <ExclamationIcon class="w-4 h-4" />
                            {{ $t('playlist.notValid') }}
                        </small>
                        <small class="block text-gray-400" v-else>{{ $t('playlist.validTo') }} {{new Date(key.validTo).toLocaleDateString()}}</small>
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
                        <button class="text-red-700 cursor-pointer" :disabled="deleted[u.id]" @click="deleteUser(u)">
                            <XIcon class="w-4 h-4" />
                        </button>
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
import { ShareIcon, TrashIcon, SaveIcon, ExclamationIcon, XIcon } from "@heroicons/vue/solid";
import { PencilIcon, CheckIcon } from "@heroicons/vue/outline";
import Draggable from "vuedraggable";

const keys = reactive<{value?: ShareKey[]}>({value: undefined});

@Options({
    name: "playlist-view",
    components: {
        BackButton,
        PlaylistSongCard,
        BaseModal,
        ShareIcon,
        TrashIcon,
        SaveIcon,
        ExclamationIcon,
        XIcon,
        PencilIcon,
        CheckIcon,
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
    public show = false;

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

    public get Show() {
        return this.show;
    }

    public showModal() {
        this.show = true;
    }

    public hideModal() {
        this.show = false;
    }

    public getLink(key: string) {
        return `https://${window.location.host}/sharing?token=${key}`;
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
        if (!this.show) {
            if (keys.value == undefined && this.playlist) {
                await this.loadKeys();
                this.users = this.users ?? await playlists.getUsers(this.playlist.id);
            }
            this.showModal();
        } else {
            this.hideModal();
        }
        this.loading["share"] = false;
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
