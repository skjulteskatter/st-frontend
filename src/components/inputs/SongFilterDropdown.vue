<template>
    <base-dropdown :label="$t('common.open')">
        <b>{{ $t("song.filters") }}</b>
        <div class="filter__wrapper gap-x">
            <div class="grouping">
                <small>Video</small>
                <div class="filter gap-x">
                    <input type="checkbox" name="video" id="video" />
                    <label for="video">Karaoke</label>
                </div>
            </div>
            <div class="grouping">
                <small>Lyd</small>
            </div>
            <div class="grouping">
                <small>{{ $t("song.themes") }}</small>
            </div>
        </div>
    </base-dropdown>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseDropdown from "./BaseDropdown.vue";

@Options({
    components: {
        BaseDropdown,
    },
})
export default class SongFilterDropdown extends Vue {}
</script>

<style lang="scss">
.grouping {
    border: 1px dashed var(--st-border-color);
    border-radius: var(--st-border-radius);
    padding: calc(var(--st-spacing) * 0.5);
}

.filter__wrapper {
    display: flex;
    margin-top: calc(var(--st-spacing) * 0.5);

    .filter {
        display: flex;
        align-items: center;
    }
}
</style>