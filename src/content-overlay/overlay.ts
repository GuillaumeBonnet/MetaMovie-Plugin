import Vue from 'vue';
import Menu from '../components/Menu.vue';
import VideoOverlay from './VideoOverlay.vue';

declare module 'vue/types/vue' {
	// 3. Declare augmentation for Vue
	interface Vue {
		sharedTxt: any;
	}
}

Vue.config.productionTip = false;
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';
Vue.use(VueMaterial);

import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		count: 0,
	},
	mutations: {
		increment(state) {
			state.count++;
		},
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
