<template>
    <BaseModal :show="show" @close="close">
        <template #title>
            <h3 class="font-bold text-xl px-4">{{ $t("bandSync_title") }}</h3>
        </template>

        <div class="flex flex-col gap-4 w-full max-w-md px-4">
            <template v-if="isActive">
                <div class="rounded-xl bg-black/5 dark:bg-white/10 p-5 text-center">
                    <p class="font-semibold text-base mb-4">{{ statusLabel }}</p>
                    <p v-if="role === 'leader'" class="text-sm opacity-70 mb-4">
                        {{ $t("bandSync_shareCodeHint") }}
                    </p>
                    <p class="text-4xl font-bold tracking-widest font-mono mb-4">
                        {{ code }}
                    </p>
                    <div v-if="sessionExpiry" class="text-sm opacity-70 mb-4">
                        <p :class="{ 'text-amber-600 dark:text-amber-400': sessionExpiry.isUrgent }">
                            {{ $t("bandSync_expires") }} {{ sessionExpiry.relative }}
                        </p>
                        <p class="text-xs opacity-60 mt-1">{{ sessionExpiry.absolute }}</p>
                    </div>
                    <BaseButton
                        v-if="role === 'leader'"
                        theme="secondary"
                        class="w-full"
                        @click="copyCode"
                    >
                        {{ $t("bandSync_copyCode") }}
                    </BaseButton>
                    <BaseButton
                        v-if="role === 'leader'"
                        theme="secondary"
                        class="w-full mt-2"
                        :disabled="isProcessing"
                        @click="renewSession"
                    >
                        {{ $t("bandSync_renewSession") }}
                    </BaseButton>
                    <p
                        v-if="role === 'leader'"
                        class="text-xs opacity-60 mt-2"
                    >
                        {{ $t("bandSync_renewSessionHint", { days: sessionTtlDays }) }}
                    </p>
                    <BaseButton
                        v-if="canTakeLead"
                        theme="secondary"
                        class="w-full mt-2"
                        :disabled="isProcessing"
                        @click="takeLead"
                    >
                        {{ $t("bandSync_takeLead") }}
                    </BaseButton>
                    <BaseButton
                        v-if="showResync"
                        theme="secondary"
                        class="w-full mt-2"
                        @click="handleResync"
                    >
                        {{ $t("bandSync_resync") }}
                    </BaseButton>
                </div>
                <div class="flex flex-col gap-2">
                    <BaseButton theme="primary" @click="close">
                        {{ $t("bandSync_done") }}
                    </BaseButton>
                    <BaseButton theme="secondary" @click="leaveSession">
                        {{ role === "leader" ? $t("bandSync_endSession") : $t("bandSync_leave") }}
                    </BaseButton>
                </div>
            </template>

            <template v-else>
                <p class="text-sm leading-relaxed opacity-80">
                    {{ $t("bandSync_description") }}
                </p>

                <template v-if="canStart">
                    <BaseButton
                        theme="primary"
                        class="w-full"
                        :disabled="isProcessing"
                        @click="startSession"
                    >
                        {{ $t("bandSync_startSession") }}
                    </BaseButton>
                </template>
                <div
                    v-else
                    class="rounded-xl border border-primary/30 bg-black/5 dark:bg-white/10 p-4"
                >
                    <p class="font-semibold text-sm mb-1">
                        {{ $t("bandSync_startSession") }}
                    </p>
                    <p class="text-sm opacity-70">
                        {{ $t("bandSync_startRequiresSong") }}
                    </p>
                </div>

                <div class="flex items-center gap-3 my-2">
                    <div class="flex-1 h-px bg-black/10 dark:bg-white/20" />
                    <span class="text-xs uppercase opacity-50">{{ $t("common_or") }}</span>
                    <div class="flex-1 h-px bg-black/10 dark:bg-white/20" />
                </div>

                <BaseInput
                    v-model="codeInput"
                    :label="$t('bandSync_enterCode')"
                    class="uppercase"
                    @keyup.enter="joinSession"
                />
                <BaseButton
                    theme="secondary"
                    class="w-full"
                    :disabled="isProcessing || !codeInput.trim()"
                    @click="joinSession"
                >
                    {{ $t("bandSync_joinSession") }}
                </BaseButton>
            </template>

            <Loader :loading="isProcessing" position="local" />

            <p v-if="errorMessage" class="text-sm text-red-500 text-center">
                {{ errorMessage }}
            </p>
            <p v-if="loginError" class="text-sm text-red-500 text-center">
                {{ loginError }}
            </p>
        </div>
    </BaseModal>
</template>

<script lang="ts">
import { BaseModal } from "@/components";
import { BaseInput } from "@/components/inputs";
import auth from "@/services/auth";
import { resyncBandSyncToLeader } from "@/services/bandSync/bandSyncCoordinatorRegistry";
import { formatSessionExpiry, SESSION_TTL_DAYS } from "@/services/bandSync/bandSyncSession";
import { useStore } from "@/store";
import { BandSyncActionTypes } from "@/store/modules/bandSync/action-types";
import { defineComponent, PropType } from "vue";

