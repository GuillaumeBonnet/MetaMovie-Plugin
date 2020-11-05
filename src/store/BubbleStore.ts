import { removeExpiredBubble, updateABubble } from '@/Utils/BubbleUtils';
import {
	Module,
	VuexModule,
	Mutation,
	Action,
	MutationAction,
} from 'vuex-module-decorators';
import BubbleData from '../models/BubbleData';

@Module({
	name: 'BubbleStore',
	namespaced: true,
})
export default class BubbleStore extends VuexModule {
	private _areBubbleBubbleDisplayed = true;
	private _bubbles = [] as BubbleData[];
	private _progressIndex = 0;
	private _displayedBubbles = [] as BubbleData[];
	private _currentTime = 0;
	private _previousTime = 0;

	/* -------------------------------------------------------------------------- */
	/*                                   getters                                  */
	/* -------------------------------------------------------------------------- */

	get areBubbleDisplayed() {
		return this._areBubbleBubbleDisplayed;
	}

	get bubbles() {
		return this._bubbles;
	}
	get displayedBubbles() {
		return this._displayedBubbles;
	}

	/* -------------------------------------------------------------------------- */
	/*                                  mutations                                 */
	/* -------------------------------------------------------------------------- */

	@Mutation
	setBubbles(bubble: BubbleData[]) {
		this._bubbles = bubble;
	}

	@Mutation
	updateBubble(bubble: BubbleData) {
		updateABubble(this._bubbles, bubble);
	}

	@Mutation
	setDisplayedBubbles(bubbles: BubbleData[]) {
		this._displayedBubbles = bubbles.map((bubble, index) => {
			bubble.index = index;
			return bubble;
		});
	}

	@Mutation
	updateDisplayedBubble(bubble: Partial<BubbleData>) {
		updateABubble(this._displayedBubbles, bubble);
	}

	@Mutation
	toggleAreBubbleDisplayed() {
		this._areBubbleBubbleDisplayed = !this._areBubbleBubbleDisplayed;
	}

	@Mutation
	setCurrentTime(currentTime: number) {
		this._currentTime = currentTime;
	}

	@Mutation
	setPreviousTime(previousTime: number) {
		this._previousTime = previousTime;
	}

	@Mutation
	setProgressIndex(progressIndex: number) {
		this._progressIndex = progressIndex;
	}

	/* -------------------------------------------------------------------------- */
	/*                                   actions                                  */
	/* -------------------------------------------------------------------------- */
	@Action
	async toggleBubbleVisibility() {
		this.context.commit('toggleAreBubbleDisplayed');
		this.context.commit(
			'setDisplayedBubbles',
			this._displayedBubbles.map(bubble => {
				bubble.isShown = this.areBubbleDisplayed;
				return bubble;
			})
		);
	}

	@Action
	async handleVideoProgression(currentTime: number) {
		this.context.commit('setPreviousTime', this._currentTime);
		this.context.commit('setCurrentTime', currentTime);
		if (!this._bubbles || this._bubbles.length < 1) {
			return;
		}
		let displayedBubbles = [...this._displayedBubbles];
		let progressIndex = this._progressIndex;
		if (Math.abs(this._currentTime - this._previousTime) > 1) {
			displayedBubbles = [];
			progressIndex = 0;
			const indexNextBubble = this._bubbles.findIndex(
				bubble => bubble.from >= this._currentTime
			);
			if (indexNextBubble == -1) {
				progressIndex = this._bubbles.length;
			} else if (indexNextBubble == 0) {
				progressIndex = 0;
			} else {
				progressIndex = indexNextBubble - 1;
			}
		}
		const nextBubble = this._bubbles[progressIndex];
		removeExpiredBubble(displayedBubbles, this._currentTime);
		if (this._currentTime >= nextBubble.from) {
			progressIndex++;
			let indexToInsert = 0;
			for (const bubbleAlreadyDisplayed of this._displayedBubbles) {
				if (nextBubble.to < bubbleAlreadyDisplayed.to) {
					break;
				}
				indexToInsert++;
			}
			displayedBubbles.splice(indexToInsert, 0, nextBubble);
		}
		removeExpiredBubble(displayedBubbles, this._currentTime);
		this.context.commit('setDisplayedBubbles', displayedBubbles);
		this.context.commit('setProgressIndex', progressIndex);
	}
}
