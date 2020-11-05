<template>
	<md-card v-show="bubble.isShown" :style="xyPosition" class="card">
		<md-card-header>
			<md-card-header-text></md-card-header-text>
			<md-button class="md-icon-button" @click="handleCloseButton()">
				<md-icon>close</md-icon>
			</md-button>
		</md-card-header>
		<md-card-content>
			{{ bubble.text }}
		</md-card-content>
	</md-card>
</template>

<script lang="ts">
import BubbleData from '@/models/BubbleData';
import BubbleStore from '@/store/BubbleStore';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

@Component({
	components: {
		// sub-components
	},
})
export default class BubbleCmp extends Vue {
	@Prop({ required: true })
	private bubble!: BubbleData;

	@Prop({ required: true })
	private videoDimensions!: { x: number; y: number }; //in px

	private xyPosition = { top: '50vh', left: '50vw' };
	private bubbleStore = getModule(BubbleStore, this.$store);

	mounted() {
		this.setPosition();
	}

	@Watch('videoDimensions')
	onVideoDimensionsChange() {
		this.setPosition();
	}
	handleCloseButton() {
		this.bubbleStore.updateDisplayedBubble({
			isShown: false,
			index: this.bubble.index,
		});
	}

	setPosition() {
		if (this.videoDimensions && this.$el) {
			const topValue =
				(this.bubble.y * (this.videoDimensions.y - this.$el.clientHeight)) /
				100;
			const leftValue =
				(this.bubble.x * (this.videoDimensions.x - this.$el.clientWidth)) / 100;
			this.xyPosition.top = topValue + 'px';
			this.xyPosition.left = leftValue + 'px';
		}
	}
}
</script>

<style scoped lang="scss">
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
