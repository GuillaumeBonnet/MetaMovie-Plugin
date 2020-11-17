import { removeExpiredBubble, updateABubble } from '@/Utils/BubbleUtils';
import BubbleData from '../models/BubbleData';

enum MutationBubble {
	TOGGLE_ARE_BUBBLE_DISPLAYED,
	SET_DISPLAYED_BUBBLES,
	SET_BUBBLES,
	UPDATE_BUBBLE,
	UPDATE_DISPLAYED_BUBBLE,
}
enum ActionBubble {
	TOGGLE_BUBBLE_VISIBILITY,
}
interface IBubbleState {
	areBubbleBubbleDisplayed: boolean;
	bubbles: BubbleData[];
	displayedBubbles: BubbleData[];
}

interface IbubbleStore {
	state: IBubbleState;
	commit: Function;
}
const bubbleModule = {
	state: () =>
		({
			areBubbleBubbleDisplayed: true,
			bubbles: [] as BubbleData[],
			displayedBubbles: [] as BubbleData[],
		} as IBubbleState),
	mutationsBubble: {
		[MutationBubble.TOGGLE_ARE_BUBBLE_DISPLAYED](state: IBubbleState) {
			state.areBubbleBubbleDisplayed = !state.areBubbleBubbleDisplayed;
		},
		[MutationBubble.SET_BUBBLES](state: IBubbleState, bubbles: BubbleData[]) {
			state.bubbles = bubbles;
		},
		[MutationBubble.UPDATE_BUBBLE](state: IBubbleState, bubble: BubbleData) {
			updateABubble(state.bubbles, bubble);
		},
		[MutationBubble.UPDATE_DISPLAYED_BUBBLE](
			state: IBubbleState,
			bubble: Partial<BubbleData>
		) {
			updateABubble(state.displayedBubbles, bubble);
		},
		[MutationBubble.SET_DISPLAYED_BUBBLES](
			state: IBubbleState,
			bubbles: BubbleData[]
		) {
			state.displayedBubbles = bubbles.map((bubble, index) => {
				bubble.index = index;
				return bubble;
			});
		},
	},
	actionBubbles: {
		[ActionBubble.TOGGLE_BUBBLE_VISIBILITY]({ commit, state }: IbubbleStore) {
			commit(MutationBubble.TOGGLE_ARE_BUBBLE_DISPLAYED);
			commit(
				MutationBubble.SET_DISPLAYED_BUBBLES,
				state.displayedBubbles.map(bubble => {
					bubble.isShown = state.areBubbleBubbleDisplayed;
					return bubble;
				})
			);
		},
	},
};
export {
	ActionBubble,
	MutationBubble,
	bubbleModule,
	IbubbleStore,
	IBubbleState,
};
