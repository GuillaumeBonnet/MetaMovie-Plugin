

<template>
    <div>Bubble</div>
    <!-- <v-card v-show="isShown"
    class="card mx-auto"
    :style="xyPosition"
    dark>
        <v-btn class="button-close"
        @click="handleCloseButton()"
        text dark small
        color="primary">
            <v-icon dark>mdi-close</v-icon>
        </v-btn>
        <v-card-text>				
            <div class="text--primary">
                {{text}}
            </div>
        </v-card-text>
    </v-card> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
    components: {
        // sub-components
    },
})
export default class Bubble extends Vue {
    @Prop({ required: true})
    private text!: string;
    @Prop({ required: true})
    private videoDimensions!: {x: number; y: number}; //in px
    @Prop({default: 50})
    private x!: number;
    @Prop({default: 50})
    private y!: number;

    private isShown = true;
    private xyPosition = { top: '50vh', left: '50vw'}

    mounted() {
        this.setPosition();
    }

    @Watch('videoDimensions')
    onVideoDimensionsChange() {
        this.setPosition();
    }
    handleCloseButton() {
        this.isShown = false;
    }

    showBubble() {
        this.isShown = true;
    }

    setPosition() {
        if(this.videoDimensions && this.$el) {
            const topValue = this.y * (this.videoDimensions.y - this.$el.clientHeight) / 100;
            const leftValue = this.x * (this.videoDimensions.x - this.$el.clientWidth) / 100;
            this.xyPosition.top = topValue + 'px';
            this.xyPosition.left = leftValue + 'px';
        }
    }
}
</script>

<style scoped lang="scss">
    button.button-close.button-close {
        height:32px;
        width:32px;
        min-width: unset;
        max-width: unset;
        float: right;
    }

    div.card {
        min-width: 120px;
        position: fixed;
        top: 30vh;
        left: calc(50vw - 60px);
        &:not(:hover) {
            background-color: transparent;
            & .text--primary {
                text-shadow: 2px 2px 2px black;
            }
            & button {
                opacity: 0;
            }
            box-shadow: none;
        }
    }
</style>
