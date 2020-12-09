import Vue from 'vue';
import Vuex from 'vuex';
import {
	bubbleModule,
	IBubbleState,
	MutationBubble,
} from '@/store/BubbleStore';
import { removeExpiredBubbles } from '@/Utils/BubbleUtils';
import BubbleData from '@/models/BubbleData';

interface IState {
	video: HTMLVideoElement;
	isFullScreen: boolean;
	idCardEdited?: string;
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
	SET_ID_CARD_EDITED: 'SET_ID_CARD_EDITED',
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
		idCardEdited: undefined,
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
		[MutationMain.SET_ID_CARD_EDITED]: (
			state: IState,
			idCardEdited: IState['idCardEdited']
		) => {
			state.idCardEdited = idCardEdited;
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
				console.log('gboDebug: first if');
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
				console.log('gboDebug:[displayedBubbles]', displayedBubbles);
				removeExpiredBubbles(displayedBubbles, state.currentTime);
				console.log(
					'gboDebug:[displayedBubbles after removeExpiredBubbles]',
					displayedBubbles
				);
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
			commit(MutationBubble.SET_DISPLAYED_BUBBLES, displayedBubbles);
			commit(MutationMain.SET_PROGRESS_INDEX, progressIndex);
		},
	},
};
Vue.use(Vuex);
const compiledStore = new Vuex.Store(store);

export { compiledStore, IState, IStore, MutationMain, ActionMain };
