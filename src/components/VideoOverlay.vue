<template>
	<div class="full-screen-overlay">
		<template v-if="videoDimensions.x">
			<BubbleCmp
				v-for="(bubble, index) in displayedBubbles"
				:key="index"
				:bubble="bubble"
				:videoDimensions="videoDimensions"
				@click="togglePausePlay"
			></BubbleCmp>
		</template>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator';
import BubbleCmp from '@/components/BubbleCmp.vue';
import Menu from '@/components/Menu.vue';
import { getModule } from 'vuex-module-decorators';
import BubbleData from '@/models/BubbleData';
import { IVideoDimensions } from '@/models/Types';

@Component({
	components: {
		BubbleCmp,
		Menu,
	},
})
export default class VideoOverlay extends Vue {
	/* -------------------------------------------------------------------------- */
	/*                                 properties                                 */
	/* -------------------------------------------------------------------------- */

	private video!: HTMLVideoElement | null;
	private videoDimensions: IVideoDimensions = { x: 0, y: 0 }; //in px

	private bubbleStore = getModule(BubbleStore, this.$store);

	private bubbles: {
		list: BubbleData[];
		progressIndex: number;
		nextBubble: Function;
	} = {
		list: this.bubbleStore.bubbles,
		progressIndex: 0,
		nextBubble: function(): boolean | BubbleData {
			return this.list && this.list[this.progressIndex];
		},
	};
	private bubbleDisplayed_list: BubbleData[] = [];
	private nextInfoTime = this.bubbleStore.bubbles[0]?.from;
	private previousTime = 0;

	created() {
		const setVideoDimensions = () => {
			const videoContainer = document.querySelector(
				'div.VideoContainer'
			) as HTMLElement;
			const bottomController = document.querySelector(
				'div.PlayerControlsNeo__bottom-controls'
			);
			if (!videoContainer || !bottomController) {
				return;
			}
			this.videoDimensions = {
				x: videoContainer.clientWidth,
				y: videoContainer.clientHeight - bottomController.clientHeight,
			};
		};
		const videoEvent = () => {
			this.video = document.querySelector('video');
			if (this.video) {
				this.video.addEventListener('timeupdate', event => {
					const currentTime = this.video && this.video.currentTime;
					if (!currentTime) return;
					this.bubbleStore.handleVideoProgression(currentTime);
				});
				setVideoDimensions();
			} else {
				console.error('no video found.');
				setTimeout(videoEvent, 200);
			}
		};
		videoEvent();
		document.onfullscreenchange = event => {
			setTimeout(() => {
				setVideoDimensions();
			}, 100);
			//TODO understand why there is a racecondition between re-rendering and async queue
		};
	}

	/* -------------------------------------------------------------------------- */
	/*                                   methods                                  */
	/* -------------------------------------------------------------------------- */

	handleVideoProgression(currentTime: number) {
		if (Math.abs(currentTime - this.previousTime) > 1) {
			//build a queue with the bubbles after current time
			this.bubbleDisplayed_list = [];
			this.bubbles.progressIndex = 0;
			const indexNextBubble = this.bubbles.list.findIndex(
				bubble => bubble.from >= currentTime
			);

			if (indexNextBubble == -1) {
				this.bubbles.progressIndex = this.bubbles.list.length;
			} else if (indexNextBubble == 0) {
				this.bubbles.progressIndex = 0;
			} else {
				this.bubbles.progressIndex = indexNextBubble - 1;
			}
		}

		const removeExpiredBubble = () => {
			if (
				this.bubbleDisplayed_list[0] &&
				this.bubbleDisplayed_list[0].to <= currentTime
			) {
				this.bubbleDisplayed_list.shift();
			}
		};
		removeExpiredBubble();

		const nextBubble = this.bubbles.nextBubble();
		if (nextBubble && currentTime >= nextBubble.from) {
			this.bubbles.progressIndex++; // = nextBubble index
			let indexToInsert = 0;
			for (const bubbleAlreadyDisplayed of this.bubbleDisplayed_list) {
				if (nextBubble.to < bubbleAlreadyDisplayed.to) {
					break;
				}
				indexToInsert++;
			}
			this.bubbleDisplayed_list.splice(indexToInsert, 0, nextBubble);
		}
		removeExpiredBubble();
		this.previousTime = currentTime;
	}

	/* -------------------------------------------------------------------------- */
	/*                                  handlers                                  */
	/* -------------------------------------------------------------------------- */

	togglePausePlay() {
		if (!this.video) {
			return;
		}
		this.video.click();
	}
}
</script>

<style lang="scss">
div.full-screen-overlay {
	position: absolute;
	z-index: 1000000;
}
div.v-application.v-application {
	position: relative;
	z-index: 2;
	height: 0;
	width: 0;
}
</style>
