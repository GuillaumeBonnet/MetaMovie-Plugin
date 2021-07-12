import {
	CreateFields,
	DeckApi,
	DeckApi_WithoutCards,
	UserInfo,
} from '@/models/ApiTypes';
import axios from 'axios';
axios.interceptors.request.use(config => {
	config.withCredentials = true;
	return config;
});
const rootUrl = process.env.VUE_APP_API_URL;
const fetchCompleteDeck = (deck: Pick<DeckApi_WithoutCards, 'id'>) => {
	return axios.get<DeckApi>(`${rootUrl}/decks/${deck.id}`);
};

const fetchAllDecks = (params?: { movieId?: number }) => {
	if (params?.movieId) {
		return axios.get<DeckApi_WithoutCards[]>(
			`${rootUrl}/decks?movieId=${params.movieId}`
		);
	} else {
		return axios.get<DeckApi_WithoutCards[]>(`${rootUrl}/decks`);
	}
};

const saveDeck = async (deck: CreateFields<DeckApi>) => {
	return axios.post<DeckApi>(`${rootUrl}/decks`, deck);
};
const updateDeck = (deck: DeckApi) => {
	return axios.put<DeckApi>(`${rootUrl}/decks/${deck.id}`, deck);
};
const deleteDeck = (deckId: number) => {
	return axios.delete<any>(`${rootUrl}/decks/${deckId}`);
};
const logout = () => {
	return axios.get(`${rootUrl}/users/logout`);
};
const login = (credentials: { email: string; password: string }) => {
	return axios.post<UserInfo>(`${rootUrl}/users/login`, {
		...credentials,
	});
};
const signUp = (credentials: {
	email: string;
	username: string;
	password: string;
}) => {
	return axios.post<UserInfo>(`${rootUrl}/users/signup`, {
		...credentials,
	});
};
const userInfo = () => {
	return axios.get<UserInfo>(`${rootUrl}/users/info`);
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
