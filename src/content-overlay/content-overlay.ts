import { createApp } from 'vue';

import Menu from '../components/Menu.vue';
import VideoOverlay from '../components/VideoOverlay.vue';

import { store, MutationMain } from '@/store/Store';
import CardData from '@/models/CardData';
import { MutationCard } from '@/store/CardStore';
console.log('gboDebug: content overlay');
import '@/assets/styles/styles.css';
import { MutationDeck } from '@/store/DeckStore';
import { DeckData } from '@/models/DeckData';
const appMenu = createApp(Menu);
appMenu.use(store);
appMenu.mount('#plugin-meta-movie-menu');

const appOverlay = createApp(VideoOverlay);
appOverlay.use(store);
appOverlay.mount('#plugin-meta-movie-video-overlay');

document.addEventListener('fullscreenchange', event => {
	store.commit(MutationMain.SET_IS_FULL_SCREEN, !!document.fullscreenElement);
});
const mockedDecks: DeckData[] = [
	{
		id: 2,
		name: 'deck2',
		languageTag: 'FR',
		createdAt: new Date(Date.now()),
		updatedAt: new Date(Date.now()),
	},
	{
		id: 1,
		name: 'deck1',
		languageTag: null,
		createdAt: new Date(Date.now()),
		updatedAt: new Date(Date.now()),
	},
	{
		id: 3,
		name: 'deck3',
		languageTag: null,
		createdAt: new Date(Date.now()),
		updatedAt: new Date(Date.now()),
	},
];
store.commit(MutationDeck.SET_DECKS, mockedDecks);
console.log('gboDebug: deecks', store.state.deckModule.decks);
store.commit(MutationCard.SET_CARDS, [
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 0,
		y: 0,
		text: 'card 1',
		id: 1,
	}),
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 0,
		y: 100,
		text: 'card 2',
		id: 2,
	}),
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 100,
		y: 0,
		text: 'card 3',
		id: 3,
	}),
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 100,
		y: 100,
		text: 'card 4',
		id: 4,
	}),
	new CardData({
		fromStamp: '0:00:05',
		toStamp: '0:00:07',
		x: 50,
		y: 50,
		text: 'card 5',
		id: 5,
	}),
	new CardData({
		fromStamp: '0:00:10',
		toStamp: '0:00:15',
		x: 0,
		y: 0,
		text: 'card 6',
		id: 6,
	}),
	new CardData({
		fromStamp: '0:00:16',
		toStamp: '0:00:20',
		x: 50,
		y: 25,
		text: 'card 7',
		id: 7,
	}),
	new CardData({
		fromStamp: '0:00:25',
		toStamp: '0:00:30',
		x: 100,
		y: 10,
		text: 'card 8',
		id: 8,
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 0,
		y: 0,
		text: 'card 9',
		id: 9,
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 0,
		y: 100,
		text: 'card 10',
		id: 10,
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 100,
		y: 0,
		text: 'card 11',
		id: 11,
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 100,
		y: 100,
		text: 'card 12',
		id: 12,
	}),
]);
