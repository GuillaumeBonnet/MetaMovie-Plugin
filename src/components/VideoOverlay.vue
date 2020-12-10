<template>
	<div class="full-screen-overlay">
		<template v-if="videoDimensions.x">
			<BubbleCmp
				v-for="bubble in displayedBubbles"
				:key="bubble.id"
				:bubble="bubble"
				:videoDimensions="videoDimensions"
				@click="togglePausePlay"
			></BubbleCmp>
			<BubbleCmp
				v-if="cardEdited"
				:bubble="cardEdited"
				:videoDimensions="videoDimensions"
				@click="togglePausePlay"
			></BubbleCmp>
		</template>
	</div>
</template>

<script lang="ts">
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                     TS                                     */
/* -------------------------------------------------------------------------- */
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator';
import BubbleCmp from '@/components/BubbleCmp.vue';
import Menu from '@/components/Menu.vue';
import { getModule } from 'vuex-module-decorators';
import BubbleData from '@/models/BubbleData';
import { IVideoDimensions } from '@/models/Types';
import { Action, State } from 'vuex-class';
import { ActionMain, IState, MutationMain } from '@/store/Store';
import { ActionBubble, IBubbleState } from '@/store/BubbleStore';

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

	@State((state: IState) => state.video)
	private video!: IState['video'];
	private videoDimensions: IVideoDimensions = { x: 0, y: 0 }; //in px

	@State((state: IState) => state.bubbleModule.bubbles)
	bubblesInStore!: IBubbleState['bubbles'];

	@State((state: IState) => state.cardEdited)
	cardEdited!: IState['cardEdited'];

	@State((state: IState) => state.bubbleModule.displayedBubbles)
	displayedBubbles!: IBubbleState['displayedBubbles'];

	@Action(ActionMain.HANDLE_VIDEO_PROGRESSION) handleVideoProgression: any;

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
			const video = document.querySelector('video');
			if (video) {
				this.$store.commit(MutationMain.SET_VIDEO, video);
				video.addEventListener('timeupdate', event => {
					const video = event.target as HTMLVideoElement;
					const currentTime = video && video.currentTime;
					if (!currentTime) return;
					this.handleVideoProgression(currentTime);
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
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    SCSS                                    */
/* -------------------------------------------------------------------------- */
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
