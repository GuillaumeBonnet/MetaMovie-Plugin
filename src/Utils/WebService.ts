import {
	CreateFields,
	DeckApi,
	DeckApi_WithoutCards,
	UserInfo,
} from '@/models/ApiTypes';
import { DeckData } from '@/models/DeckData';
import axios, { AxiosRequestConfig } from 'axios';

const rootUrl = process.env.VUE_APP_API_URL;
const axiosConfig: AxiosRequestConfig = {
	withCredentials: true,
};
const fetchCompleteDeck = (deck: DeckData) => {
	return axios.get<DeckApi>(`${rootUrl}/decks/${deck.id}`, axiosConfig);
};

const fetchAllDecks = () => {
	return axios.get<DeckApi_WithoutCards[]>(`${rootUrl}/decks`, axiosConfig);
};

const saveDeck = async (deck: CreateFields<DeckApi>) => {
	return axios.post<DeckApi>(`${rootUrl}/decks`, deck, axiosConfig);
};
const updateDeck = (deck: DeckData) => {
	return axios.put<DeckApi>(`${rootUrl}/decks/${deck.id}`, deck, axiosConfig);
};
const deleteDeck = (deckId: number) => {
	return axios.delete<any>(`${rootUrl}/decks/${deckId}`, axiosConfig);
};
const logout = () => {
	return axios.get(`${rootUrl}/users/logout`, axiosConfig);
};
const login = (credentials: { email: string; password: string }) => {
	return axios.post<UserInfo>(
		`${rootUrl}/users/login`,
		{
			...credentials,
		},
		axiosConfig
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
		axiosConfig
	);
};
const userInfo = () => {
	return axios.get<UserInfo>(`${rootUrl}/users/info`, axiosConfig);
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
