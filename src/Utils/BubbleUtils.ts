import BubbleData from '@/models/BubbleData';
import { IPositionXY, IVideoDimensions } from '@/models/Types';

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
	if (bubble?.id != null) {
		const index = bubbles.findIndex(bubbleElem => bubbleElem.id == bubble.id);
		if (index != -1) {
			Object.assign(bubbles[index], bubble);
		}
	}
}

function toFixedCoordinate(
	videoDimensions: IVideoDimensions,
	bubble: BubbleData,
	renderedBubble: Element
): IPositionXY {
	const topValue =
		(bubble.y * (videoDimensions.y - renderedBubble.clientHeight)) / 100;
	const leftValue =
		(bubble.x * (videoDimensions.x - renderedBubble.clientWidth)) / 100;
	return {
		top: topValue + 'px',
		left: leftValue + 'px',
	};
}

function pxToNumber(pxString: string) {
	return Number.parseInt(pxString.replace(' ', '').split('px')[0]);
}

function toRelativeCoordinate(
	videoDimensions: IVideoDimensions,
	renderedBubble: HTMLElement
) {
	return {
		x:
			(100 * pxToNumber(renderedBubble.style.left)) /
			(videoDimensions.x - renderedBubble.clientWidth),
		y:
			(100 * pxToNumber(renderedBubble.style.top)) /
			(videoDimensions.y - renderedBubble.clientHeight),
	};
}
export {
	toSeconds,
	removeExpiredBubble,
	updateABubble,
	toFixedCoordinate,
	toRelativeCoordinate,
	pxToNumber,
};
