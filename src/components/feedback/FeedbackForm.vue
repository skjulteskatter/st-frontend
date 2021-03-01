<template>
    <div class="feedback-form">
        <div
            class="feedback-form__back"
            v-if="showForm"
            @click="closeForm"
        ></div>
        <base-card class="feedback-form__card" v-if="showForm" border>
            <form @submit.prevent="sendFeedback" class="feedback-form__form">
                <b>{{ $t("feedback.sendfeedback") }}</b>
                <base-input
                    required
                    :label="$t('feedback.problem')"
                    v-model="form.title"
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
                {{ $t("feedback.sendfeedback") }}
            </span>
            <Icon name="speaker" size="20" />
        </button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";
import { BaseInput } from "@/components/inputs";
import { BaseCard, BaseButton } from "@/components";
import { notificationStore } from "@/store";

@Options({
    components: {
        Icon,
        BaseCard,
        BaseButton,
        BaseInput,
    },
})
export default class FeedbackForm extends Vue {
    private notifications = notificationStore;
    public showForm = false;
    public form = {
        title: "",
        description: "",
        user: {
            platform: "",
            page: "",
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
    }

    public populateUserInfo() {
        this.form.user.platform = navigator.userAgent;
        this.form.user.page = this.$route.fullPath;
    }

    public sendFeedback() {
        this.closeForm();
        this.populateUserInfo();

        alert(`Title: ${this.form.title}
			Description: ${this.form.description}
			Platform: ${this.form.user.platform}
			Page: ${this.form.user.page}`);
        this.notifications.dispatch("addNotification", {
            title: "Feedback sent",
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

            background: var(--st-background-color);
            border: 1px solid var(--st-border-color);
            width: 30%;
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