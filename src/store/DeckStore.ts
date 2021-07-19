import { DeckApi, CreateFields, DeckApi_WithoutCards } from '@/models/ApiTypes';
import CardData from '@/models/CardData';
import {
	fetchCompleteDeck,
	updateDeck,
	saveDeck,
	deleteDeck,
	fetchAllDecks,
} from '@/Utils/WebService';
import { Module } from 'vuex';
import { MutationCard } from './CardStore';
import { GetterMain, IState } from './Store';

const MutationDeck = {
	SET_DECKS: 'SET_DECKS',
	SET_DECKS_ORIGIN: 'SET_DECKS_ORIGIN',
	SET_CURRENT_DECK: 'SET_CURRENT_DECK',
	CURRENT_DECK_MODIFIED: 'CURRENT_DECK_MODIFIED',
};
const ActionDeck = {
	FETCH_DECKS_CURRENT_MOVIE: 'FETCH_DECKS_CURRENT_MOVIE',
	FETCH_DECKS_CURRENT_USER: 'FETCH_DECKS_CURRENT_USER',
	REFRESH_CURRENT_DECK: 'REFRESH_CURRENT_DECK',
	SET_CURRENT_DECK_ACTION: 'SET_CURRENT_DECK_ACTION',
	SAVE_CURRENT_DECK: 'SAVE_CURRENT_DECK',
	DELETE_CURRENT_DECK: 'DELETE_CURRENT_DECK',
	CREATE_DECK: 'CREATE_DECK',
};
const GetterDeck = {
	CAN_EDIT_CURRENT_DECK: 'CAN_EDIT_CURRENT_DECK',
	CAN_DELETE_CURRENT_DECK: 'CAN_DELETE_CURRENT_DECK',
};
interface IDeckState {
	currentDeck: undefined | (DeckApi_WithoutCards & { hasLocalModifs: boolean });
	decks: DeckApi_WithoutCards[];
	originDecks?: 'CURRENT_MOVIE' | 'CURRENT_USER';
}

const initialState: IDeckState = {
	currentDeck: undefined,
	decks: [],
};

