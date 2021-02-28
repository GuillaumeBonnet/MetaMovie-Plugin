import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';
import { ICardState } from '@/store/CardStore';
import CardData from '@/models/CardData';

declare module '@vue/runtime-core' {
	interface State {
		video: HTMLVideoElement;
		netflixPlayer: any;
		isFullScreen: boolean;
		cardEdited?: CardData;
		currentTime: number;
		previousTime: number;
		progressIndex: number;
		cardModule: ICardState;
	}

	interface ComponentCustomProperties {
		$store: Store<State>;
	}
}
