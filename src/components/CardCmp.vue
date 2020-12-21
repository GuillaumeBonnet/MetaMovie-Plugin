//TODO global edit mode when a card is in edit mode it is always displayed
regardless of the time clicking on times goes there in the video X Y displays
Icon 'is it displayed right now' when a card is in edit mode it is removed from
displayedCards and put back at the right place when the edit is done //TODO add
a card button
<template>
	<md-card
		@mousedown.native="clickToDrag($event)"
		:style="dynamicCardStyle"
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
							v-model="card.from"
							label="From"
							@mousedown.native.stop
						></time-selector>
						<time-selector
							v-model="card.to"
							label="To"
							@mousedown.native.stop
						></time-selector>
						<percentage-input
							:value="card.position.x"
							label="x: horizontal position(%)"
							@mousedown.native.stop
						></percentage-input>
						<percentage-input
							:value="card.position.y"
							label="y: vertical position(%)"
							@mousedown.native.stop
						></percentage-input>
					</template>
				</div>
				<md-button
					v-if="!isInEdition"
					id="close-button"
					class="md-icon-button"
					@click="handleCloseButton()"
					@mousedown.native.stop
				>
					<md-icon>close</md-icon>
				</md-button>
			</div>
		</md-card-header>
		<md-card-content>
			<md-field v-if="isInEdition" class="textarea-field">
				<md-textarea
					v-model="card.text"
					md-autogrow
					md-counter="100"
					@mousedown.native.stop
				></md-textarea>
			</md-field>
			<div class="card-text" v-else>
				{{ card.text }}
			</div>
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

import CardData from '@/models/CardData';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IVideoDimensions, IPositionXY } from '@/models/Types';
import {
	pxToNumber,
	readableTime,
	toFixedCoordinate,
	toRelativeCoordinate,
} from '@/Utils/CardUtils';
import { Mutation, State } from 'vuex-class';
import { MutationCard } from '@/store/CardStore';
import { IState, MutationMain, ActionMain, IStore } from '@/store/Store';
import TimeSelector from '@/components/TimeSelector.vue';
import PercentageInput from '@/components/PercentageInput.vue';

@Component({
	components: {
		// sub-components
		TimeSelector,
		PercentageInput,
	},
})
export default class CardCmp extends Vue {
	@Prop({ required: true })
	private card!: CardData;

	@Prop({ required: true })
	private videoDimensions!: IVideoDimensions; //in px

	@Watch('card.from')
	onCardFromChange() {
		if (this.card.toInSeconds() - this.card.fromInSeconds() < 1) {
			this.card.to = readableTime(this.card.fromInSeconds() + 1);
		}
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			this.card.fromInSeconds()
		);
	}
	@Watch('card.to')
	onCardToChange() {
		if (this.card.toInSeconds() < 1) {
			this.card.from = readableTime(0);
			this.card.to = readableTime(1);
		} else if (this.card.toInSeconds() - this.card.fromInSeconds() < 1) {
			this.card.from = readableTime(this.card.toInSeconds() - 1);
		}
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			this.card.toInSeconds()
		);
	}

	private xyPosition: IPositionXY = { top: '50vh', left: '50vw' };
	mounted() {
		this.setPosition();
	}

	get dynamicCardStyle() {
		const dynamicStyle = {
			...this.xyPosition,
		};
		if (!this.card.isShown) {
			dynamicStyle.top = '-100vh';
		}
		return dynamicStyle;
	}

	@State((state: IState) => state.cardEdited)
	cardEdited!: IState['cardEdited'];

	@State((state: IState) => state.video)
	video!: IState['video'];

	get isInEdition() {
		return this.card.id && this.cardEdited?.id == this.card.id;
	}

	@Watch('videoDimensions')
	onVideoDimensionsChange() {
		this.setPosition();
	}
	@Watch('card.isShown')
	onCardChange() {
		setTimeout(() => {
			this.setPosition();
		});
	}

	@Mutation(MutationCard.UPDATE_DISPLAYED_CARD) updateDisplayedCard: any;
	handleCloseButton() {
		this.$store.dispatch(ActionMain.TOGGLE_CARD_EDITED, undefined);
		this.updateDisplayedCard({
			isShown: false,
			id: this.card.id,
		} as Partial<CardData>);
	}
	handleEditButton() {
		if (!this.isInEdition) {
			(this.$store as IStore).state.video.pause();
		}
		this.$store.dispatch(
			ActionMain.TOGGLE_CARD_EDITED,
			this.isInEdition ? null : this.card
		);
	}
	clickToDrag(event: MouseEvent) {
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

		const storePosition = () => {
			this.$store.commit(MutationMain.UPDATE_CARD_EDITED, {
				position: toRelativeCoordinate(
					this.videoDimensions,
					this.$el as HTMLElement
				),
			} as Partial<CardData>);
		};

		card.onmouseleave = (event: MouseEvent) => {
			document.removeEventListener('mousemove', onMouseMove);
			card.onmouseleave = null;
			card.onmouseup = null;
			storePosition();
		};

		card.onmouseup = () => {
			document.removeEventListener('mousemove', onMouseMove);
			card.onmouseleave = null;
			card.onmouseup = null;
			storePosition();
		};
	}

	setPosition() {
		if (this.videoDimensions && this.$el) {
			this.xyPosition = toFixedCoordinate(
				this.videoDimensions,
				this.card,
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
	& .card-text {
		font-size: 36px;
		line-height: 1em;
		white-space: pre-wrap;
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
