<template>
    <div v-if="playlist" class="flex flex-col h-full">
        <BackButton class="mb-4" to="/playlists" />
        <header class="flex flex-col sm:flex-row gap-4 justify-between items-start mb-6">
            <span>
                <h1 class="font-bold text-xl flex gap-2 items-center">
                    <span v-if="!editName">{{ playlist.name }}</span>
                    <input type="text" v-else v-model="newPlaylistName" :placeholder="playlist.name" @keydown.enter="saveName" class="rounded-md border-none px-2 py-0 bg-black/10 dark:bg-white/10 text-lg" />
                    <button @click="saveName" v-if="playlist.userId == userId" class="cursor-pointer opacity-50 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10">
                        <CheckIcon v-if="editName" class="w-5 h-5" />
                        <PencilIcon v-else class="w-5 h-5" />
                    </button>
                </h1>
                <span class="text-gray-500">
                    {{ playlist.entries.length }}
                    {{ $t("common_songs").toLowerCase() }}
                </span>
            </span>
            <div class="flex gap-2 md:gap-4">
                <BaseButton
                    v-if="playlist.userId == userId"
                    @click="toggleSharePlaylist()"
                    :loading="loading['share']"
                >
                    <template #icon>
                        <ShareIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_share') }} {{ $t('common_collection').toLocaleLowerCase() }}
                </BaseButton>
                <BaseButton theme="error" @click="showDelete = true">
                    <template #icon>
                        <TrashIcon class="w-4 h-4" />
                    </template>
                    {{ $t("common_delete") }}
                </BaseButton>
            </div>
        </header>
        <div v-if="!playlist.entries.length" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-4 opacity-50">
            <span class="rounded-full p-4 bg-black/10 dark:bg-white/10">
                <BookOpenIcon class="w-8 h-8" />
            </span>
            <h2>{{ $t("playlist_nosongs") }}</h2>
        </div>
        <Draggable
            class="flex flex-col gap-4"
            v-else
            :list="entries"
            group="entries"
            delay="200"
            delay-on-touch-only="true"
            item-key="id"
            ghost-class="opacity-50"
        >
            <template #item="{element}">
                <PlaylistSongCard
                    :entry="element"
                    :canEdit="canEdit"
                    @remove="removeEntry"
                />
            </template>
        </Draggable>
        <BaseButton class="mt-2 bg-green-100" @click="saveOrder" :loading="loading['entryOrder']" v-if="entryOrderEdited">
            <template #icon>
                <SaveIcon class="w-4 h-4" />
            </template>
            {{$t('common_save')}}
        </BaseButton>
        <BaseModal
            :show="Show"
            @close="hideModal()"
        >
            <template #title>
                <h3 class="font-bold">{{ $t('common_share') }} {{ $t('common_collection').toLocaleLowerCase() }}</h3>
            </template>
            <div class="flex flex-col gap-2">
                <div
                    v-for="key in Keys" :key="key.key"
                    class="flex flex-col gap-2"
                >
                    <span class="w-full flex gap-2 justify-between">
                        <CopyToClipboard :label="$t('playlist_copyLink')" :content="getLink(key.key)" />
                        <BaseButton
                            theme="error"
                            size="small"
                            title="Delete link"
                            :disabled="deleted[key.key]"
                            :loading="loading[key.key]"
                            @click="deleteKey(key)"
                        >
                            <template #icon>
                                <TrashIcon class="w-4 h-4" />
                            </template>
                        </BaseButton>
                    </span>
                    <small v-if="new Date() > new Date(key.validTo)" class="text-red-700 gap-2 flex items-center">
                        <ExclamationIcon class="w-4 h-4" />
                        {{ $t('playlist_notValid') }}
                    </small>
                    <small class="block text-gray-400" v-else>{{ $t('playlist_validTo') }} {{new Date(key.validTo).toLocaleDateString()}}</small>
                </div>
                <BaseButton @click="sharePlaylist" :loading="sharingPlaylist" v-if="!Keys.length">{{ $t('playlist_createShareLink') }}</BaseButton>
            </div>
            <div class="flex flex-col gap-2 mt-4 max-h-64 overflow-y-auto" v-if="Users.length">
                <h3 class="text-xs font-bold">{{ $t('playlist_sharedWith') }}</h3>
                <div v-for="u in Users" :key="u.id" class="flex justify-between rounded-md p-2 border border-black/10 dark:border-white/10">
                    <span class="flex gap-2 items-center">
                        <img
                            :src="
                                u.image ?? '/img/portrait-placeholder.png'
                            "
                            class="w-6 h-6 object-cover rounded-full"
                            width="24"
                            height="24"
                        />
                        <small>{{ u.displayName }}</small>
                    </span>
                    <button class="rounded p-1 text-red-500 cursor-pointer hover:bg-red-500/10" :disabled="deleted[u.id]" @click="deleteUser(u)">
                        <XIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </BaseModal>
        <BaseModal :show="showDelete" @close="showDelete = false">
            <template #icon>
                <ExclamationIcon class="w-6 h-6 text-red-500" />
            </template>
            <template #title>
                <h3 class="font-bold">{{ $t('playlist_deleteConfirmation') }}</h3>
            </template>
            <template #description>
                <small class="opacity-50 tracking-wide">{{ $t('playlist_deleteDescription') }}</small>
            </template>
            <div class="flex flex-col gap-4 sm:flex-row sm:justify-end">
                <BaseButton theme="tertiary" @click="showDelete = false">
                    {{ $t('common_cancel') }}
                </BaseButton>
                <BaseButton theme="error" @click="deletePlaylist">
                    <template #icon>
                        <TrashIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_delete') }}
                </BaseButton>
            </div>
        </BaseModal>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BackButton, BaseModal } from "@/components";
