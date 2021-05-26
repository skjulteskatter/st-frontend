<template>
    <div class="osmd-wrapper">
        <div class="osmd-controls">
            <div class="osmd-controls__transpose">
                <loader :loading="osmdLoading" :position="'local'"/>
                <Icon
                    name="arrowLeft"
                    class="osmd-controls__button"
                    @click="
                        transposition > -12
                            ? transpose(transposition - 1)
                            : undefined
                    "
                />
                <span class="osmd-controls__key" @click="transpose(0)">
                    {{ options.originalKey ?? "Key" }} ({{
                        transposition > 0 ? "+" + transposition : transposition
                    }})
                </span>
                <Icon
                    name="arrowRight"
                    class="osmd-controls__button"
                    @click="
                        transposition < 12
                            ? transpose(transposition + 1)
                            : undefined
                    "
                />
                <div class="osmd-controls__zoom">
                    <small>{{ Math.floor(zoom * 100) }}%</small>
                    <input
                        type="range"
                        v-model="zoom"
                        @change="setZoom"
                        min="0.4"
                        max="1.4"
                        step="0.1"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Icon } from "@/components/icon";
import { Loader } from "@/components";
import { osmd } from "@/services/osmd";

@Options({
    components: {
        Icon,
        Loader,
    },
    props: {
        options: {
            type: Object,
        },
    },
    name: "OSMD",
})
export default class OSMD extends Vue {
    public osmd = osmd;
    public originalKey?: string;
    public transposition = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public playbackControl: any;
    public zoom = 1;
    public createdDone = false;
    public loading: string[] = [];
    public options: SheetMusicOptions = { show: false };

    public async mounted() {
        this.transposition = this.options.transposition ?? 0;
        this.zoom = this.osmd.zoom;
        const c = document.getElementById("osmd-canvas");

        await this.osmd.init(c, null);

        try {
            await this.osmd.load(this.options);
        } catch (e) {
            //console.log(e);
        }
    }

    public get osmdLoading() {
        return this.osmd.loading;
    }

    public transpose(n: number) {
        this.osmd.loading = true;
        this.transposition = n;
        // setTimeout(() => {
            if (this.transposition == n) {
                this.osmd.transpose(n);
            }
        // }, 500);
        this.osmd.loading = false;
    }

    public setZoom() {
        const n = this.zoom;

        // setTimeout(() => {
            if (this.zoom == n) {
                this.osmd.zoom = this.zoom;
                this.osmd.rerender();
            }
        // }, 500);
    }
}
</script>
<style lang="scss">
@import "../style/mixins";

.osmd-controls {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--st-spacing);
    position: relative;

    @include breakpoint("small") {
        flex-direction: column;
        align-items: initial;
    }

    &__title {
        margin: 0;
    }

    &__transpose {
        padding: 0.5em;
        border: 1px solid var(--st-color-primary);
        border-radius: var(--st-border-radius);
        display: flex;
        align-items: center;

        position: absolute;
        right: 0;
        top: -4rem;

        @include breakpoint("small") {
            position: initial;
            top: initial;
            left: initial;
        }
    }

    &__zoom {
        display: flex;
        flex-direction: column;

        width: 150px;

        // input[type=range] {

        // }
    }

    &__button {
        color: var(--st-color-primary);
        cursor: pointer;

        &:hover {
            transform: translateY(-2px);
        }
    }

    &__key {
        padding: 0 var(--st-spacing);
        cursor: pointer;

        &:hover {
            transform: translateY(-2px);
        }
    }
}

.osmd-wapper {
    --mdc-theme-primary: #eb6201;
    --mdc-theme-secondary: #eb6201;
}
/* tooltip styles. Unused for now - Perhaps remove if it remains so */
[data-md-tooltip] {
    position: relative;
}
[data-md-tooltip]:before {
    content: attr(data-md-tooltip);
    position: absolute;
    bottom: 8px;
    left: 50%;
    padding: 1px 8px;
    transform: translateX(-50%) scale(0);
    transition: transform 0.3s ease-in-out;
    transition-delay: 0.7s;
    transform-origin: top;
    background: #616161;
    color: white;
    border-radius: 2px;
    font-size: 12px;
    font-family: Roboto, sans-serif;
    font-weight: 400;
    z-index: 99999;
}
.mdc-tab--active[data-md-tooltip]:before {
    background: var(--mdc-theme-primary);
}
[data-md-tooltip]:hover:before {
    transform: translateX(-50%) scale(1);
}
/* POSITIONING */

