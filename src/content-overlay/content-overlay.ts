import Vue from 'vue';
import Menu from '../components/Menu.vue';
import VideoOverlay from '../components/VideoOverlay.vue';

Vue.config.productionTip = false;

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';
Vue.use(VueMaterial);

import Vuex from 'vuex';
import BubbleModule from '../store/BubbleModule';
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {},
	modules: {
		BubbleModule,
	},
});

new Vue({
	render: h => h(Menu),
	store,
}).$mount('#plugin-meta-movie-menu');

new Vue({
	render: h => h(VideoOverlay),
	store,
}).$mount('#plugin-meta-movie-video-overlay');
