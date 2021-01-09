<template>
    <div class="lyrics-settings">
        <card class="lyrics-settings__verses" border>
            <h2 class="lyrics-settings__verses__title">Verses</h2>
            <div class="lyrics-settings__verses__input" v-for="verse in lyrics.content" :key="verse.key">
                <input :id="verse.name" type="checkbox">
                <label :for="verse.name">Verse {{ verse.name }}</label>
            </div>
        </card>
    </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import Card from '@/components/Card.vue'

@Options({
    props: {
        lyrics: {
            type: Object,
            default: {}
        }
    },
    components: {
        Card
    }
})
export default class LyricsSettings extends Vue {
    
}
</script>

<style lang="scss" scoped>
.lyrics-settings {
    &__verses {
        &__title {
            margin: 0;
        }

        &__input {
            margin-right: .5em;
            padding: .5em;
            // display: inline-block;
            // border: 1px solid var(--border-color);
            // border-radius: var(--border-radius);
        }
    }
}
</style>