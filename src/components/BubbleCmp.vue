<template>
	<md-card
		v-show="bubble.isShown"
		@mousedown.native="clickToDrag($event)"
		:style="xyPosition"
		class="card"
	>
		<md-card-header>
			<md-card-header-text></md-card-header-text>
			<md-button
				class="md-icon-button"
				@click="handleCloseButton()"
				@mousedown.native.stop
			>
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IVideoDimensions, IPositionXY } from '@/models/Types';
import {
	pxToNumber,
	toFixedCoordinate,
	toRelativeCoordinate,
} from '@/Utils/BubbleUtils';
import { Mutation } from 'vuex-class';
import { MutationBubble } from '@/store/BubbleStore';

@Component({
	components: {
		// sub-components
	},
})
export default class BubbleCmp extends Vue {
	@Prop({ required: true })
	private bubble!: BubbleData;

	@Prop({ required: true })
	private videoDimensions!: IVideoDimensions; //in px
	// videoDimensions replacable by .querySelector('.player-timedtext') ?

	private xyPosition: IPositionXY = { top: '50vh', left: '50vw' };
	mounted() {
		this.setPosition();
	}

	@Watch('videoDimensions')
	onVideoDimensionsChange() {
		this.setPosition();
	}
	@Watch('bubble.isShown')
	onBubbleChange() {
		setTimeout(() => {
			this.setPosition();
		});
	}

	@Mutation(MutationBubble.UPDATE_DISPLAYED_BUBBLE) updateDisplayedBubble: any;
	handleCloseButton() {
		this.updateDisplayedBubble({
			isShown: false,
			index: this.bubble.index,
		} as Partial<BubbleData>);
	}

	video = document.querySelector('video');
	clickToDrag(event: MouseEvent) {
		//TODO : carte bloqué, mousedown dedans, mouseup dehors(=no mouseup), mousemove listenner not cleared
		console.log('gboDebug: clickToDrag');
		const card = event.currentTarget as HTMLElement;
		const shiftX_cursorCard = event.clientX - card.getBoundingClientRect().left;
		const shiftY_cursorCard = event.clientY - card.getBoundingClientRect().top;
		const previousPosition = {
			clientX: event.clientX,
			clientY: event.clientY,
		};
		const bottomController_borders = document
			.querySelector('.PlayerControlsNeo__bottom-controls')
			?.getBoundingClientRect();
		//TODO mutation to update bottomController_borders
		if (!bottomController_borders) {
			return;
		}
		function moveAt(clientX: number, clientY: number) {
			card.style.left = clientX + 'px';
			card.style.top = clientY + 'px';
		}
		// taking initial shifts into account

		const onMouseMove = (event: MouseEvent) => {
			if (
				event.clientY <= 0 ||
				event.clientY >= bottomController_borders.top ||
				event.clientX <= 0 ||
				event.clientX >= window.innerWidth - 5
			) {
				console.log(
					'gboDebug:[toRelativeCoordinate]',
					toRelativeCoordinate(this.videoDimensions, this.$el as HTMLElement)
				);
				document.removeEventListener('mousemove', onMouseMove);
				card.onmouseup = null;
				return;
			}
			if (
				card.getBoundingClientRect().top +
					event.clientY -
					previousPosition.clientY >
					0 &&
				card.getBoundingClientRect().bottom +
					event.clientY -
					previousPosition.clientY <
					bottomController_borders.top &&
				card.getBoundingClientRect().left +
					event.clientX -
					previousPosition.clientX >
					0 &&
				card.getBoundingClientRect().right +
					event.clientX -
					previousPosition.clientX <
					window.innerWidth
			) {
				moveAt(
					pxToNumber(card.style.left) +
						event.clientX -
						previousPosition.clientX,
					pxToNumber(card.style.top) + event.clientY - previousPosition.clientY
				);
			}
			previousPosition.clientX = event.clientX;
			previousPosition.clientY = event.clientY;
		};

		document.addEventListener('mousemove', onMouseMove);
		card.onmouseup = () => {
			console.log('gboDebug: onmouseup');
			console.log(
				'gboDebug:[toRelativeCoordinate]',
				toRelativeCoordinate(this.videoDimensions, this.$el as HTMLElement)
			);
			document.removeEventListener('mousemove', onMouseMove);
			card.onmouseup = null;
		};
	}

	setPosition() {
		if (this.videoDimensions && this.$el) {
			this.xyPosition = toFixedCoordinate(
				this.videoDimensions,
				this.bubble,
				this.$el
			);
		}
	}
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
div.card {
	min-width: 120px;
	position: fixed;
	top: 30vh;
	left: calc(50vw - 60px);
	border-radius: $border-radius;
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
