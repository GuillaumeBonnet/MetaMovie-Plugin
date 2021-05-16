//regardless of the time clicking on times goes there in the video X Y displays
// Icon 'is it displayed right now' when a card is in edit mode it is removed
from // displayedCards and put back at the right place when the edit is done
//TODO add // a card button
<template>
	<div
		:style="dynamicCardStyle"
		class="z-1000000 group absolute p-3 text-4xl rounded-md min-w-card text-center"
		:class="
			isEditDraggingPreview
				? 'bg-black bg-opacity-70 text-yellow-100 text-5xl'
				: isInEdition
				? 'bg-gray-600'
				: 'text-yellow-100 text-5xl hover:text-4xl hover:text-white bg-opacity-70 hover:bg-opacity-100 bg-black hover:bg-gray-600'
		"
		@mousedown="handleCardMouseDown($event)"
	>
		<div
			id="header"
			class="flex justify-between overflow-hidden transition-all duration-100 ease-in-out"
			:class="
				isEditDraggingPreview
					? 'h-0 w-0'
					: isInEdition
					? 'h-14'
					: 'h-0 group-hover:h-14'
			"
		>
			<button
				v-if="canEditCurrentDeck"
				class="material-icons rounded-full w-12 h-12 text-3xl bg-gray-700 shadow-sm hover:shadow-lg focus:outline-none outline-none transform transition-transform duration-300 ease-in-out"
				:class="
					isInEdition
						? 'text-yellow-700 hover:text-yellow-800'
						: 'hover:text-gray-300 scale-0 group-hover:scale-100'
				"
				@click="handleEditButton()"
				@mousedown.stop
				aria-describedby="tooltip-edit-card-in-layout"
			>
				<MatTooltip
					id="tooltip-edit-card-in-layout"
					:label="isInEdition ? 'Validate edition' : 'Edit card'"
				></MatTooltip>
				edit
			</button>
			<div v-else></div>
			<template v-if="isInEdition">
				<button
					class="material-icons mx-2 rounded-full w-12 h-12 text-3xl bg-gray-700 shadow-sm hover:shadow-lg focus:outline-none outline-none transform transition-transform duration-300 ease-in-out text-gray-300 hover:text-white"
					@mousedown="handleDragButton($event)"
					aria-describedby="tooltip-drag-card-in-layout"
				>
					<MatTooltip
						v-if="!isEditDraggingPreview"
						id="tooltip-drag-card-in-layout"
						label="Place card"
					></MatTooltip>
					dynamic_feed
				</button>
				<time-selector
					class="mx-2"
					v-model="card.from"
					label="From"
					@mousedown.stop
				></time-selector>
				<time-selector
					class="mx-2"
					v-model="card.to"
					label="To"
					@mousedown.stop
				></time-selector>
				<percentage-input
					class="mx-2"
					:modelValue="card.position.x"
					label="x: horizontal position(%)"
					@mousedown.stop
					@update:modelValue="updatePositionChanged('x', $event)"
				></percentage-input>
				<percentage-input
					class="mx-2"
					:modelValue="card.position.y"
					label="y: vertical position(%)"
					@mousedown.stop
					@update:modelValue="updatePositionChanged('y', $event)"
				></percentage-input>
			</template>
			<button
				class="material-icons rounded-full w-12 h-12 text-3xl  hover:shadow-sm hover:text-gray-300 outline-none focus:outline-none hover:bg-gray-700 hover:shadow transform transition-transform duration-300 ease-in-out"
				:class="
					isInEdition
						? ''
						: isEditDraggingPreview
						? ''
						: 'scale-0 group-hover:scale-100'
				"
				id="close-button"
				@click="handleCloseButton()"
				@mousedown.stop
				aria-describedby="tooltip-close-card-in-layout"
			>
				<MatTooltip
					id="tooltip-close-card-in-layout"
					label="Hide card"
				></MatTooltip>
				close
			</button>
		</div>
		<div v-if="isInEdition && !isEditDraggingPreview" class="px-10 my-5">
			<label
				class="block rounded-2xl border-solid border-2 border-gray-800 hover:border-gray-900 p-2 focus-within:border-gray-900"
				for="text-edit-card"
			>
				<textarea
					class="mb-4 bg-transparent border-gray-800 hover:border-black focus:border-yellow-600 border-solid border-b-1 p-2 block outline-none resize-none w-full"
					v-model="card.text"
					@mousedown.stop
					id="text-edit-card"
				></textarea>
			</label>
		</div>
		<p v-else class="p-2 whitespace-pre-wrap">
			{{ card.text }}
		</p>
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

