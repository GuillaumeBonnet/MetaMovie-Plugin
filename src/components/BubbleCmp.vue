//TODO global edit mode when a bubble is in edit mode it is always displayed
regardless of the time clicking on times goes there in the video X Y displays
Icon 'is it displayed right now' when a bubble is in edit mode it is removed
from displayedBubbles and put back at the right place when the edit is done
//TODO add a bubble button
<template>
	<md-card
		v-show="bubble.isShown"
		@mousedown.native="clickToDrag($event)"
		:style="xyPosition"
		:class="isInEdition ? 'card-edit' : 'card'"
	>
		<md-card-header>
			<div class="md-layout md-alignment-center-space-between">
				<div class="card-actions">
					<md-button
						class="md-icon-button md-icon-button md-raised"
						:class="isInEdition ? 'edit-button--active' : 'edit-button'"
						@click="handleEditButton()"
						@mousedown.native.stop
					>
						<md-icon>edit</md-icon>
					</md-button>
					<template v-if="isInEdition">
						<time-selector
							v-model="bubble.from"
							@mousedown.native.stop
							label="From"
						></time-selector>
						<time-selector
							v-model="bubble.to"
							@mousedown.native.stop
							label="To"
						></time-selector>
					</template>
				</div>
				<md-button
					id="close-button"
					class="md-icon-button"
					@click="handleCloseButton()"
					@mousedown.native.stop
				>
					<md-icon>close</md-icon>
				</md-button>
			</div>
		</md-card-header>
		<md-card-content id="card-text">
			{{ bubble.text }}
		</md-card-content>
	</md-card>
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

import BubbleData from '@/models/BubbleData';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IVideoDimensions, IPositionXY } from '@/models/Types';
import {
	pxToNumber,
	toFixedCoordinate,
	toRelativeCoordinate,
} from '@/Utils/BubbleUtils';
import { Mutation, State } from 'vuex-class';
import { MutationBubble } from '@/store/BubbleStore';
import { IState, MutationMain } from '@/store/Store';
import TimeSelector from '@/components/TimeSelector.vue';

@Component({
	components: {
		// sub-components
		TimeSelector,
	},
})
export default class BubbleCmp extends Vue {
	@Prop({ required: true })
	private bubble!: BubbleData;

	@Prop({ required: true })
	private videoDimensions!: IVideoDimensions; //in px

	@Watch('bubble.from')
	onBubbleFromChange() {
		this.video.currentTime = this.bubble.fromInSeconds();
	}

	private xyPosition: IPositionXY = { top: '50vh', left: '50vw' };
	mounted() {
		this.setPosition();
	}

	@State((state: IState) => state.cardEdited)
	cardEdited!: IState['cardEdited'];

	@State((state: IState) => state.video)
	video!: IState['video'];

	get isInEdition() {
		console.log(
			`gboDebug: cardEdited${this.cardEdited?.id} vs ${this.bubble?.id}`
		);
		return this.bubble.id && this.cardEdited?.id == this.bubble.id;
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
		this.$store.commit(MutationMain.SET_CARD_EDITED, undefined);
		this.updateDisplayedBubble({
			isShown: false,
			id: this.bubble.id,
		} as Partial<BubbleData>);
	}
	handleEditButton() {
		console.log('gboDebug:[this.bubble]', this.bubble);
		this.$store.commit(
			MutationMain.SET_CARD_EDITED,
			this.isInEdition ? null : this.bubble
		);
	}
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

		const headerHeight = (this.$el.querySelector(
			'div.md-card-header'
		) as HTMLElement)?.clientHeight;
		bottomController_borders.top + headerHeight;
		const onMouseMove = (event: MouseEvent) => {
			if (
				card.getBoundingClientRect().top +
					event.clientY -
					previousPosition.clientY >
					0 &&
				card.getBoundingClientRect().bottom +
					event.clientY -
					previousPosition.clientY <
					bottomController_borders.top + headerHeight &&
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

		card.onmouseleave = (event: MouseEvent) => {
			document.removeEventListener('mousemove', onMouseMove);
			card.onmouseleave = null;
			card.onmouseup = null;
		};

		card.onmouseup = () => {
			console.log('gboDebug: onmouseup');
			console.log(
				'gboDebug:[toRelativeCoordinate]',
				toRelativeCoordinate(this.videoDimensions, this.$el as HTMLElement)
			);
			document.removeEventListener('mousemove', onMouseMove);
			card.onmouseleave = null;
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
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    SCSS                                    */
/* -------------------------------------------------------------------------- */

@import '@/styles/variables-and-mixins.scss';

$transitionTiming: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

.card-actions {
	display: flex;
	align-items: center;
	& * {
		margin: 4px;
	}
}

div.card:not(:hover) {
	background-color: rgba($color: #000000, $alpha: 0.7);
	& .text--primary {
		text-shadow: 2px 2px 2px black;
	}
	& .md-card-header *,
	& .md-card-header .card-actions * {
		height: 0px;
		opacity: 0;
	}
	box-shadow: none;
}
div.card,
div.card-edit {
	min-width: 120px;
	max-width: 90vw;
	position: fixed;
	top: 30vh;
	left: calc(50vw - 60px);
	border-radius: $border-radius;
	transition: background-color $transitionTiming;
	& #card-text {
		font-size: 36px;
		color: bisque;
	}
	& .md-card-header .card-actions * {
		transition: height $transitionTiming;
		transition: opacity $transitionTiming;
	}
	& button.edit-button {
		background-color: #212121 !important;
		&--active {
			@extend .edit-button;
			& i {
				color: #ff6f00 !important;
			}
		}
	}
}
</style>
