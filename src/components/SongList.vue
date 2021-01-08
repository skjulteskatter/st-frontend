<template>
  <div class="song-list">
    <span class="song-list__item hover" v-for="item in items" :key="item.id">
      {{ item }}
    </span>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    items: {
      type: Array,
      default: [],
    },
  },
})
export default class SongList extends Vue {}
</script>

<style lang="scss" scoped>
.song-list {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--spacing) * 0.5);

  &__item {
    max-width: 50px;
    width: 100%;
    background-color: white;
    border: 1px solid #d0d0d0;
    border-radius: 5px;
    padding: calc(var(--spacing) * 0.25);

    cursor: pointer;
    text-align: center;
  }
}
</style>