.left {
    text-align: left;
}

.right {
    text-align: right;
}

.center {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}

.justify {
    text-align: justify;
}

.d-inline-block {
    display: inline-block;
}

.d-block {
    display: block;
}

.d-inline {
    display: inline;
}

.d-none {
    display: none;
}

.v-align-middle {
    vertical-align: middle;
}

.v-align-top {
    vertical-align: top;
}

.v-align-bottom {
    vertical-align: bottom;
}

/* ==== GRID SYSTEM ==== */

.container {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

.row {
    position: relative;
    width: 100%;
}

.row [class^="col"] {
    float: left;
    margin: 0.5rem 2%;
    min-height: 0.125rem;
}

.col-1 {
    width: 6.3333%;
}

.col-2 {
    width: 14.6666%;
}

.col-3 {
    width: 23%;
}

.col-4 {
    width: 31.3333%;
}

.col-5 {
    width: 39.6666%;
}

.col-6 {
    width: 48%;
}

.col-7 {
    width: 56.3333%;
}

.col-8 {
    width: 64.6666%;
}

.col-9 {
    width: 73%;
}

.col-10 {
    width: 81.3333%;
}

.col-11 {
    width: 89.6666%;
}

.col-12 {
    width: 98%;
}

.col-1,
.col-2,
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8,
.col-9,
.col-10,
.col-11,
.col-12 {
    display: inline-block;
}

.mdc-touch-target-wrapper {
    z-index: 99;
}
.annotation-ui-container {
    font-family: "Roboto", sans-serif;
}

.toolbar {
    padding: 8px;
    border-bottom: solid 1px #888888;
}

.text-center {
    text-align: center;
}

.half-container {
    display: inline-block;
    width: 49.2%;
    vertical-align: middle;
}

.settings-button-container {
    position: fixed;
    bottom: 15px;
    left: 5px;
    z-index: 50;
}

.settings-button-container .mdc-fab {
    margin-left: 5px;
    margin-right: 5px;
}

.control-panel {
    position: fixed;
    bottom: 60px;
    left: 0;
    padding: 0 5px;
    width: 100%;
    overflow: hidden;
    background: transparent;
}

.controls-container {
    width: 350px;
}

.playback-title-bar {
    margin-bottom: 8px;
}

.controls-container .volume-toolbar,
.controls-container .metronome-toolbar {
    padding-left: 10px;
    padding-right: 10px;
}

.controls-container .metronome-toolbar {
    margin-top: 10px;
}

.controls-container .mdc-button.mdc-button--outlined {
    height: 28px;
    padding: 0px;
}

.controls-container
    .mdc-button.mdc-button--outlined.mdc-icon-button--on
    .mdc-button__ripple {
    background-color: rgba(241, 154, 92, 0.25);
    transition: background-color 0.5s ease;
}

.playback-buttons {
    bottom: 5px;
    left: calc(50% - 56px);
}

.playpause-button .pause-icon {
    display: none;
}

.playpause-button.playing .pause-icon {
    display: block;
}

.playpause-button.playing .play-icon {
    display: none;
}

.slider-container {
    margin-left: 10px;
}

.annotation-menu {
    position: fixed;
    bottom: 60px;
    left: 5px;
    width: 375px;
    max-width: 90%;
    overflow-x: hidden;
    background-color: #ffffff;
}

.preview-container {
    position: fixed;
    bottom: 60px;
    left: 385px;
    width: 90px;
    height: 90px;
    max-width: 10%;
    background-color: #ffffff;
}

.preview-container > #render-element {
    text-align: center;
    width: 100%;
    line-height: 1.5;
    margin-top: 38px;
    max-height: 100%;
}

