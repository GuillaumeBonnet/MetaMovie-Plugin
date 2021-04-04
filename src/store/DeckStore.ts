import {
	CardApi,
	DeckApi,
	CreateFields,
	DeckApi_WithoutCards,
} from '@/models/ApiTypes';
import CardData from '@/models/CardData';
import { DeckData } from '@/models/DeckData';
import {
	fetchCompleteDeck,
	updateDeck,
	saveDeck,
	deleteDeck,
} from '@/Utils/WebService';
import { Module } from 'vuex';
import { MutationCard } from './CardStore';
import { IState } from './Store';

const MutationDeck = {
	SET_DECKS: 'SET_DECKS',
	SET_CURRENT_DECK: 'SET_CURRENT_DECK',
	CURRENT_DECK_MODIFIED: 'CURRENT_DECK_MODIFIED',
};
const ActionDeck = {
	REFRESH_CURRENT_DECK: 'REFRESH_CURRENT_DECK',
	SET_CURRENT_DECK_ACTION: 'SET_CURRENT_DECK_ACTION',
	SAVE_CURRENT_DECK: 'SAVE_CURRENT_DECK',
	DELETE_CURRENT_DECK: 'DELETE_CURRENT_DECK',
	CREATE_DECK: 'CREATE_DECK',
};
interface IDeckState {
	currentDeck: undefined | (DeckData & { hasLocalModifs: boolean });
	decks: DeckData[];
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
		[MutationDeck.SET_DECKS](state, decks: DeckData[]) {
			state.decks = decks;
		},
		[MutationDeck.SET_CURRENT_DECK](state, currentDeck: DeckData) {
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
		async [ActionDeck.SET_CURRENT_DECK_ACTION]({ commit }, deck?: DeckData) {
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
				createdAt: currentDeck.createdAt,
				id: currentDeck.id,
				languageTag: currentDeck.languageTag,
				name: currentDeck.name,
				updatedAt: currentDeck.updatedAt,
				cards: rootState.cardModule.cards,
			};
			const deckResponse = await updateDeck(deckToSave);
			const nextCurrentDeck: DeckData = deckResponse.data;
			commit(MutationDeck.SET_CURRENT_DECK, nextCurrentDeck);
			//TODO use update response cards
		},
		async [ActionDeck.CREATE_DECK](
			{ commit, state, rootState },
			deck: CreateFields<DeckApi_WithoutCards>
		) {
			const deckFromApi = await saveDeck({
				...deck,
				cards: [],
			});
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
};
export { ActionDeck, MutationDeck, deckModule, IDeckState, initialState };
