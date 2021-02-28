import { removeExpiredCards, updateACard } from '@/Utils/CardUtils';
import CardData from '../models/CardData';
import { Module } from 'vuex';
import { IState } from './Store';

const MutationCard = {
	TOGGLE_ARE_CARD_DISPLAYED: 'TOGGLE_ARE_CARD_DISPLAYED',
	SET_DISPLAYED_CARDS: 'SET_DISPLAYED_CARDS',
	SET_CARDS: 'SET_CARDS',
	UPDATE_CARD: 'UPDATE_CARD',
	UPDATE_DISPLAYED_CARD: 'UPDATE_DISPLAYED_CARD',
};
const ActionCard = {
	TOGGLE_CARD_VISIBILITY: 'TOGGLE_CARD_VISIBILITY',
};
interface ICardState {
	areCardCardDisplayed: boolean;
	cards: CardData[];
	displayedCards: CardData[];
}

const cardModule: Module<ICardState, IState> = {
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
			console.log('gboDebug: MutationCard.UPDATE_DISPLAYED_CARD');
			updateACard(state.displayedCards, card);
		},
		[MutationCard.SET_DISPLAYED_CARDS](state: ICardState, cards: CardData[]) {
			state.displayedCards = cards;
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
export { ActionCard, MutationCard, cardModule, ICardState };
