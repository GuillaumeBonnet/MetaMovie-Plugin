import { timestampToSeconds } from '../Utils/CardUtils';

export default class CardData {
	public from: string;
	public to: string;
	public text: string;
	public position: {
		x: number;
		y: number;
	};
	public isShown = true;
	public id: number;
	public static newCardCounter = 0;

	constructor(input: {
		fromStamp: string;
		toStamp: string;
		x: number;
		y: number;
		text: string;
		id?: number;
	}) {
		const timeStampRegex = /\d:\d\d:\d\d/;
		if (!timeStampRegex.test(input.fromStamp)) {
			throw Error(
				`fromStamp should have a 0:00:00 format. value: ${input.fromStamp}`
			);
		}
		if (!timeStampRegex.test(input.toStamp)) {
			throw Error(
				`toStamp should have a 0:00:00 format. value: ${input.toStamp}`
			);
		}
		this.text = `text from ${input.fromStamp} sec
to ${input.toStamp}, x:${input.x}, y:${input.y}`;
		this.from = input.fromStamp;
		this.to = input.toStamp;
		this.position = {
			x: input.x,
			y: input.y,
		};
		this.text = input.text;
		if (input.id) {
			this.id = input.id;
		} else {
			CardData.newCardCounter++;
			this.id = -CardData.newCardCounter;
		}
	}

	fromInSeconds() {
		return timestampToSeconds(this.from);
	}
	toInSeconds() {
		return timestampToSeconds(this.to);
	}
}
