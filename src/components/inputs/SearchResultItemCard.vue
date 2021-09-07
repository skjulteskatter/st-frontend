<template>
    <base-card class="hover:ring-2 hover:ring-gray-400 cursor-pointer">
        <div class="flex gap-2" v-if="item?.type === 'song'">
            <b class="text-gray-400">{{ item.Song.number }}</b>
            <div class="flex flex-col gap-2">
                <div>
                    <b>{{
                        item.Song.getName()
                    }}</b>
                    <small class="block text-xs text-primary" v-for="c in item.collections" :key="c.id">{{c.getName()}}</small>
                </div>
                <div class="text-sm leading-normal text-gray-400 flex flex-col">
                    <small v-if="item.Song.yearWritten">{{ item.Song.yearWritten }}</small>
                    <small 
                        v-for="con in item.Song.Participants"
                        :key="con.id"
                    >{{ con.name }}</small>
                </div>
            </div>
        </div>
        <div class="flex gap-2 flex-col" v-if="item?.type === 'contributor'">
            <UserCircleIcon class="w-6 h-6 opacity-50" />
            <div class="flex flex-col gap-2">
                <div>
                    <b>{{
                        item.Contributor.name
                    }}</b>
                    <small class="block text-xs text-primary">{{$t('song.contributor')}}</small>
                </div>
                <div class="text-sm text-gray-400 flex flex-col">
                    <small v-if="item.Contributor.subtitle">{{ item.Contributor.subtitle }}</small>
                </div>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { UserCircleIcon } from "@heroicons/vue/outline";
import SearchResultItem from "@/classes/search/searchResultItem";
import { CollectionItem, Song } from "@/classes";
import { ApiContributor } from "dmb-api";

@Options({
    props: {
        item: {
            type: Object,
        },
    },
    components: {
        UserCircleIcon,
    },
    name: "search-result-item",
})
export default class SearchResultItemCard extends Vue {
    public item?: SearchResultItem<Song | CollectionItem<ApiContributor>>;
}
</script>