import Vue from 'vue';
import Menu from '../components/Menu.vue';
import VideoOverlay from '../components/VideoOverlay.vue';

Vue.config.productionTip = false;

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';
Vue.use(VueMaterial);

import { compiledStore, MutationMain } from '@/store/Store';
import BubbleData from '@/models/BubbleData';
import { MutationBubble } from '@/store/BubbleStore';

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

compiledStore.commit(MutationBubble.SET_BUBBLES, [
	new BubbleData({
		fromStamp: '1',
		toStamp: '4',
		x: 0,
		y: 0,
	}),
	new BubbleData({
		fromStamp: '1',
		toStamp: '4',
		x: 0,
		y: 100,
	}),
	new BubbleData({
		fromStamp: '1',
		toStamp: '4',
		x: 100,
		y: 0,
	}),
	new BubbleData({
		fromStamp: '1',
		toStamp: '4',
		x: 100,
		y: 100,
	}),
	new BubbleData({
		fromStamp: '5',
		toStamp: '7',
		x: 50,
		y: 50,
	}),
	new BubbleData({
		fromStamp: '10',
		toStamp: '15',
		x: 0,
		y: 0,
	}),
	new BubbleData({
		fromStamp: '16',
		toStamp: '20',
		x: 50,
		y: 25,
	}),
	new BubbleData({
		fromStamp: '25',
		toStamp: '30',
		x: 100,
		y: 10,
	}),
	new BubbleData({
		fromStamp: '35',
		toStamp: '150',
		x: 0,
		y: 0,
	}),
	new BubbleData({
		fromStamp: '35',
		toStamp: '150',
		x: 0,
		y: 100,
	}),
	new BubbleData({
		fromStamp: '35',
		toStamp: '150',
		x: 100,
		y: 0,
	}),
	new BubbleData({
		fromStamp: '35',
		toStamp: '150',
		x: 100,
		y: 100,
	}),
]);
