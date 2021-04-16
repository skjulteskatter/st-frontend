<template>
    <div class="feedback-form">
        <div
            class="feedback-form__back"
            v-if="showForm"
            @click="closeForm"
        ></div>
        <base-card class="feedback-form__card" v-if="showForm" border>
            <form @submit.prevent="sendFeedback" class="feedback-form__form">
                <b>{{ $t("feedback.reporterror") }}</b>
                <base-input
                    required
                    :label="$t('feedback.problem')"
                    v-model="form.title"
                    type="text"
                ></base-input>
                <base-input
                    required
                    :label="$t('feedback.describe')"
                    v-model="form.description"
                    type="textarea"
                ></base-input>
                <div class="feedback-form__form__actions">
                    <base-button theme="primary" icon="send" type="submit"
                        >Send</base-button
                    >
                </div>
            </form>
        </base-card>
        <button class="feedback-form__button" @click="openForm">
            <div class="feedback-form__button__background"></div>
            <span class="feedback-form__button__label">
                {{ $t("feedback.reporterror") }}
            </span>
            <Icon name="exclamation" size="20" />
        </button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";
import { BaseInput } from "@/components/inputs";
import { BaseCard, BaseButton } from "@/components";
import { useStore } from "@/store/typed";
import { NotificationActionTypes } from "@/store/typed/modules/notifications/action-types";

@Options({
    name: "feedback-form",
    components: {
        Icon,
        BaseCard,
        BaseButton,
        BaseInput,
    },
})
export default class FeedbackForm extends Vue {
    private store = useStore();
    public showForm = false;
    public form = {
        title: "",
        description: "",
        user: {
            platform: "",
            page: "",
            email: "",
        },
    };

    public openForm() {
        this.resetForm();

        this.showForm = true;
    }

    public closeForm() {
        this.showForm = false;
    }

    public resetForm() {
        this.form.title = "";
        this.form.description = "";
        this.form.user.platform = "";
        this.form.user.page = "";
        this.form.user.email = "";
    }

    public populateUserInfo() {
        this.form.user.platform = navigator.userAgent;
        this.form.user.page = this.$route.fullPath;
        this.form.user.email = this.store.getters.user?.email ?? "";
    }

    public sendFeedback() {
        this.closeForm();
        this.populateUserInfo();

        //console.log(this.form);
        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            title: "Report sent",
            type: "success",
            icon: "check",
        });
    }
}
</script>

<style lang="scss">
.feedback-form {
    position: fixed;
    bottom: var(--st-spacing);
    right: var(--st-spacing);

    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--st-spacing);

    z-index: 99999;

    &__back {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(black, 0.5);
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);

        &__actions {
            display: flex;
            gap: calc(var(--st-spacing) / 2);
        }
    }

    &__button {
        padding: var(--st-spacing);
        border-radius: 3rem;
        position: relative;

        background-color: transparent;
        color: var(--st-text-color);
        font-weight: 500;

        display: flex;
        align-items: center;

        z-index: 999999;

        &__background {
            position: absolute;
            bottom: 0;
            right: 0;

            background: var(--st-color-background-card);
            border: 1px solid var(--st-color-border);
            width: 35%;
            height: 100%;

            border-radius: 2rem;
            transition: width 150ms;
            box-shadow: 0 5px 20px rgba(black, 0.2);

            z-index: -1;
        }

        &__label {
            opacity: 0;
            transform: translateX(1rem);
            margin-right: var(--st-spacing);
        }

        &:hover,
        &:focus {
            .feedback-form__button__label {
                transition: opacity 200ms, transform 200ms;
                transform: translateX(0);
                opacity: 1;
            }

            .feedback-form__button__background {
                width: 100%;
            }
        }
    }
}
</style>
