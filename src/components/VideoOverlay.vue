<template>
	<div class="z-1000000 absolute">
		<template v-if="videoDimensions.x">
			<CardCmp
				v-for="card in displayedCards"
				:key="card.id"
				:card="card"
				:videoDimensions="videoDimensions"
				@click="togglePausePlay"
			></CardCmp>
			<CardCmp
				v-if="cardEdited"
				:card="cardEdited"
				:videoDimensions="videoDimensions"
				@click="togglePausePlay"
			></CardCmp>
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
import { Prop, Watch, Ref } from 'vue-property-decorator';
import CardCmp from '@/components/CardCmp.vue';
import CardData from '@/models/CardData';
import { IVideoDimensions } from '@/models/Types';
import { Action, State } from 'vuex-class';
import { ActionMain, IState, MutationMain } from '@/store/Store';
import { ActionCard, ICardState } from '@/store/CardStore';
import { Options, Vue } from 'vue-class-component';

@Options({
	components: {
		CardCmp,
	},
})
export default class VideoOverlay extends Vue {
	/* -------------------------------------------------------------------------- */
	/*                                 properties                                 */
	/* -------------------------------------------------------------------------- */

	get video() {
		return this.$store.state.video;
	}
	private videoDimensions: IVideoDimensions = { x: 0, y: 0 }; //in px

	get cards() {
		return this.$store.state.cardModule.cards;
	}
	get cardEdited() {
		return this.$store.state.cardEdited;
	}

	get displayedCards() {
		return this.$store.state.cardModule.displayedCards;
	}

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
					this.$store.dispatch(
						ActionMain.HANDLE_VIDEO_PROGRESSION,
						currentTime
					);
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

<style lang="postcss">
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    SCSS                                    */
/* -------------------------------------------------------------------------- */
</style>