const deckModule: Module<IDeckState, IState> = {
	state() {
		return initialState;
	},
	mutations: {
		[MutationDeck.SET_DECKS](state, decks: DeckApi_WithoutCards[]) {
			state.decks = decks;
		},
		[MutationDeck.SET_DECKS_ORIGIN](
			state,
			originDecks: IDeckState['originDecks']
		) {
			state.originDecks = originDecks;
		},
		[MutationDeck.SET_CURRENT_DECK](state, currentDeck: DeckApi_WithoutCards) {
			if (currentDeck) {
				state.currentDeck = {
					...currentDeck,
					hasLocalModifs: false,
				};
			} else {
				state.currentDeck = undefined;
			}
		},
		[MutationDeck.CURRENT_DECK_MODIFIED](state) {
			if (state.currentDeck) {
				state.currentDeck.hasLocalModifs = true;
			}
		},
	},
	actions: {
		async [ActionDeck.FETCH_DECKS_CURRENT_MOVIE]({ commit, state, rootState }) {
			const decks = (await fetchAllDecks({ movieId: rootState.movieId })).data;
			commit(MutationDeck.SET_DECKS, decks);

			const deckOrigin: IDeckState['originDecks'] = 'CURRENT_MOVIE';
			commit(MutationDeck.SET_DECKS_ORIGIN, deckOrigin);
		},
		async [ActionDeck.FETCH_DECKS_CURRENT_USER]({ commit, state, rootState }) {
			if (!rootState.user.isLogged) {
				throw new Error("Not Logged, can't fetch decks for current User.");
			}
			const decks = (
				await fetchAllDecks({ userId: rootState.user.info?.['id'] as number })
			).data;
			commit(MutationDeck.SET_DECKS, decks);

			const deckOrigin: IDeckState['originDecks'] = 'CURRENT_USER';
			commit(MutationDeck.SET_DECKS_ORIGIN, deckOrigin);
		},
		async [ActionDeck.REFRESH_CURRENT_DECK]({ commit, state, rootState }) {
			if (!state.currentDeck) {
				return;
			}
			const deck = (await fetchCompleteDeck(state.currentDeck)).data;
			const index = state.decks.findIndex(deckElem => deckElem.id == deck.id);
			state.decks.splice(index, 1, deck);
			state.currentDeck = {
				...deck,
				hasLocalModifs: false,
			};
			rootState.cardModule.cards = deck.cards.map(card => {
				return new CardData({
					fromStamp: card.from,
					text: card.text,
					toStamp: card.to,
					x: card.position.x,
					y: card.position.y,
				});
			});
			rootState.cardModule.displayedCards = [];
		},
		async [ActionDeck.SET_CURRENT_DECK_ACTION](
			{ commit },
			deck?: DeckApi_WithoutCards
		) {
			if (!deck) {
				commit(MutationDeck.SET_CURRENT_DECK, null);
				commit(MutationCard.SET_CARDS, []);
				commit(MutationCard.SET_DISPLAYED_CARDS, []);
			} else {
				commit(MutationDeck.SET_CURRENT_DECK, deck);
				const cards = (await fetchCompleteDeck(deck)).data.cards.map(card => {
					return new CardData({
						fromStamp: card.from,
						toStamp: card.to,
						x: card.position.x,
						y: card.position.y,
						text: card.text,
						id: card.id,
					});
				});
				commit(MutationCard.SET_CARDS, cards);
				commit(MutationCard.SET_DISPLAYED_CARDS, []);
			}
		},
		async [ActionDeck.SAVE_CURRENT_DECK]({ commit, state, rootState }) {
			if (!state.currentDeck) {
				return;
			}
			const currentDeck = state.currentDeck;
			const deckToSave: DeckApi = {
				id: currentDeck.id,
				createdAt: currentDeck.createdAt,
				updatedAt: currentDeck.updatedAt,
				languageTag: currentDeck.languageTag,
				name: currentDeck.name,
				cards: rootState.cardModule.cards,
				permissions: [],
				numberOfCards: rootState.cardModule.cards.length,
				ownerName: '',
				movie: currentDeck.movie,
			};
			const deckResponse = await updateDeck(deckToSave);
			const nextCurrentDeck = deckResponse.data;
			nextCurrentDeck.numberOfCards = nextCurrentDeck.cards?.length ?? 0;
			commit(MutationDeck.SET_CURRENT_DECK, nextCurrentDeck);
			const decksCpy = [...state.decks];
			const nextCurrentDeckInDeckList = decksCpy.find(
				deck => deck.id == nextCurrentDeck.id
			);
			if (nextCurrentDeckInDeckList) {
				nextCurrentDeckInDeckList.numberOfCards = nextCurrentDeck.numberOfCards;
			}
			commit(MutationDeck.SET_DECKS, decksCpy);
		},
		async [ActionDeck.CREATE_DECK](
			{ commit, state, rootState, getters },
			deck: CreateFields<DeckApi_WithoutCards>
		) {
			if (!rootState.movieId) {
				throw Error('Movied Id not found on current Page.');
			}
			if (!rootState.movieTitle) {
				throw Error('Movied Title not found on current Page.');
			}
			const deckFromApi = await saveDeck({
				...deck,
				cards: [],
				movie: {
					id: rootState.movieId,
					title: rootState.movieTitle,
				},
			});
			console.log('gboDebug:[ crate deck deckFromApi]', deckFromApi);
			deckFromApi.data.numberOfCards = deckFromApi.data.cards?.length ?? 0;
			const newDeckList = [deckFromApi.data, ...state.decks];
			commit(MutationDeck.SET_DECKS, newDeckList);
			return deckFromApi.data;
		},
		async [ActionDeck.DELETE_CURRENT_DECK]({
			commit,
			state,
			rootState,
			dispatch,
		}) {
			if (state.currentDeck) {
				await deleteDeck(state.currentDeck.id);
				const index = state.decks.findIndex(
					deck => deck.id == state.currentDeck?.id
				);

				commit(
					MutationDeck.SET_DECKS,
					state.decks.filter(deck => deck.id != state.currentDeck?.id)
				);
				dispatch(ActionDeck.SET_CURRENT_DECK_ACTION, null);
			}
		},
	},
	getters: {
		[GetterDeck.CAN_EDIT_CURRENT_DECK]({ currentDeck }) {
			return currentDeck?.permissions.includes('EDIT');
		},
		[GetterDeck.CAN_DELETE_CURRENT_DECK]({ currentDeck }) {
			return currentDeck?.permissions.includes('DELETE');
		},
	},
};
export {
	ActionDeck,
	MutationDeck,
	GetterDeck,
	deckModule,
	IDeckState,
	initialState,
};
