import CardData from '@/models/CardData';
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

function removeExpiredCards(cards: CardData[], currentTime: number): void {
	while (cards && cards[0] && cards[0].toInSeconds() <= currentTime) {
		cards.shift();
	}
}

function updateACard(cards: CardData[], card: Partial<CardData>) {
	const index = cards.findIndex(cardElem => cardElem.id == card.id);
	if (index != -1) {
		Object.assign(cards[index], card);
	}
}

function toFixedCoordinate(
	videoDimensions: IVideoDimensions,
	card: CardData,
	renderedCard: Element
): IPositionXY {
	const topValue =
		(card.position.y * (videoDimensions.y - renderedCard.clientHeight)) / 100;
	const leftValue =
		(card.position.x * (videoDimensions.x - renderedCard.clientWidth)) / 100;
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
	renderedCard: HTMLElement
) {
	return {
		x:
			(100 * pxToNumber(renderedCard.style.left)) /
			(videoDimensions.x - renderedCard.clientWidth),
		y:
			(100 * pxToNumber(renderedCard.style.top)) /
			(videoDimensions.y - renderedCard.clientHeight),
	};
}
export {
	removeExpiredCards,
	updateACard,
	toFixedCoordinate,
	toRelativeCoordinate,
	pxToNumber,
	timestampToSeconds,
	readableTime,
};
