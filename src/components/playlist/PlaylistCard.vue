<template>
    <transition
        appear
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
    >
        <button class="text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 group">
            <BaseCard class="h-full cursor-pointer">
                <div class="flex gap-4">
                    <FolderIcon class="w-6 h-6 opacity-50" />
                    <span>
                        <strong class="font-bold md:max-w-md md:overflow-x-hidden md:overflow-ellipsis md:whitespace-nowrap">{{ collection.item?.name }}</strong>
                        <small class="opacity-50 block" v-if="collection.loaded">
                            {{ collection.entries.length || $t('common_noAmount') }}
                            {{ $t("common_songs").toLowerCase() }}
                        </small>
                        <Loader v-else position="local"></Loader>
                    </span>
                </div>
                <template #footer>
                    <div class="flex justify-between items-center gap-4">
                        <small v-if="collection?.item.sharedWithIds.length" class="w-max inline-flex gap-2 items-center" :class="[userId != collection?.item.userId ? 'text-primary' : 'opacity-50']">
                            <UsersIcon class="w-3 h-3" />
                            <span v-if="userId != collection?.item.userId">{{ $t('playlist_sharedWithYou') }}</span>
                            <span v-else>{{ `${$t('playlist_sharedWith')} ${collection?.item.sharedWithIds.length}` }}</span>
                        </small>
                        <button
                            :title="`${$t('common_delete')} ${$t('common_collection').toLocaleLowerCase()}`"
                            :aria-label="`${$t('common_delete')} ${$t('common_collection').toLocaleLowerCase()}`"
                            class="ml-auto rounded p-1 hover:bg-black/5 dark:hover:bg-white/5 invisible group-hover:visible"
                            @mouseover="hover = true"
                            @mouseleave="hover = false"
                            @click="$emit('delete', { id: collection?.item.id, name: collection?.item.name })"
                        >
                            <TrashIcon class="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                </template>
            </BaseCard>
        </button>
    </transition>
</template>
<script lang="ts" setup>
import CustomCollectionView from "@/classes/views/customCollectionView";
import { appSession } from "@/services/session";
import { FolderIcon } from "@heroicons/vue/outline";
import { TrashIcon, UsersIcon } from "@heroicons/vue/solid";
import { computed } from "vue";

let hover = false;
const userId = appSession.user.id;

const props = defineProps<{
    view: CustomCollectionView,
}>();

const collection = computed(() => {
    return props.view;
});

props.view.load();
</script>
