import Vuex from 'vuex';
import {
	bubbleModule,
	IBubbleState,
	MutationBubble,
} from '@/store/BubbleStore';
import { removeExpiredBubble } from '@/Utils/BubbleUtils';

interface Istate {
	isFullScreen: boolean;
	currentTime: number;
	previousTime: number;
	progressIndex: number;
	bubbleModule: IBubbleState;
}

interface IStore {
	state: Istate;
	commit: Function;
}

enum Mutation {
	SET_IS_FULL_SCREEN,
	SET_CURRENT_TIME,
	SET_PREVIOUS_TIME,
	SET_PROGRESS_INDEX,
}
enum Action {
	HANDLE_VIDEO_PROGRESSION,
}

const store = {
	state: {
		progressIndex: 0,
		currentTime: 0,
		previousTime: 0,
		isFullScreen: !!document.fullscreenElement,
	} as Istate,
	mutations: {
		[Mutation.SET_IS_FULL_SCREEN]: (state: Istate, isFullScreen: boolean) => {
			state.isFullScreen = isFullScreen;
		},
		[Mutation.SET_CURRENT_TIME]: (state: Istate, currentTime: number) => {
			state.currentTime = currentTime;
		},
		[Mutation.SET_PREVIOUS_TIME]: (state: Istate, previousTime: number) => {
			state.previousTime = previousTime;
		},
		[Mutation.SET_PROGRESS_INDEX]: (state: Istate, progressIndex: number) => {
			state.progressIndex = progressIndex;
		},
	},
	actions: {
		[Action.HANDLE_VIDEO_PROGRESSION]: (
			{ commit, state }: IStore,
			currentTime: number
		) => {
			commit(Mutation.SET_PREVIOUS_TIME, state.currentTime);
			commit(Mutation.SET_CURRENT_TIME, currentTime);
			if (
				!state.bubbleModule.bubbles ||
				state.bubbleModule.bubbles.length < 1
			) {
				return;
			}
			let displayedBubbles = [...state.bubbleModule.displayedBubbles];
			let progressIndex = state.progressIndex;
			if (Math.abs(state.currentTime - state.previousTime) > 1) {
				displayedBubbles = [];
				progressIndex = 0;
				const indexNextBubble = state.bubbleModule.bubbles.findIndex(
					bubble => bubble.from >= state.currentTime
				);
				if (indexNextBubble == -1) {
					progressIndex = state.bubbleModule.bubbles.length;
				} else if (indexNextBubble == 0) {
					progressIndex = 0;
				} else {
					progressIndex = indexNextBubble - 1;
				}
			}
			if (progressIndex < state.bubbleModule.bubbles.length) {
				const nextBubble = state.bubbleModule.bubbles[progressIndex];
				removeExpiredBubble(displayedBubbles, state.currentTime);
				if (state.currentTime >= nextBubble.from) {
					progressIndex++;
					let indexToInsert = 0;
					for (const bubbleAlreadyDisplayed of state.bubbleModule
						.displayedBubbles) {
						if (nextBubble.to < bubbleAlreadyDisplayed.to) {
							break;
						}
						indexToInsert++;
					}
					nextBubble.isShown = state.bubbleModule.areBubbleBubbleDisplayed;
					displayedBubbles.splice(indexToInsert, 0, nextBubble);
				}
				removeExpiredBubble(displayedBubbles, state.currentTime);
				commit(
					`bubbleModule/${MutationBubble.SET_DISPLAYED_BUBBLES}`,
					displayedBubbles
				);
				commit(Mutation.SET_PROGRESS_INDEX, progressIndex);
			}
		},
	},
	modules: {
		bubbleModule,
	},
};

const compiledStore = new Vuex.Store(store);

export { compiledStore };
