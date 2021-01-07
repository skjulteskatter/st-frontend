<template>
  <div class="card" :class="{ 'card-border': border }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    border: {
      type: Boolean,
      default: false,
    },
  },
})
export default class Card extends Vue {}
</script>

<style lang="scss" scoped>
.card {
  padding: 1em;
  background: white;

  &-border {
    border: 1px solid #dddddd;
  }
}
</style>
