import Vue from 'vue';
import Menu from '../components/Menu.vue';
import VideoOverlay from '../components/VideoOverlay.vue';

Vue.config.productionTip = false;

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';
Vue.use(VueMaterial);

import { compiledStore, MutationMain } from '@/store/Store';
import CardData from '@/models/CardData';
import { MutationCard } from '@/store/CardStore';

new Vue({
	render: h => h(Menu),
	store: compiledStore,
}).$mount('#plugin-meta-movie-menu');

new Vue({
	render: h => h(VideoOverlay),
	store: compiledStore,
}).$mount('#plugin-meta-movie-video-overlay');

document.addEventListener('fullscreenchange', event => {
	compiledStore.commit(
		MutationMain.SET_IS_FULL_SCREEN,
		!!document.fullscreenElement
	);
});

compiledStore.commit(MutationCard.SET_CARDS, [
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 0,
		y: 0,
		text: 'card 1',
	}),
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 0,
		y: 100,
		text: 'card 2',
	}),
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 100,
		y: 0,
		text: 'card 3',
	}),
	new CardData({
		fromStamp: '0:00:01',
		toStamp: '0:00:04',
		x: 100,
		y: 100,
		text: 'card 4',
	}),
	new CardData({
		fromStamp: '0:00:05',
		toStamp: '0:00:07',
		x: 50,
		y: 50,
		text: 'card 5',
	}),
	new CardData({
		fromStamp: '0:00:10',
		toStamp: '0:00:15',
		x: 0,
		y: 0,
		text: 'card 6',
	}),
	new CardData({
		fromStamp: '0:00:16',
		toStamp: '0:00:20',
		x: 50,
		y: 25,
		text: 'card 7',
	}),
	new CardData({
		fromStamp: '0:00:25',
		toStamp: '0:00:30',
		x: 100,
		y: 10,
		text: 'card 8',
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 0,
		y: 0,
		text: 'card 9',
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 0,
		y: 100,
		text: 'card 10',
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 100,
		y: 0,
		text: 'card 11',
	}),
	new CardData({
		fromStamp: '0:00:35',
		toStamp: '0:02:30',
		x: 100,
		y: 100,
		text: 'card 12',
	}),
]);
