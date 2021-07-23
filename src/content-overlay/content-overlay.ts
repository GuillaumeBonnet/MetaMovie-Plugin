import { createApp } from 'vue';

import Menu from '../components/Menu/Menu.vue';
import VideoOverlay from '../components/VideoOverlay.vue';

import { store, MutationMain } from '@/store/Store';
import CardData from '@/models/CardData';
import { MutationCard } from '@/store/CardStore';
console.log('gboDebug: content overlay');
import '@/assets/styles/styles.css';
import { MutationDeck } from '@/store/DeckStore';
/* eslint-disable */
// @ts-ignore
import VueMaterialAdapter from 'vue-material-adapter';

const appMenu = createApp(Menu);
appMenu.use(store);
appMenu.use(VueMaterialAdapter);
appMenu.mount('#plugin-meta-movie-menu');
appMenu.config.globalProperties.window = window;

const appOverlay = createApp(VideoOverlay);
appOverlay.use(store);
appOverlay.mount('#plugin-meta-movie-video-overlay');

if (/watch\/(\d+)/.test(location.pathname)) {
	const netflixMovieId = Number.parseInt(
		/watch\/(\d+)/.exec(location.pathname)?.[1] || ''
	);
	store.commit(MutationMain.SET_MOVIE_ID, netflixMovieId);
	const movieTitle = document
		.querySelector('.video-title')
		?.textContent?.trim();
	store.commit(MutationMain.SET_MOVIE_TITLE, movieTitle);
}
document.addEventListener('fullscreenchange', event => {
	store.commit(MutationMain.SET_IS_FULL_SCREEN, !!document.fullscreenElement);
});
