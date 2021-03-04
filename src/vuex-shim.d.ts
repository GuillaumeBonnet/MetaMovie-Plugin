import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { IState } from '@/store/Store';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$store: Store<IState>;
	}
}
