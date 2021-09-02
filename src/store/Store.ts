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
import { login, userInfo } from '@/Utils/WebService';
import { UserInfo } from '@/models/ApiTypes';

type UserState = { isLogged: boolean; info?: UserInfo };
interface IState {
	aboutVideo: {
		video?: HTMLVideoElement;
		netflixPlayer?: any;
		currentTime: number;
		previousTime: number;
		playOrPause: 'PAUSE' | 'PLAY';
		isFullScreen: boolean;
	};
	movieId?: number;
	movieTitle?: string;
	cardEdited?: CardData;
	progressIndex: number;
	cardModule: ICardState;
	deckModule: IDeckState;
	user: UserState;
}

const MutationMain = {
	SET_MOVIE_ID: 'SET_MOVIE_ID',
	SET_MOVIE_TITLE: 'SET_MOVIE_TITLE',
	SET_VIDEO: 'SET_VIDEO',
	SET_VIDEO_CURRENT_TIME_S: 'SET_VIDEO_CURRENT_TIME_S',
	SET_VIDEO_PLAY_PAUSE: 'SET_VIDEO_PLAY_PAUSE',
	SET_IS_FULL_SCREEN: 'SET_IS_FULL_SCREEN',
	SET_CURRENT_TIME: 'SET_CURRENT_TIME',
	SET_PREVIOUS_TIME: 'SET_PREVIOUS_TIME',
	SET_PROGRESS_INDEX: 'SET_PROGRESS_INDEX',
	UPDATE_CARD_EDITED: 'UPDATE_CARD_EDITED',
	SET_USER: 'SET_USER',
};
const ActionMain = {
	HANDLE_VIDEO_PAUSE_PLAY: 'HANDLE_VIDEO_PAUSE_PLAY',
	PAUSE_PLAY_VIDEO: 'PAUSE_PLAY_VIDEO',
	HANDLE_VIDEO_PROGRESSION: 'HANDLE_VIDEO_PROGRESSION',
	TOGGLE_CARD_EDITED: 'TOGGLE_CARD_EDITED',
	FETCH_USER: 'FETCH_USER',
	LOG_IN: 'LOG_IN',
};
const GetterMain = {
	IS_LOGGED: 'IS_LOGGED',
	CAN_CREATE_DECKS: 'CAN_CREATE_DECKS',
	IS_MOVIE_PAGE: 'IS_MOVIE_PAGE',
};
const store = createStore<IState>({
	state() {
		return {
			progressIndex: 0,
			cardEdited: undefined,
			aboutVideo: {
				video: undefined,
				netflixPlayer: undefined,
				currentTime: 0,
				previousTime: 0,
				isFullScreen: !!document.fullscreenElement,
				playOrPause: 'PAUSE',
			},
			cardModule: initialStateCardModule,
			deckModule: initialStateDeckModule,
			user: {
				isLogged: false,
			},
		};
	},
	modules: {
		deckModule,
		cardModule,
	},
	mutations: {
		[MutationMain.SET_MOVIE_ID]: (
			state: IState,
			movieId: IState['movieId']
		) => {
			state.movieId = movieId;
		},
		[MutationMain.SET_MOVIE_TITLE]: (
			state: IState,
			movieTitle: IState['movieTitle']
		) => {
			state.movieTitle = movieTitle;
		},
		[MutationMain.SET_VIDEO]: (
			state: IState,
			video: IState['aboutVideo']['video']
		) => {
			state.aboutVideo.video = video;
			if (process.env.VUE_APP_MODE != 'DEV_SERVE') {
				const netflix = (window as any).netflix;
				const videoPlayer = netflix.appContext.state.playerApp.getAPI()
					.videoPlayer;
				state.aboutVideo.netflixPlayer = videoPlayer.getVideoPlayerBySessionId(
					videoPlayer.getAllPlayerSessionIds()[0]
				);
			}
		},
		[MutationMain.SET_VIDEO_CURRENT_TIME_S]: (
			state: IState,
			timeInS: number
		) => {
			if (process.env.VUE_APP_MODE == 'DEV_SERVE' && state.aboutVideo.video) {
				state.aboutVideo.video.currentTime = timeInS;
			} else {
				state.aboutVideo.netflixPlayer.seek(timeInS * 1000);
			}
		},
		[MutationMain.SET_VIDEO_PLAY_PAUSE]: (
			state: IState,
			playOrPause: IState['aboutVideo']['playOrPause']
		) => {
			state.aboutVideo.playOrPause = playOrPause;
		},
		[MutationMain.SET_IS_FULL_SCREEN]: (
			state: IState,
			isFullScreen: IState['aboutVideo']['isFullScreen']
		) => {
			state.aboutVideo.isFullScreen = isFullScreen;
		},
		[MutationMain.SET_CURRENT_TIME]: (
			state: IState,
			currentTime: IState['aboutVideo']['currentTime']
		) => {
			state.aboutVideo.currentTime = currentTime;
		},
		[MutationMain.SET_PREVIOUS_TIME]: (
			state: IState,
			previousTime: IState['aboutVideo']['previousTime']
		) => {
			state.aboutVideo.previousTime = previousTime;
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
		[MutationMain.SET_USER]: (state: IState, user: UserState) => {
			state.user = user;
		},
	},
	actions: {
		[ActionMain.PAUSE_PLAY_VIDEO]: async (
			{ commit, state },
			playOrPause: IState['aboutVideo']['playOrPause']
		) => {
			let videoOrPlayer;
			if (process.env.VUE_APP_MODE == 'DEV_SERVE' && state.aboutVideo.video) {
				videoOrPlayer = state.aboutVideo.video;
			} else {
				videoOrPlayer = state.aboutVideo.netflixPlayer;
			}
			if (!videoOrPlayer) {
				throw Error('No video or player found.');
			}
			if (playOrPause == 'PAUSE') {
				videoOrPlayer.pause();
			} else if (playOrPause == 'PLAY') {
				videoOrPlayer.play();
			}
			// state will be changed with pause play event handler
		},
		[ActionMain.FETCH_USER]: async ({ commit, state }) => {
			const userState: UserState = {
				isLogged: false,
			};
			try {
				const user = (await userInfo()).data;
				userState.isLogged = true;
				userState.info = user;
				commit(MutationMain.SET_USER, userState);
			} catch (err) {
				console.error('Error when fetching userInfo', err);
				commit(MutationMain.SET_USER, userState);
			}
		},
		[ActionMain.LOG_IN]: async (
			{ commit, state },
			credentials: Parameters<typeof login>[0]
		) => {
			const userState: UserState = {
				isLogged: false,
			};
			try {
				const user = (await login(credentials)).data;
				userState.isLogged = true;
				userState.info = user;
				commit(MutationMain.SET_USER, userState);
			} catch (err) {
				console.error('Error when fetching userInfo', err);
				commit(MutationMain.SET_USER, userState);
			}
		},
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
				state.aboutVideo.video?.play();
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
			currentTime: IState['aboutVideo']['currentTime']
		) => {
			commit(MutationMain.SET_PREVIOUS_TIME, state.aboutVideo.currentTime);
			commit(MutationMain.SET_CURRENT_TIME, currentTime);
			const cardList = state.cardModule.cards;
			if (!cardList || cardList.length < 1) {
				return;
			}
			let progressIndex = state.progressIndex;
			let displayedCards = [] as Array<CardData>;
			if (
				Math.abs(state.aboutVideo.currentTime - state.aboutVideo.previousTime) >
				1 /*sec*/
			) {
				progressIndex = 0;
				while (
					progressIndex < cardList.length &&
					cardList[progressIndex].fromInSeconds() < state.aboutVideo.currentTime
				) {
					if (
						cardList[progressIndex].toInSeconds() > state.aboutVideo.currentTime
					) {
						displayedCards.push(cardList[progressIndex]);
					}
					progressIndex++;
				}
			} else if (progressIndex <= cardList.length) {
				displayedCards = [...state.cardModule.displayedCards];
				removeExpiredCards(displayedCards, state.aboutVideo.currentTime);
				while (progressIndex < cardList.length) {
					const nextCard = cardList[progressIndex];
					if (nextCard.fromInSeconds() > state.aboutVideo.currentTime) {
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
	getters: {
		[GetterMain.IS_LOGGED](state) {
			return state.user.isLogged;
		},
		[GetterMain.CAN_CREATE_DECKS](state, getters) {
			return state.user.info?.permissions.includes('CREATE_DECKS');
		},
		[GetterMain.IS_MOVIE_PAGE](state, getters) {
			return state.movieId && state.movieTitle;
		},
	},
});
export { IState, store, MutationMain, ActionMain, GetterMain, UserState };
