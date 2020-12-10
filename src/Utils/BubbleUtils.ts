import BubbleData from '@/models/BubbleData';
import { IPositionXY, IVideoDimensions } from '@/models/Types';

function timestampToSeconds(timestamp: string) {
	if (!/\d:\d\d:\d\d/.test(timestamp)) {
		throw Error('timestamp should have a format like 0:00:00.');
	}
	const [hours, minutes, seconds] = timestamp.split(':');
	return (
		Number.parseInt(hours) * 60 * 60 +
		Number.parseInt(minutes) * 60 +
		Number.parseInt(seconds)
	);
}

function readableTime(timeInSeconds: number) {
	const hours = Math.floor(timeInSeconds / 3600);
	timeInSeconds -= hours * 3600;
	const minutes = Math.floor(timeInSeconds / 60);
	timeInSeconds -= minutes * 60;
	return `${hours}:${minutes
		.toString()
		.padStart(2, '0')}:${timeInSeconds.toString().padStart(2, '0')}`;
}

function removeExpiredBubbles(
	bubbles: BubbleData[],
	currentTime: number
): void {
	while (bubbles && bubbles[0] && bubbles[0].toInSeconds() <= currentTime) {
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
		(bubble.position.y * (videoDimensions.y - renderedBubble.clientHeight)) /
		100;
	const leftValue =
		(bubble.position.x * (videoDimensions.x - renderedBubble.clientWidth)) /
		100;
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
	removeExpiredBubbles,
	updateABubble,
	toFixedCoordinate,
	toRelativeCoordinate,
	pxToNumber,
	timestampToSeconds,
	readableTime,
};