export type BandSyncStartContext = {
    songbookId: string;
    songNumber: number;
    transposition: number;
};

export default defineComponent({
    name: "band-sync-modal",
    components: {
        BaseModal,
        BaseInput,
    },
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        startContext: {
            type: Object as PropType<BandSyncStartContext | null>,
            default: null,
        },
        onResync: {
            type: Function as PropType<(() => Promise<void>) | undefined>,
            default: undefined,
        },
    },
    emits: ["close"],
    data: () => ({
        store: useStore(),
        codeInput: "",
        loginError: null as string | null,
        expiryNow: new Date(),
        expiryIntervalId: null as ReturnType<typeof setInterval> | null,
    }),
    computed: {
        isActive() {
            return this.store.state.bandSync.role !== "none" &&
                this.store.state.bandSync.code != null;
        },
        role() {
            return this.store.state.bandSync.role;
        },
        code() {
            return this.store.state.bandSync.code ?? "";
        },
        isProcessing() {
            return this.store.state.bandSync.isProcessing;
        },
        errorMessage() {
            return this.store.state.bandSync.errorMessage;
        },
        canStart() {
            return this.startContext != null;
        },
        statusLabel(): string {
            if (this.role === "leader") {
                return this.$t("bandSync_leaderLabel") as string;
            }
            if (!this.store.state.bandSync.followingLeaderUpdates) {
                return this.$t("bandSync_outOfSyncLabel") as string;
            }
            if (this.store.state.bandSync.syncStatus === "outOfSync") {
                return this.$t("bandSync_outOfSyncLabel") as string;
            }
            return this.$t("bandSync_followingLabel") as string;
        },
        canTakeLead(): boolean {
            return (
                this.role === "member" &&
                this.session != null &&
                auth.user?.uid === this.session.leaderId
            );
        },
        showResync() {
            return (
                this.role === "member" &&
                !this.store.state.bandSync.followingLeaderUpdates
            );
        },
        session() {
            return this.store.state.bandSync.session;
        },
        languageKey() {
            return this.store.getters.languageKey as string;
        },
        sessionExpiry() {
            if (!this.session?.expireAt) {
                return null;
            }
            return formatSessionExpiry(
                this.session.expireAt,
                this.languageKey,
                this.expiryNow,
            );
        },
        sessionTtlDays() {
            return SESSION_TTL_DAYS;
        },
    },
    watch: {
        show(isOpen: boolean) {
            if (isOpen && this.isActive) {
                this.startExpiryTimer();
            } else {
                this.stopExpiryTimer();
            }
        },
        isActive(isActive: boolean) {
            if (isActive && this.show) {
                this.startExpiryTimer();
            } else {
                this.stopExpiryTimer();
            }
        },
    },
    mounted() {
        if (this.show && this.isActive) {
            this.startExpiryTimer();
        }
    },
    unmounted() {
        this.stopExpiryTimer();
        this.store.dispatch(BandSyncActionTypes.CANCEL_START);
    },
    methods: {
        close() {
            this.store.dispatch(BandSyncActionTypes.CANCEL_START);
            this.$emit("close");
        },
        startSession() {
            this.loginError = null;
            if (!auth.user) {
                this.loginError = this.$t("bandSync_loginRequired") as string;
                return;
            }
            const ctx = this.startContext;
            if (!ctx) return;

            this.store.dispatch(BandSyncActionTypes.CREATE_SESSION, {
                songbookId: ctx.songbookId,
                songNumber: ctx.songNumber,
                transposition: ctx.transposition,
            });
        },
        joinSession() {
            const code = this.codeInput.trim();
            if (!code) return;

            this.store.dispatch(BandSyncActionTypes.JOIN_SESSION, code);
        },
        async leaveSession() {
            await this.store.dispatch(BandSyncActionTypes.LEAVE_SESSION);
            this.close();
        },
        async handleResync() {
            if (this.onResync) {
                await this.onResync();
                return;
            }
            await resyncBandSyncToLeader();
        },
        async takeLead() {
            await this.store.dispatch(BandSyncActionTypes.TAKE_LEAD);
        },
        renewSession() {
            this.store.dispatch(BandSyncActionTypes.RENEW_SESSION);
        },
        startExpiryTimer() {
            this.expiryNow = new Date();
            if (this.expiryIntervalId != null) {
                return;
            }
            this.expiryIntervalId = setInterval(() => {
                this.expiryNow = new Date();
            }, 60_000);
        },
        stopExpiryTimer() {
            if (this.expiryIntervalId != null) {
                clearInterval(this.expiryIntervalId);
                this.expiryIntervalId = null;
            }
        },
        copyCode() {
            if (this.code) {
                void navigator.clipboard
                    .writeText(this.code)
                    .catch(() => undefined);
            }
        },
    },
});
</script>