import { PlaylistSongCard } from "@/components/playlist";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { notify } from "@/services/notify";
import { playlists, sharing } from "@/services/api";
import { appSession } from "@/services/session";
import { ICustomCollectionEntry, PublicUser, ShareKey } from "songtreasures";
import { reactive } from "@vue/reactivity";
import { ShareIcon, TrashIcon, SaveIcon, XIcon } from "@heroicons/vue/solid";
import { PencilIcon, CheckIcon, ExclamationIcon, BookOpenIcon } from "@heroicons/vue/outline";
import Draggable from "vuedraggable";
import { CopyToClipboard } from "@/components/inputs";

const keys = reactive<{value?: ShareKey[]}>({value: undefined});

export default defineComponent({
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
        BookOpenIcon,
        Draggable,
        CopyToClipboard,
    },
    data: () => ({
        store: useStore(),
        drag: false,
        editName: false,
        orders: {} as {
            [key: string]: string[];
        },
        newPlaylistName: "",
        show: false,
        showDelete: false,
        loading: {} as {
            [key: string]: boolean;
        },
        deleted: {} as {
            [key: string]: boolean;
        },
        loadingKeys: false,
        sharingPlaylist: false,
        users: [] as PublicUser[],
    }),
    computed: {
        entries: {
            get() {
                return this.playlist?.entries ?? [];
            },
            set(v: ICustomCollectionEntry[]) {
                if (this.playlist)
                    this.playlist.entries = v;
            },
        },
        canEdit() {
            return this.playlist?.userId === this.store.getters.user?.id;
        },
        currentEntryOrder() {
            return this.playlist?.entries.map(e => e.id) ?? [];
        },
        entryOrderEdited() {
            for (let i = 0; i < this.currentEntryOrder.length; i++) {
                if (this.currentEntryOrder[i] != this.getOriginalEntryOrder()[i]) return true;
            }
            return false;
        },
        Keys() {
            return keys.value?.filter(k => k.itemId == this.playlist?.id) ?? [];
        },
        Users() {
            return this.users ?? [];
        },
        Show() {
            return this.show;
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
        playlist() {
            return this.store.getters.playlists.find(
                (p) => p.id == this.$route.params.id,
            );
        },
        userId() {
            return this.store.getters.user?.id;
        },
    },
    methods: {
        showModal() {
            this.show = true;
        },
        hideModal() {
            this.show = false;
        },
        getLink(key: string) {
            return `https://${window.location.host}/sharing?token=${key}`;
        },
        getOriginalEntryOrder(): string[] {
            if (!this.playlist) return [];
            let order = this.orders[this.playlist.id];

            if (!order) {
                order = this.playlist.entries.map(e => e.id);
                this.orders[this.playlist.id] = order;
            }

            return order;
        },
        async deletePlaylist() {
            const name = this.playlist?.name;

            await this.store.dispatch(
                SessionActionTypes.PLAYLIST_DELETE,
                this.playlist?.id,
            );
            this.$router.push("/playlists");

            notify("success",  this.$t("playlist_deletedplaylist"), "trash", `${this.$t("playlist_deletedplaylist")} "${name}"`, undefined, undefined, false);
        },
        async toggleSharePlaylist() {
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
        },
        async loadKeys() {
            this.loadingKeys = true;
            keys.value = await appSession.getKeys();
            this.loadingKeys = false;
        },
        async sharePlaylist() {
            if (this.playlist) {
                this.sharingPlaylist = true;
                const key = await sharing.shareItem(this.playlist.id, "playlist");

                appSession.addKey(key);
                keys.value?.push(key);
                this.sharingPlaylist = false;
            }
        },
        async deleteKey(key: ShareKey) {
            this.loading[key.key] = true;
            await sharing.deleteKey(key.key);
            this.loading[key.key] = false;
            this.deleted[key.key] = true;
        },
        async deleteUser(user: PublicUser) {
            this.loading[user.id] = true;
            if (this.playlist)
                await playlists.deleteUser(this.playlist.id, user.id);
            this.loading[user.id] = false;
            this.deleted[user.id] = true;
        },
        async saveName() {
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
        },
        async saveOrder() {
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
        },
        async removeEntry(id: string) {
            const title = this.$t("playlist_removed");
            const content = this.$t("notification_removedsong");

            if (!this.playlist?.id || !id) return;
            await this.store.dispatch(SessionActionTypes.PLAYLIST_REMOVE_ENTRY, {
                playlistId: this.playlist.id,
                entryId: id,
            });

            notify("success", title, "trash", content, undefined, undefined, false);
        },
    },
});
</script>
