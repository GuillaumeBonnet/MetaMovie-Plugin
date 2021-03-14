import { DeckApi, DeckApi_WithoutCards } from '@/models/ApiTypes';
import { DeckData } from '@/models/DeckData';
import axios from 'axios';

const rootUrl = process.env.VUE_APP_API_URL;
const fetchCompleteDeck = (deck: DeckData) => {
	return axios.get<DeckApi>(`${rootUrl}/decks/${deck.id}`);
};

const fetchAllDecks = () => {
	return axios.get<DeckApi_WithoutCards[]>(`${rootUrl}/decks`);
};

export { fetchCompleteDeck, fetchAllDecks };
