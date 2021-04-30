import {
	CreateFields,
	DeckApi,
	DeckApi_WithoutCards,
	UserInfo,
} from '@/models/ApiTypes';
import { DeckData } from '@/models/DeckData';
import axios from 'axios';

const rootUrl = process.env.VUE_APP_API_URL;
const fetchCompleteDeck = (deck: DeckData) => {
	return axios.get<DeckApi>(`${rootUrl}/decks/${deck.id}`);
};

const fetchAllDecks = () => {
	return axios.get<DeckApi_WithoutCards[]>(`${rootUrl}/decks`, {
		withCredentials: true,
	});
};

const saveDeck = async (deck: CreateFields<DeckApi>) => {
	return axios.post<DeckApi>(`${rootUrl}/decks`, deck);
};
const updateDeck = (deck: DeckData) => {
	return axios.put<DeckApi>(`${rootUrl}/decks/${deck.id}`, deck);
};
const deleteDeck = (deckId: number) => {
	return axios.delete<any>(`${rootUrl}/decks/${deckId}`);
};
const logout = () => {
	return axios.get(`${rootUrl}/users/logout`, { withCredentials: true });
};
const login = (credentials: { email: string; password: string }) => {
	return axios.post<UserInfo>(
		`${rootUrl}/users/login`,
		{
			...credentials,
		},
		{ withCredentials: true }
	);
};
const signUp = (credentials: {
	email: string;
	username: string;
	password: string;
}) => {
	return axios.post<UserInfo>(
		`${rootUrl}/users/signup`,
		{
			...credentials,
		},
		{ withCredentials: true }
	);
};
const userInfo = () => {
	return axios.get<UserInfo>(`${rootUrl}/users/info`, {
		withCredentials: true,
	});
};
export {
	fetchCompleteDeck,
	fetchAllDecks,
	saveDeck,
	updateDeck,
	deleteDeck,
	login,
	userInfo,
	logout,
	signUp,
};
