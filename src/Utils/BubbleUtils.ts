import BubbleData from '@/models/BubbleData';

function toSeconds(time: string) {
	const timeValues = time.split(':').map(Number.parseInt);
	if (timeValues.length == 1) {
		return timeValues[0];
	} else if (timeValues.length == 2) {
		return 60 * timeValues[1] + timeValues[0];
	} else if (timeValues.length == 3)
		return 60 * 60 * timeValues[2] + 60 * timeValues[1] + timeValues[0];
	else {
		return NaN;
	}
}

function removeExpiredBubble(bubbles: BubbleData[], currentTime: number): void {
	if (bubbles[0] && bubbles[0].to <= currentTime) {
		bubbles.shift();
	}
}

function updateABubble(bubbles: BubbleData[], bubble: Partial<BubbleData>) {
	if (bubble?.index) {
		const index = bubbles.findIndex(
			bubbleElem => bubbleElem.index == bubble.index
		);
		if (index != -1) {
			Object.assign(bubbles[index], bubble);
		}
	}
}
export { toSeconds, removeExpiredBubble, updateABubble };
