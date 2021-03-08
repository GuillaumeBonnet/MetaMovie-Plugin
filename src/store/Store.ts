import { createStore } from 'vuex';
import {
	cardModule,
	ICardState,
	initialState as initialStateCardModule,
	MutationCard,
} from '@/store/CardStore';
import {
	deckModule,
	IDeckState,
	initialState as initialStateDeckModule,
	MutationDeck,
} from '@/store/DeckStore';
import { addCardToList, removeExpiredCards } from '@/Utils/CardUtils';
import CardData from '@/models/CardData';
import { removeElemIf } from '@/Utils/MainUtils';

interface IState {
	video?: HTMLVideoElement;
	netflixPlayer?: any;
	isFullScreen: boolean;
	cardEdited?: CardData;
	currentTime: number;
	previousTime: number;
	progressIndex: number;
	cardModule: ICardState;
	deckModule: IDeckState;
}

const MutationMain = {
	SET_VIDEO: 'SET_VIDEO',
	SET_VIDEO_CURRENT_TIME_S: 'SET_VIDEO_CURRENT_TIME_S',
	SET_IS_FULL_SCREEN: 'SET_IS_FULL_SCREEN',
	SET_CURRENT_TIME: 'SET_CURRENT_TIME',
	SET_PREVIOUS_TIME: 'SET_PREVIOUS_TIME',
	SET_PROGRESS_INDEX: 'SET_PROGRESS_INDEX',
	UPDATE_CARD_EDITED: 'UPDATE_CARD_EDITED',
};
const ActionMain = {
	HANDLE_VIDEO_PROGRESSION: 'HANDLE_VIDEO_PROGRESSION',
	TOGGLE_CARD_EDITED: 'TOGGLE_CARD_EDITED',
};
const store = createStore<IState>({
	state() {
		return {
			progressIndex: 0,
			cardEdited: undefined,
			currentTime: 0,
			previousTime: 0,
			isFullScreen: !!document.fullscreenElement,
			video: undefined,
			netflixPlayer: undefined,
			cardModule: initialStateCardModule,
			deckModule: initialStateDeckModule,
		};
	},
	modules: {
		deckModule,
		cardModule,
	},
	mutations: {
		[MutationMain.SET_VIDEO]: (state: IState, video: IState['video']) => {
			state.video = video;
			if (process.env.VUE_APP_MODE != 'DEV_SERVE') {
				const netflix = (window as any).netflix;
				const videoPlayer = netflix.appContext.state.playerApp.getAPI()
					.videoPlayer;
				state.netflixPlayer = videoPlayer.getVideoPlayerBySessionId(
					videoPlayer.getAllPlayerSessionIds()[0]
				);
			}
		},
		[MutationMain.SET_VIDEO_CURRENT_TIME_S]: (
			state: IState,
			timeInS: number
		) => {
			if (process.env.VUE_APP_MODE == 'DEV_SERVE' && state.video) {
				state.video.currentTime = timeInS;
			} else {
				state.netflixPlayer.seek(timeInS * 1000);
			}
		},
		[MutationMain.SET_IS_FULL_SCREEN]: (
			state: IState,
			isFullScreen: IState['isFullScreen']
		) => {
			state.isFullScreen = isFullScreen;
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
		[MutationMain.UPDATE_CARD_EDITED]: (
			state: IState,
			card: Partial<CardData>
		) => {
			if (state.cardEdited) {
				Object.assign(state.cardEdited, card);
			}
		},
	},
	actions: {
		[ActionMain.TOGGLE_CARD_EDITED]: (
			{ commit, state },
			cardEdited: IState['cardEdited']
		) => {
			const cards = state.cardModule.cards;
			if (state.cardEdited && !cardEdited /*editCardDone*/) {
				addCardToList(cards, state.cardEdited);
				commit(
					MutationMain.SET_VIDEO_CURRENT_TIME_S,
					state.cardEdited?.fromInSeconds() - 2
				);
				state.video?.play();
			} else if (cardEdited) {
				removeElemIf(cards, card => card.id == cardEdited.id);
				removeElemIf(
					state.cardModule.displayedCards,
					card => card.id == cardEdited.id
				);
				if (state.cardEdited) {
					addCardToList(cards, state.cardEdited);
				}
			}
			state.cardEdited = cardEdited;
		},
		[ActionMain.HANDLE_VIDEO_PROGRESSION]: (
			{ commit, state },
			currentTime: IState['currentTime']
		) => {
			commit(MutationMain.SET_PREVIOUS_TIME, state.currentTime);
			commit(MutationMain.SET_CURRENT_TIME, currentTime);
			const cardList = state.cardModule.cards;
			if (!cardList || cardList.length < 1) {
				return;
			}
			let progressIndex = state.progressIndex;
			let displayedCards = [] as Array<CardData>;
			if (Math.abs(state.currentTime - state.previousTime) > 1 /*sec*/) {
				progressIndex = 0;
				while (
					progressIndex < cardList.length &&
					cardList[progressIndex].fromInSeconds() < state.currentTime
				) {
					if (cardList[progressIndex].toInSeconds() > state.currentTime) {
						displayedCards.push(cardList[progressIndex]);
					}
					progressIndex++;
				}
			} else if (progressIndex <= cardList.length) {
				displayedCards = [...state.cardModule.displayedCards];
				removeExpiredCards(displayedCards, state.currentTime);
				while (progressIndex < cardList.length) {
					const nextCard = cardList[progressIndex];
					if (nextCard.fromInSeconds() > state.currentTime) {
						break;
					}
					let indexToInsert = 0;
					for (const cardAlreadyDisplayed of displayedCards) {
						if (nextCard.to < cardAlreadyDisplayed.to) {
							break;
						}
						indexToInsert++;
					}
					nextCard.isShown = state.cardModule.areCardCardDisplayed;
					displayedCards.splice(indexToInsert, 0, nextCard);
					progressIndex++;
				}
			} else {
				return;
			}
			if (state.cardEdited) {
				removeElemIf(displayedCards, card => card.id == state.cardEdited?.id);
			}
			commit(MutationCard.SET_DISPLAYED_CARDS, displayedCards);
			commit(MutationMain.SET_PROGRESS_INDEX, progressIndex);
		},
	},
});
export { IState, store, MutationMain, ActionMain };