.hide {
    visibility: hidden !important;
    display: none !important;
    transition: display 0.5s ease;
    transition: visibility 0.5s ease;
}

.comment-input-dragger,
.symbol-placer-dragger {
    font-size: 1.25rem;
    cursor: pointer;
    z-index: 999;
    vertical-align: top;
}

.comment-input {
    background-color: rgba(255, 255, 128, 0.4);
    border: dotted 1px blue;
    resize: none;
    overflow: hidden;
    font-family: Times New Roman;
    line-height: 1.1;
    z-index: 1000;
}

.mdc-tab-scroller__scroll-content {
    overflow-y: hidden;
}

#add-symbol-mode {
    overflow-y: hidden;
}

.gonville-icon {
    font-family: Gonville;
    max-height: 100%;
    margin-top: -18px;
}
/*Special rules for custom SVG icon*/
.symbol-icon-group {
    fill: var(--mdc-theme-text-secondary-on-background);
    stroke: var(--mdc-theme-text-secondary-on-background);
}

.mdc-tab--active .symbol-icon-group {
    fill: var(--mdc-theme-primary);
    stroke: var(--mdc-theme-primary);
}

.gonville-icon div span {
    padding: 0px 2px;
}

.symbol-render {
    font-family: Gonville;
    display: inline-block;
    z-index: 1000;
    line-height: 1;
}

.symbol-render-measure {
    position: absolute;
    visibility: hidden;
    font-family: Gonville;
    display: inline-block;
    z-index: -99999;
    line-height: 1;
}

.comment-input:focus {
    border-width: 2px;
    outline: none;
    outline-offset: 0px;
}

#text-measure-element {
    position: absolute;
    visibility: hidden;
    line-height: 1;
    z-index: -99999;
}

#dragger-measure-element {
    font-size: 1.25rem;
    position: absolute;
    visibility: hidden;
    z-index: -99999;
}

#text-measure-element.symbol {
    font-family: Gonville;
}

.color-swatch-list {
    display: inline-block;
    overflow-x: hidden;
    white-space: nowrap;
    margin: 0;
    font: inherit;
    vertical-align: baseline;
    list-style: none;
}

.color-swatch-list .color-swatch {
    display: inline-block;
    border: 0;
    vertical-align: baseline;
    color: #fff;
    cursor: pointer;
    outline: 0;
    position: relative;
    width: 28px;
    height: 28px;
    margin: 2px;
    list-style-type: none;
    transition: border-width 0.6s linear;
}

.color-swatch-list .color-swatch.selected {
    outline: 2px solid;
}

.color-swatch-list .color-swatch.selected {
    outline-color: #000000;
}

.color-swatch-list .color-swatch.selected.negative {
    outline-color: #666666;
}

.symbol-swatch-list .symbol-swatch.selected {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 80px;
}

.symbol-swatch-list .symbol-swatch,
.preview-container > #render-element,
.gonville-icons {
    font-family: Gonville;
}

.layer-list-item {
    border-bottom: 1px solid #666666;
    font-weight: bold;
    color: #333333;
    cursor: pointer;
    transition: background-color 0.5s ease;
}

.layer-list-item .text-content {
    padding-top: 15px;
    padding-bottom: 15px;
}

.layer-list-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.layer-list-item.selected {
    background-color: #eb620160;
}

.layer-list-item .mdc-icon-button,
.add-layer-controls-container .mdc-icon-button {
    float: right;
}

.layer-list-item .list-buttons {
    z-index: 50;
}

.splide {
    padding: 2rem 3rem;
}

.splide.vertical {
    padding: 3.5rem 2rem;
}

.splide.splide.vertical .splide__list {
    border-top: 1px solid #666666;
}

.splide.vertical .splide__list {
    width: 100%;
}

.splide__arrow {
    z-index: 20;
}

.splide__pagination__page {
    background-color: #aaa;
}

.splide__pagination__page.is-active {
    background-color: #ccc;
}
</style>

