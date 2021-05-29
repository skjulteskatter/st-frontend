<template>
    <base-card class="border hover:border-gray-400 cursor-pointer">
        <div class="flex gap-2" v-if="song">
            <b class="text-gray-400">{{ song.number }}</b>
            <div class="flex flex-col gap-2">
                <div>
                    <b>{{
                        getName(song.name)
                    }}</b>
                    <small class="block text-xs text-primary" v-for="c in collections" :key="c.id">{{c.getName(languageKey)}}</small>
                </div>
                <div class="text-sm text-gray-400 flex flex-col">
                    <small v-if="song.yearWritten">{{ song.yearWritten }}</small>
                    <small 
                        v-for="(con, i) in song.contributors"
                        :key="i"
                    >{{ con }}</small>
                </div>
            </div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { IndexedSong } from "dmb-api";

@Options({
    props: {
        song: {
            type: Object,
        },
    },
    name: "song-list-item-card",
})
export default class SongListItemCard extends Vue {
    private store = useStore();
    public song?: IndexedSong;

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public getName(s: LocaleString) {
        return s[this.languageKey] ?? s.en ?? Object.values(s)[0];
    }

    public get collections() {
        return this.store.getters.collections.filter(c => this.song?.collectionIds.includes(c.id));
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
