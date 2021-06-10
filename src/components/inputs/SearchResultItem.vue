<template>
    <base-card class="border hover:border-gray-400 cursor-pointer">
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
        <div class="flex gap-2" v-if="Contributor">
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

@Options({
    props: {
        item: {
            type: Object,
        },
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

// <style lang="scss">
// .song-list__item-card {
//     &__collection {
//         color: var(--st-color-primary);
//         font-size: .7em;
//         display: block;
//     }

//     &__wrapper {
//         display: flex;
//     }

//     &__number {
//         opacity: 0.5;
//     }

//     &__contributors {
//         opacity: 0.5;
//     }

//     &__info {
//         display: block;
//         margin: 0.5rem 0;
//     }

//     .context {
//         margin: 0.5em 0 0 0;
//         opacity: 0.6;
//     }
// }
// </style>
