import { CreateFields, DeckApi, DeckApi_WithoutCards } from '@/models/ApiTypes';
import { DeckData } from '@/models/DeckData';
import axios from 'axios';

const rootUrl = process.env.VUE_APP_API_URL;
const fetchCompleteDeck = (deck: DeckData) => {
	return axios.get<DeckApi>(`${rootUrl}/decks/${deck.id}`);
};

const fetchAllDecks = () => {
	return axios.get<DeckApi_WithoutCards[]>(`${rootUrl}/decks`);
};

const saveDeck = async (deck: CreateFields<DeckApi>) => {
	return axios.post<DeckApi>(`${rootUrl}/decks`, deck);
};
const updateDeck = (deck: DeckData) => {
	return axios.put<DeckApi>(`${rootUrl}/decks/${deck.id}`, deck);
};
export { fetchCompleteDeck, fetchAllDecks, saveDeck, updateDeck };
