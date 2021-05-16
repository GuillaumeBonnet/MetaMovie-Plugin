import { createApp } from 'vue';

import Menu from '../components/Menu.vue';
import VideoOverlay from '../components/VideoOverlay.vue';

import { store, MutationMain } from '@/store/Store';
import CardData from '@/models/CardData';
import { MutationCard } from '@/store/CardStore';
console.log('gboDebug: content overlay');
import '@/assets/styles/styles.css';
import { MutationDeck } from '@/store/DeckStore';
const appMenu = createApp(Menu);
appMenu.use(store);
appMenu.mount('#plugin-meta-movie-menu');

const appOverlay = createApp(VideoOverlay);
appOverlay.use(store);
appOverlay.mount('#plugin-meta-movie-video-overlay');

document.addEventListener('fullscreenchange', event => {
	store.commit(MutationMain.SET_IS_FULL_SCREEN, !!document.fullscreenElement);
});
