<template>
	<div
		:style="dynamicCardStyle"
		class="card z-1000000 group absolute p-3 text-3xl rounded-md min-w-card text-center"
		:class="
			isEditDraggingPreview
				? 'bg-black bg-opacity-70 text-yellow-100'
				: isInEdition
				? 'bg-gray-600'
				: 'text-yellow-100 hover:text-white bg-opacity-70 hover:bg-opacity-100 bg-black hover:bg-gray-600'
		"
		@mousedown="handleCardMouseDown($event)"
	>
		<div
			id="header"
			class="overflow-hidden transition-all duration-100 ease-in-out"
			:class="
				isEditDraggingPreview
					? 'h-0 w-0'
					: isInEdition
					? 'h-auto'
					: 'h-0 group-hover:h-auto'
			"
		>
			<div class="flex justify-between">
				<div>
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
					<button
						v-if="isInEdition"
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
				</div>

				<button
					class="material-icons rounded-full w-12 h-12 text-3xl  hover:shadow-sm hover:text-gray-300 outline-none focus:outline-none hover:bg-gray-700 transform transition-transform duration-300 ease-in-out"
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

			<template v-if="isInEdition">
				<button
					@click="playOrPause()"
					class="material-icons focus:outline-none outline-none"
				>
					{{
						$store.state.aboutVideo.playOrPause == 'PLAY'
							? 'pause_circle_outline'
							: 'play_circle_outline'
					}}
				</button>
				<div>{{ readableTime($store.state.aboutVideo.currentTime) }}</div>
				<div class="flex justify-center mt-2">
					<button
						class="material-icons rounded-full w-12 h-12 text-3xl  hover:shadow-sm hover:text-gray-300 outline-none focus:outline-none hover:bg-gray-700 transform transition-transform duration-300 ease-in-out"
						id="close-button"
						@click="handleGoBackwardButton()"
						@mousedown.stop
						aria-describedby="tooltip-go-backward"
					>
						<MatTooltip
							id="tooltip-go-backward"
							label="Go backward"
						></MatTooltip>
						restore
					</button>
					<div
						class="px-1 text-xl flex items-center text-white bg-gray-900 border border-solid border-gray-500 hover:border-yellow-600 rounded-lg"
					>
						<label for="duration-input">+/-</label>
						<input
							id="duration-input"
							class="w-12 bg-transparent outline-none text-center"
							v-model="timeInterval.value"
							@blur="timeInterval.handleBlur()"
						/>
						<label for="duration-input">s</label>
					</div>
					<button
						class="material-icons rounded-full w-12 h-12 text-3xl  hover:shadow-sm hover:text-gray-300 outline-none focus:outline-none hover:bg-gray-700 transform transition-transform duration-300 ease-in-out"
						:class="
							isInEdition
								? ''
								: isEditDraggingPreview
								? ''
								: 'scale-0 group-hover:scale-100'
						"
						id="close-button"
						@click="handleGoForwardButton()"
						@mousedown.stop
						aria-describedby="tooltip-go-forward"
					>
						<MatTooltip id="tooltip-go-forward" label="Hide card"></MatTooltip>
						more_time
					</button>
				</div>
				<div class="text-sm italic mt-2">
					Click on the clock icons to set the current time as the From or To
					timestamp of the card
				</div>
				<div class="text-sm italic mt-2">
					Or type the numbers
				</div>
				<div class="flex">
					<div class="p-2 w-1/2">
						<time-selector
							class=""
							v-model="card.from"
							label="From"
							@mousedown.stop
							:iconCallback="setCurrentTimeAsFrom"
						></time-selector>
					</div>
					<div class="p-2 w-1/2">
						<time-selector
							class=""
							v-model="card.to"
							label="To"
							@mousedown.stop
							:iconCallback="setCurrentTimeAsTo"
						></time-selector>
					</div>
				</div>
				<div class="flex">
					<div class="p-2 w-1/2">
						<percentage-input
							class=""
							:modelValue="card.position.x"
							label="x: horizontal position(%)"
							@mousedown.stop
							@update:modelValue="updatePositionChanged('x', $event)"
						></percentage-input>
					</div>
					<div class="p-2 w-1/2">
						<percentage-input
							class=""
							:modelValue="card.position.y"
							label="y: vertical position(%)"
							@mousedown.stop
							@update:modelValue="updatePositionChanged('y', $event)"
						></percentage-input>
					</div>
				</div>
			</template>
		</div>
		<div v-if="isInEdition && !isEditDraggingPreview" class="my-5">
			<label
				class="block rounded-2xl border-solid border-2 border-gray-800 hover:border-gray-900 p-2 focus-within:border-gray-900"
				for="text-edit-card"
			>
				<textarea
					class="text-base mb-4 bg-transparent border-gray-800 hover:border-black focus:border-yellow-600 border-solid border-b-1 p-2 block outline-none resize-none w-full"
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

