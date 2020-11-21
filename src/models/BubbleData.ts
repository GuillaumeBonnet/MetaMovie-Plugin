import { toSeconds } from '../Utils/BubbleUtils';

export default class BubbleData {
	public from: number;
	public to: number;
	public text: string;
	public x: number;
	public y: number;
	public isShown = true;
	public index!: number;

	constructor(input: {
		fromStamp: string;
		toStamp: string;
		x: number;
		y: number;
	}) {
		this.from = toSeconds(input.fromStamp);
		this.to = toSeconds(input.toStamp);
		this.text = `text from ${input.fromStamp} sec
					to ${input.toStamp}, x:${input.x}, y:${input.y}`;
		this.x = input.x;
		this.y = input.y;
	}
}