import { DeckData } from '@/models/DeckData';
import { Module } from 'vuex';
import { IState } from './Store';

const MutationDeck = {
	SET_DECKS: 'SET_DECKS',
	SET_CURRENT_DECK: 'SET_CURRENT_DECK',
	CURRENT_DECK_MODIFIED: 'CURRENT_DECK_MODIFIED',
};
const ActionDeck = {
	REFRESH_CURRENT_DECK: 'REFRESH_CURRENT_DECK',
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
		[ActionDeck.REFRESH_CURRENT_DECK]({ commit, state }) {},
	},
};
export { ActionDeck, MutationDeck, deckModule, IDeckState, initialState };
