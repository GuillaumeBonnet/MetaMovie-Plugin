import { addCardToList, updateACard } from '@/Utils/CardUtils';
import CardData from '@/models/CardData';
import { Module } from 'vuex';
import { IState } from '@/store/Store';
import { removeElemIf } from '@/Utils/MainUtils';

const MutationCard = {
	TOGGLE_ARE_CARD_DISPLAYED: 'TOGGLE_ARE_CARD_DISPLAYED',
	SET_DISPLAYED_CARDS: 'SET_DISPLAYED_CARDS',
	SET_CARDS: 'SET_CARDS',
	UPDATE_CARD: 'UPDATE_CARD',
	UPDATE_DISPLAYED_CARD: 'UPDATE_DISPLAYED_CARD',
	ADD_CARD: 'ADD_CARD',
	DELETE_CARD: 'DELETE_CARD',
};
const ActionCard = {
	TOGGLE_CARD_VISIBILITY: 'TOGGLE_CARD_VISIBILITY',
};
interface ICardState {
	areCardCardDisplayed: boolean;
	cards: CardData[];
	displayedCards: CardData[];
}

const initialState: ICardState = {
	areCardCardDisplayed: true,
	cards: [],
	displayedCards: [],
};

const cardModule: Module<ICardState, IState> = {
	state() {
		return initialState;
	},
	mutations: {
		[MutationCard.TOGGLE_ARE_CARD_DISPLAYED](state: ICardState) {
			state.areCardCardDisplayed = !state.areCardCardDisplayed;
		},
		[MutationCard.SET_CARDS](state: ICardState, cards: CardData[]) {
			state.cards = cards;
		},
		[MutationCard.UPDATE_CARD](state: ICardState, card: CardData) {
			updateACard(state.cards, card);
		},
		[MutationCard.UPDATE_DISPLAYED_CARD](
			state: ICardState,
			card: Partial<CardData>
		) {
			updateACard(state.displayedCards, card);
		},
		[MutationCard.ADD_CARD](state: ICardState, card: CardData) {
			addCardToList(state.cards, card);
		},
		[MutationCard.SET_DISPLAYED_CARDS](state: ICardState, cards: CardData[]) {
			state.displayedCards = cards;
		},
		[MutationCard.DELETE_CARD](state: ICardState, card: CardData) {
			removeElemIf(state.displayedCards, cardElem => (cardElem.id = card.id));
			removeElemIf(state.cards, cardElem => (cardElem.id = card.id));
		},
	},
	actions: {
		[ActionCard.TOGGLE_CARD_VISIBILITY]({ commit, state }) {
			commit(MutationCard.TOGGLE_ARE_CARD_DISPLAYED);
			commit(
				MutationCard.SET_DISPLAYED_CARDS,
				state.displayedCards.map(card => {
					card.isShown = state.areCardCardDisplayed;
					return card;
				})
			);
		},
	},
};
export { ActionCard, MutationCard, cardModule, ICardState, initialState };