import CardData from '@/models/CardData';
import { Prop, Watch } from 'vue-property-decorator';
import { IVideoDimensions, IPositionXY } from '@/models/Types';
import {
	pxToNumber,
	readableTime,
	toFixedCoordinate,
	toRelativeCoordinate,
} from '@/Utils/CardUtils';
import { Mutation, State } from 'vuex-class';
import { MutationCard } from '@/store/CardStore';
import { IState, MutationMain, ActionMain } from '@/store/Store';
import TimeSelector from '@/components/TimeSelector.vue';
import MatTooltip from '@/components/material/MatTooltip.vue';
import PercentageInput from '@/components/PercentageInput.vue';
import { Options, Vue } from 'vue-class-component';
import { GetterDeck } from '@/store/DeckStore';

@Options({
	components: {
		TimeSelector,
		PercentageInput,
		MatTooltip,
	},
})
export default class CardCmp extends Vue {
	@Prop({ required: true })
	private card!: CardData;

	@Prop({ required: true })
	private videoDimensions!: IVideoDimensions; //in px

	get canEditCurrentDeck() {
		return this.$store.getters[GetterDeck.CAN_EDIT_CURRENT_DECK];
	}

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

	public isEditDraggingPreview = false;
	private dragTimeOutId?: number = undefined;

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
	get cardEdited() {
		return this.$store.state.cardEdited;
	}

	get video() {
		return this.$store.state.video;
	}

	get isInEdition() {
		return this.cardEdited?.id == this.card.id;
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

	handleCloseButton() {
		this.$store.dispatch(ActionMain.TOGGLE_CARD_EDITED, undefined);
		this.$store.commit(MutationCard.UPDATE_DISPLAYED_CARD, {
			isShown: false,
			id: this.card.id,
		} as Partial<CardData>);
	}
	handleEditButton() {
		if (!this.isInEdition) {
			this.$store.state.video?.pause();
		}
		this.$store.dispatch(
			ActionMain.TOGGLE_CARD_EDITED,
			this.isInEdition ? null : this.card
		);
	}
	handleCardMouseDown(event: MouseEvent) {
		if (!this.isInEdition) {
			this.clickToDrag(event);
		}
	}
	handleDragButton(event: MouseEvent) {
		this.isEditDraggingPreview = true;
		this.clickToDrag(event);
	}
	updatePositionChanged(axis: 'x' | 'y', value: number) {
		this.card.position[axis] = value;
		this.setPosition();
	}
	clickToDrag(event: MouseEvent) {
		const card = this.$el as HTMLElement;
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

		const headerHeight = this.isEditDraggingPreview
			? 0
			: (this.$el.querySelector('#header') as HTMLElement)?.clientHeight;
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
					bottomController_borders.top + headerHeight + 1 &&
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

		const endDragging = () => {
			clearTimeout(this.dragTimeOutId);
			this.dragTimeOutId = undefined;
			document.removeEventListener('mousemove', onMouseMove);
			card.onmouseleave = null;
			card.onmouseup = null;
			this.$store.commit(MutationMain.UPDATE_CARD_EDITED, {
				position: toRelativeCoordinate(
					this.videoDimensions,
					this.$el as HTMLElement
				),
			} as Partial<CardData>);
			this.isEditDraggingPreview = false; // put at the end in case it'd change $el's dimensions
		};

		if (!this.dragTimeOutId) {
			this.dragTimeOutId = setTimeout(() => {
				endDragging();
			}, 5000);
		}
		card.onmouseleave = (event: MouseEvent) => {
			endDragging();
		};

		card.onmouseup = () => {
			endDragging();
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

<style scoped lang="scss"></style>
