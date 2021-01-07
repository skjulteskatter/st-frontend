<template>
  <div class="view-song">
      
    <h1>Songbooks</h1>
    <div class="songbooks">
      <card
        v-for="songbook in collections"
        :key="songbook.id"
        class="songbooks__book"
        :image="songbook.image"
        border
      >
        <h2 class="songbooks__book__title">{{ songbook.name.no }}</h2>
      </card>
    </div>

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
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Card from '@/components/Card.vue'
import SongList from '@/components/SongList.vue'
import { useStore } from "vuex";
import { sessionKey } from "@/store";

@Options({
    components: {
        Card,
        SongList
    }
    ,
    computed: {
        collections(){
            return useStore(sessionKey).state.songService?.collections;
        }
    }
})
export default class ViewSong extends Vue {
    private lyrics: Lyrics = {} as Lyrics;

    // public get SongService() {
    //     return this.songService;
    // }

    public get Lyrics() {
        return this.lyrics;
    }
}
</script>
<style lang="scss" scoped>
.songbooks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing);

  &__book {
    grid-column: span 1;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 10px -5px rgba(black, 0.1);
    }

    &-cover {
      background-size: cover;
      background-position: center;
      width: 100%;
      min-height: 200px;
    }

    &__title {
      margin: 0;
    }
  }
}

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