type Duration = {
	_value: string;
	value: string;
	unit: 's' | 'min';
	handleBlur: Function;
};

const MIN_INTERVAL = 1;

@Options({
	components: {
		TimeSelector,
		PercentageInput,
		MatTooltip,
	},
})
export default class CardCmp extends Vue {
	readableTime = readableTime;
	@Prop({ required: true })
	private card!: CardData;

	@Prop({ required: true })
	private videoDimensions!: IVideoDimensions; //in px

	timeInterval: Duration = {
		_value: '10',
		get value() {
			return this._value;
		},
		set value(value) {
			if (value == '') {
				this._value = '';
			} else if (Number.isInteger(Number.parseInt(value))) {
				this._value = '' + Number.parseInt(value); // '10a' parse into 10
			}
		},
		unit: 's',
		handleBlur() {
			if (!this._value) {
				this._value = '10';
			}
		},
	};

	get canEditCurrentDeck() {
		return this.$store.getters[GetterDeck.CAN_EDIT_CURRENT_DECK];
	}

	@Watch('card.from')
	onCardFromChange() {
		if (this.card.toInSeconds() - this.card.fromInSeconds() < MIN_INTERVAL) {
			this.card.to = readableTime(this.card.fromInSeconds() + MIN_INTERVAL);
		}
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			this.card.fromInSeconds()
		);
	}

	setCurrentTimeAsFrom() {
		this.card.from = readableTime(this.$store.state.aboutVideo.currentTime);
		// will trigger onCardFromChange()
	}
	@Watch('card.to')
	onCardToChange() {
		if (this.card.toInSeconds() < MIN_INTERVAL) {
			this.card.from = readableTime(0);
			this.card.to = readableTime(MIN_INTERVAL);
		} else if (
			this.card.toInSeconds() - this.card.fromInSeconds() <
			MIN_INTERVAL
		) {
			this.card.from = readableTime(this.card.toInSeconds() - MIN_INTERVAL);
		}
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			this.card.toInSeconds()
		);
	}
	setCurrentTimeAsTo() {
		this.card.to = readableTime(this.$store.state.aboutVideo.currentTime);
		// will trigger onCardToChange()
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
		return this.$store.state.aboutVideo.video;
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
			this.$store.state.aboutVideo.video?.pause();
		}
		this.$store.dispatch(
			ActionMain.TOGGLE_CARD_EDITED,
			this.isInEdition ? null : this.card
		);
	}
	handleCardMouseDown(event: MouseEvent) {
		this.clickToDrag(event);
	}
	handleDragButton(event: MouseEvent) {
		event.stopPropagation();
		if (!this.isEditDraggingPreview) {
			this.isEditDraggingPreview = true;
			this.clickToDrag(event);
		} else {
			this.clickToDrag(event);
		}
	}
	updatePositionChanged(axis: 'x' | 'y', value: number) {
		this.card.position[axis] = value;
		this.setPosition();
	}
	clickToDrag(event: MouseEvent) {
		const card = this.$el as HTMLElement;
		const previousPosition = {
			clientX: event.clientX,
			clientY: event.clientY,
		};
		const bottomController_borders = document
			.querySelector('.PlayerControlsNeo__bottom-controls')
			?.getBoundingClientRect();
		//TODO mutation to update bottomController_borders in order to not do a querySelector at every drag event
		if (!bottomController_borders) {
			return;
		}
		function moveAt(clientX: number, clientY: number) {
			card.style.left = clientX + 'px';
			card.style.top = clientY + 'px';
		}

		const headerHeight = this.isEditDraggingPreview
			? 0
			: (this.$el.querySelector('#header') as HTMLElement)?.clientHeight;
		const calculateShiftToBeBound = () => {
			const shiftToComeBackInBounds = {
				x: 0,
				y: 0,
			};
			if (card.getBoundingClientRect().top < 0) {
				shiftToComeBackInBounds.y = -card.getBoundingClientRect().top;
			}
			if (card.getBoundingClientRect().left < 0) {
				shiftToComeBackInBounds.x = -card.getBoundingClientRect().left;
			}
			if (
				card.getBoundingClientRect().bottom >
				bottomController_borders.top + headerHeight + 1
			) {
				shiftToComeBackInBounds.y =
					bottomController_borders.top +
					headerHeight +
					1 -
					card.getBoundingClientRect().bottom;
			}
			if (card.getBoundingClientRect().right > window.innerWidth) {
				shiftToComeBackInBounds.x =
					window.innerWidth - card.getBoundingClientRect().right;
			}
			return shiftToComeBackInBounds;
		};
		const onMouseMove = (event: MouseEvent) => {
			const shiftToBeBound = calculateShiftToBeBound();
			const cursorShift = {
				x: event.clientX - previousPosition.clientX,
				y: event.clientY - previousPosition.clientY,
			};
			const canMove =
				((shiftToBeBound.y >= 0 && cursorShift.y >= 0) ||
					(shiftToBeBound.y <= 0 && cursorShift.y <= 0)) &&
				((shiftToBeBound.x >= 0 && cursorShift.x >= 0) ||
					(shiftToBeBound.x <= 0 && cursorShift.x <= 0));
			if (canMove) {
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
			const shiftToComeBackInBounds = calculateShiftToBeBound();

			if (shiftToComeBackInBounds.x != 0 || shiftToComeBackInBounds.y != 0) {
				moveAt(
					pxToNumber(card.style.left) + shiftToComeBackInBounds.x,
					pxToNumber(card.style.top) + shiftToComeBackInBounds.y
				);
			}
			this.$store.commit(MutationMain.UPDATE_CARD_EDITED, {
				position: toRelativeCoordinate(
					this.videoDimensions,
					this.$el as HTMLElement
				),
			} as Partial<CardData>);
			this.isEditDraggingPreview = false; // put at the end in case it'd change $el's dimensions
		};

		if (!this.dragTimeOutId) {
			// snap out of drag after timeout incase the dragging is stuck to the pointer forever
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

	playOrPause() {
		if (this.$store.state.aboutVideo.video?.paused) {
			this.$store.state.aboutVideo.video?.play();
		} else {
			this.$store.state.aboutVideo.video?.pause();
		}
	}

	handleGoBackwardButton() {
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			this.$store.state.aboutVideo.currentTime -
				Number.parseInt(this.timeInterval._value)
		);
	}
	handleGoForwardButton() {
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			this.$store.state.aboutVideo.currentTime +
				Number.parseInt(this.timeInterval._value)
		);
	}
}
</script>

<style scoped lang="scss">
.card:hover:after {
	// https://codepen.io/csilverman/post/fixing-the-jitter-bug
	content: '';
	height: calc(100% + 1em);
	position: absolute;
	left: -0.05%;
	width: 101%;
	z-index: -1;
	bottom: -1em;
	top: 0;
}
</style>
