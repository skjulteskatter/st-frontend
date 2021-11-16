<template>
    <BaseCard v-if="book">
        <h1>{{book.title}}</h1>
    </BaseCard>
</template>
<script lang="ts">
import { Book } from "@/classes/scriptures";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "book-card",
    props: {
        book: {
            type: Object,
        },
    },
})
export default class BookCard extends Vue {
    public book?: Book;
}
</script>
