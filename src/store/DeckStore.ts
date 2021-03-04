import { DeckData } from '@/models/DeckData';
import { Module } from 'vuex';
import { IState } from './Store';

const MutationDeck = {
	SET_DECKS: 'SET_DECKS',
	SET_CURRENT_DECK: 'SET_CURRENT_DECK',
};
const ActionDeck = {};
interface IDeckState {
	currentDeck: DeckData | undefined;
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
			state.currentDeck = currentDeck;
		},
	},
	actions: {},
};
export { ActionDeck, MutationDeck, deckModule, IDeckState, initialState };
