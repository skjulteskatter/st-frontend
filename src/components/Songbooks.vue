<template>
    <div class="songbooks">
      <card
        v-for="songbook in collections"
        :key="songbook.key"
        class="songbooks__book hover"
        :image="songbook.image"
        @click="callback(songbook.key)"
        border
      >
        <h3 class="songbooks__book__title">{{ songbook.name.no }}</h3>
      </card>
    </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
// import { LoaderComponent } from 'vue-elder-loader'
import Card from '@/components/Card.vue'

@Options({
    components: {
        Card,
    },
    props: {
        collections: {
            type: Array,
            default: []
        },
        callback: {
          type: Function,
          default: console.log
        }
    }
})
export default class Songbooks extends Vue {
    
}
</script>

<style lang="scss" scoped>
.songbooks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing);

  &__book {
    max-width: 250px;
    width: 100%;
    transition: all 0.2s ease;
    cursor: pointer;

    &__title {
      margin: 0;
    }
  }
}
</style>