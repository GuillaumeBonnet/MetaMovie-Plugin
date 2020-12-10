import Vue from 'vue';
import Vuex from 'vuex';
import {
	bubbleModule,
	IBubbleState,
	MutationBubble,
} from '@/store/BubbleStore';
import { removeExpiredBubbles } from '@/Utils/BubbleUtils';
import BubbleData from '@/models/BubbleData';
import { removeElemIf } from '@/Utils/MainUtils';

interface IState {
	video: HTMLVideoElement;
	isFullScreen: boolean;
	cardEdited?: BubbleData;
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
	SET_VIDEO: 'SET_VIDEO',
	SET_IS_FULL_SCREEN: 'SET_IS_FULL_SCREEN',
	SET_CARD_EDITED: 'SET_CARD_EDITED',
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
		cardEdited: undefined,
		currentTime: 0,
		previousTime: 0,
		isFullScreen: !!document.fullscreenElement,
	} as IState,
	mutations: {
		[MutationMain.SET_VIDEO]: (state: IState, video: IState['video']) => {
			state.video = video;
		},
		[MutationMain.SET_IS_FULL_SCREEN]: (
			state: IState,
			isFullScreen: IState['isFullScreen']
		) => {
			state.isFullScreen = isFullScreen;
		},
		[MutationMain.SET_CARD_EDITED]: (
			state: IState,
			cardEdited: IState['cardEdited']
		) => {
			if (state.cardEdited && !cardEdited /*editCardDone*/) {
				let iInsert = 0;
				const bubbles = state.bubbleModule.bubbles;
				while (iInsert < bubbles.length) {
					if (
						state.cardEdited.fromInSeconds() < bubbles[iInsert].fromInSeconds()
					) {
						break;
					}
					iInsert++;
				}
				state.bubbleModule.bubbles.splice(iInsert, 0, state.cardEdited);
				state.video.currentTime = state.cardEdited?.fromInSeconds() - 2;
				state.video.play();
			} else if (cardEdited) {
				removeElemIf(
					state.bubbleModule.bubbles,
					bubble => bubble.id == cardEdited.id
				);
				removeElemIf(
					state.bubbleModule.displayedBubbles,
					bubble => bubble.id == cardEdited.id
				);
				cardEdited.position = cardEdited.userPosition || cardEdited.position;
			}
			state.cardEdited = cardEdited;
		},
		[MutationMain.SET_CURRENT_TIME]: (
			state: IState,
			currentTime: IState['currentTime']
		) => {
			state.currentTime = currentTime;
		},
		[MutationMain.SET_PREVIOUS_TIME]: (
			state: IState,
			previousTime: IState['previousTime']
		) => {
			state.previousTime = previousTime;
		},
		[MutationMain.SET_PROGRESS_INDEX]: (
			state: IState,
			progressIndex: IState['progressIndex']
		) => {
			state.progressIndex = progressIndex;
		},
	},
	actions: {
		[ActionMain.HANDLE_VIDEO_PROGRESSION]: (
			{ commit, state }: IStore,
			currentTime: IState['currentTime']
		) => {
			commit(MutationMain.SET_PREVIOUS_TIME, state.currentTime);
			commit(MutationMain.SET_CURRENT_TIME, currentTime);
			const bubbleList = state.bubbleModule.bubbles;
			if (!bubbleList || bubbleList.length < 1) {
				return;
			}
			let progressIndex = state.progressIndex;
			let displayedBubbles = [] as Array<BubbleData>;
			if (Math.abs(state.currentTime - state.previousTime) > 1 /*sec*/) {
				progressIndex = 0;
				while (
					progressIndex < bubbleList.length &&
					bubbleList[progressIndex].fromInSeconds() < state.currentTime
				) {
					if (bubbleList[progressIndex].toInSeconds() > state.currentTime) {
						displayedBubbles.push(bubbleList[progressIndex]);
					}
					progressIndex++;
				}
				// removeExpiredBubbles(displayedBubbles, state.currentTime);
			} else if (progressIndex < bubbleList.length) {
				displayedBubbles = [...state.bubbleModule.displayedBubbles];
				removeExpiredBubbles(displayedBubbles, state.currentTime);
				while (progressIndex < bubbleList.length) {
					const nextBubble = bubbleList[progressIndex];
					if (nextBubble.fromInSeconds() > state.currentTime) {
						break;
					}
					let indexToInsert = 0;
					for (const bubbleAlreadyDisplayed of displayedBubbles) {
						if (nextBubble.to < bubbleAlreadyDisplayed.to) {
							break;
						}
						indexToInsert++;
					}
					nextBubble.isShown = state.bubbleModule.areBubbleBubbleDisplayed;
					displayedBubbles.splice(indexToInsert, 0, nextBubble);
					progressIndex++;
				}
			} else {
				return;
			}
			if (state.cardEdited) {
				removeElemIf(
					displayedBubbles,
					bubble => bubble.id == state.cardEdited?.id
				);
			}
			commit(MutationBubble.SET_DISPLAYED_BUBBLES, displayedBubbles);
			commit(MutationMain.SET_PROGRESS_INDEX, progressIndex);
		},
	},
};
Vue.use(Vuex);
const compiledStore = new Vuex.Store(store);

export { compiledStore, IState, IStore, MutationMain, ActionMain };
