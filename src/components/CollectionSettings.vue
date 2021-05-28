<template>
    <base-dropdown class="collection-settings">
        <template #button>
            <icon name="settings" style="opacity: 0.5" />
        </template>
        <template #default>
            <input
                v-model="offline"
                id="collection-settings-offline"
                type="checkbox"
            />
            <label for="collection-settings-offline">Offline</label>
            <base-button
                theme="primary"
                icon="check"
                :disabled="saving"
                @click="saveSettings()"
                >{{ $t("common.save") }}</base-button
            >
        </template>
    </base-dropdown>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton } from "@/components";
import { BaseDropdown } from "@/components/inputs";
import { Collection } from "@/classes";

@Options({
    components: {
        BaseButton,
        BaseDropdown,
    },
    props: {
        collection: {
            type: Object,
        },
    },
})
export default class CollectionSettings extends Vue {
    public collection?: Collection;
    public offline = false;

    public saving = false;

    public mounted() {
        this.offline = this.collection?.settings?.offline == true;
    }

    public async saveSettings() {
        this.saving = true;
        await this.collection?.setSettings({
            offline: this.offline,
        });
        this.saving = false;
    }
}
</script>
