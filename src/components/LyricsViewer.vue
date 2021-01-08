<template>
    <div class="lyrics">
      <h1 class="lyrics__number">{{ lyrics.number }}</h1>
      <h2 class="lyrics__title">{{ lyrics.title }}</h2>
      <div
        class="lyrics__verse"
        v-for="verse in lyrics.content"
        :key="verse.id"
      >
        <span class="lyrics__verse__number">{{ verse.name }}</span>
        <p
          class="lyrics__verse__line"
          v-for="line in verse.content"
          :key="line.id"
        >
          {{ line }}
        </p>
      </div>
    </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        lyrics: {
            type: Object,
            default: {}
        }
    }
})
export default class LyricsViewer extends Vue {
    
}
</script>

<style lang="scss" scoped>
.lyrics {
  &__verse {
    margin-bottom: 2em;
  }

  &__number {
    font-weight: bold;
  }

  &__line {
    margin: 0.5em;
  }
}
</style>