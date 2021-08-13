<template>
    <base-card class="hover:ring-2 hover:ring-gray-400 cursor-pointer">
        <div class="flex gap-2" v-if="Song">
            <b class="text-gray-400">{{ Song.number }}</b>
            <div class="flex flex-col gap-2">
                <div>
                    <b>{{
                        getName(Song.name)
                    }}</b>
                    <small class="block text-xs text-primary" v-for="c in collections" :key="c.id">{{c.getName(languageKey)}}</small>
                </div>
                <div class="text-sm text-gray-400 flex flex-col">
                    <small v-if="Song.yearWritten">{{ Song.yearWritten }}</small>
                    <small 
                        v-for="(con, i) in Song.contributors"
                        :key="i"
                    >{{ con }}</small>
                </div>
            </div>
        </div>
        <div class="flex gap-2 flex-col" v-if="Contributor">
            <UserCircleIcon class="w-6 h-6 opacity-50" />
            <div class="flex flex-col gap-2">
                <div>
                    <b>{{
                        Contributor.name
                    }}</b>
                    <small class="block text-xs text-primary">{{$t('song.contributor')}}</small>
                </div>
                <div class="text-sm text-gray-400 flex flex-col">
                    <small v-if="Contributor.subtitle">{{ Contributor.subtitle }}</small>
                </div>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { IndexedContributor, IndexedSong } from "dmb-api";
import { UserCircleIcon } from "@heroicons/vue/outline";

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
export default class SongListItemCard extends Vue {
    private store = useStore();
    public item?: IndexedSong | IndexedContributor;

    public get Song() {
        return this.type == "song" ? this.item as IndexedSong : null;
    }

    public get Contributor() {
        return this.type == "contributor" ? this.item as IndexedContributor : null;
    }

    public get type() {
        if (typeof(this.item?.name) == "string") {
            return "contributor";
        } else {
            return "song";
        }
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public getName(s: LocaleString) {
        return s[this.languageKey] ?? s.en ?? Object.values(s)[0];
    }

    public get collections() {
        return this.store.getters.collections.filter(c => this.Song?.collectionIds.includes(c.id));
    }
}
</script>
