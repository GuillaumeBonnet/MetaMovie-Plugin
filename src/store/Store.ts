import Vue from 'vue';
import Vuex from 'vuex';
import {
	bubbleModule,
	IBubbleState,
	MutationBubble,
} from '@/store/BubbleStore';
import { removeExpiredBubble } from '@/Utils/BubbleUtils';

interface IState {
	isFullScreen: boolean;
	currentTime: number;
	previousTime: number;
	progressIndex: number;
	bubbleModule: IBubbleState;
}

interface IStore {
	state: IState;
	commit: Function;
}

const MutationMain = {
	SET_IS_FULL_SCREEN: 'SET_IS_FULL_SCREEN',
	SET_CURRENT_TIME: 'SET_CURRENT_TIME',
	SET_PREVIOUS_TIME: 'SET_PREVIOUS_TIME',
	SET_PROGRESS_INDEX: 'SET_PROGRESS_INDEX',
};
const ActionMain = {
	HANDLE_VIDEO_PROGRESSION: 'HANDLE_VIDEO_PROGRESSION',
};

const store = {
	modules: {
		bubbleModule,
	},
	state: {
		progressIndex: 0,
		currentTime: 0,
		previousTime: 0,
		isFullScreen: !!document.fullscreenElement,
	} as IState,
	mutations: {
		[MutationMain.SET_IS_FULL_SCREEN]: (
			state: IState,
			isFullScreen: boolean
		) => {
			state.isFullScreen = isFullScreen;
		},
		[MutationMain.SET_CURRENT_TIME]: (state: IState, currentTime: number) => {
			state.currentTime = currentTime;
		},
		[MutationMain.SET_PREVIOUS_TIME]: (state: IState, previousTime: number) => {
			state.previousTime = previousTime;
		},
		[MutationMain.SET_PROGRESS_INDEX]: (
			state: IState,
			progressIndex: number
		) => {
			state.progressIndex = progressIndex;
		},
	},
	actions: {
		[ActionMain.HANDLE_VIDEO_PROGRESSION]: (
			{ commit, state }: IStore,
			currentTime: number
		) => {
			commit(MutationMain.SET_PREVIOUS_TIME, state.currentTime);
			commit(MutationMain.SET_CURRENT_TIME, currentTime);
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
				commit(MutationBubble.SET_DISPLAYED_BUBBLES, displayedBubbles);
				commit(MutationMain.SET_PROGRESS_INDEX, progressIndex);
			}
		},
	},
};
Vue.use(Vuex);
const compiledStore = new Vuex.Store(store);

export { compiledStore, IState, IStore, MutationMain, ActionMain };
