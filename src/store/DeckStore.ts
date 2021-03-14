import CardData from '@/models/CardData';
import { DeckData } from '@/models/DeckData';
import { fetchCompleteDeck } from '@/Utils/WebService';
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
			state.currentDeck = {
				...currentDeck,
				hasLocalModifs: false,
			};
		},
		[MutationDeck.CURRENT_DECK_MODIFIED](state) {
			if (state.currentDeck) {
				state.currentDeck.hasLocalModifs = true;
			}
		},
	},
	actions: {
		async [ActionDeck.REFRESH_CURRENT_DECK]({ commit, state, rootState }) {
			if (state.currentDeck) {
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
			}
		},
		async [ActionDeck.SET_CURRENT_DECK_ACTION]({ commit }, deck: DeckData) {
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
		},
	},
};
export { ActionDeck, MutationDeck, deckModule, IDeckState, initialState };
