<template>
	<div class="full-screen-overlay">
		<Menu></Menu>

		<!-- <template v-if="videoDimensions.x">
			<Bubble
			v-for="(bubble, index) in bubbleDisplayed_list"
			:key="index"
			:text="bubble.text"
			:x="bubble.x"
			:y="bubble.y"
			:videoDimensions="videoDimensions"
			@click="togglePausePlay"
			></Bubble>
		</template> -->
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator';
import Bubble from '../components/Bubble.vue';
import Menu from '../components/Menu.vue';

const UtilsConst = {
	toSeconds: (time: string) => {
		const timeValues = time.split(':').map(Number.parseInt);
		if(timeValues.length == 1)
			return timeValues[0];
		else if(timeValues.length == 2)
			return 60*timeValues[1] + timeValues[0];
		else if(timeValues.length == 3)
			return 60*60*timeValues[2] + 60*timeValues[1] + timeValues[0];
		else{
			return NaN;
		}
	}
};

class BubbleData {
	public from: number;	
	public to: number;
	public text: string;
	private x: number;
	private y: number;

	constructor(input: {fromStamp: string; toStamp: string; x: number; y: number}) {
		this.from = UtilsConst.toSeconds(input.fromStamp);
		this.to = UtilsConst.toSeconds(input.toStamp);
		this.text = `text from ${input.fromStamp} sec
					to ${input.toStamp}, x:${input.x}, y:${input.y}`;
		this.x = input.x;
		this.y = input.y;
	}
}

@Component({
	components: {
		Bubble,
		Menu
	},
})
export default class AppOverlay extends Vue {
	created() {
		const setVideoDimensions = () => {
			const videoContainer = document.querySelector('div.VideoContainer');
				const bottomController = document.querySelector('div.PlayerControlsNeo__bottom-controls');
				if(!videoContainer || !bottomController) {
					return;
				}
				this.videoDimensions = {
					x: videoContainer.clientWidth,
					y: videoContainer.clientHeight - bottomController.clientHeight
				};
		};
		const videoEvent = () => {
			this.video = document.querySelector('video');
			if(this.video) {
				this.video.addEventListener("timeupdate", (event) => {
					const currentTime = this.video && this.video.currentTime;
					if(!currentTime) return;
					this.handleVideoProgression(currentTime);
				});
				setVideoDimensions();				
			} else {
				console.error('no video found.');
				setTimeout(videoEvent, 200);
			}
		};
		videoEvent();
		document.onfullscreenchange = ( event ) => {
			setTimeout(() => {
				setVideoDimensions();
			}, 100);
			//TODO understand why there is a racecondition between re-rendering and async queue
		};
	}
	private video!: HTMLVideoElement | null;
	private videoDimensions: {x: number; y: number} =  {x:0, y:0}; //in px


	private Utils = UtilsConst;

	private bubbleTable = [
		new BubbleData({
			fromStamp:'1'
			, toStamp:'4'
			, x:0
			, y:0
		}),
		new BubbleData({
			fromStamp:'1'
			, toStamp:'4'
			, x:0
			, y:100
		}),
		new BubbleData({
			fromStamp:'1'
			, toStamp:'4'
			, x:100
			, y:0
		}),
		new BubbleData({
			fromStamp:'1'
			, toStamp:'4'
			, x:100
			, y:100
		}),
		new BubbleData({
			fromStamp:'5'
			, toStamp:'7'
			, x:50
			, y:50
		}),
		new BubbleData({
			fromStamp:'10'
			, toStamp:'15'
			, x:0
			, y:0
		}),
		new BubbleData({
			fromStamp:'16'
			, toStamp:'20'
			, x:50
			, y:25
		}),
		new BubbleData({
			fromStamp:'25'
			, toStamp:'30'
			, x:100
			, y:10
		}),
	] as BubbleData[];
	private bubbles: {list: BubbleData[]; progressIndex: number; nextBubble: Function} = {
		list : this.bubbleTable
		, progressIndex: 0
		, nextBubble: function (): boolean | BubbleData {
			return this.list && this.list[this.progressIndex];
		}
	};
	private bubbleDisplayed_list: BubbleData[] = [];
	private nextInfoTime = this.bubbleTable[0].from;
	private previousTime = 0;

	/* -------------------------------------------------------------------------- */
	/*                                   methods                                  */
	/* -------------------------------------------------------------------------- */
	handleVideoProgression(currentTime: number) {
			
		if(Math.abs(currentTime-this.previousTime) > 1 ) {
			//build a queue with the bubbles after current time
			this.bubbleDisplayed_list = [];
			this.bubbles.progressIndex = 0;
			const indexNextBubble = this.bubbles.list.findIndex(
				(bubble) => bubble.from >= currentTime
			);
						
			if(indexNextBubble == -1) {
				this.bubbles.progressIndex = this.bubbles.list.length;
			}
			else if(indexNextBubble == 0) {
				this.bubbles.progressIndex = 0;
			}
			else {
				this.bubbles.progressIndex = indexNextBubble - 1;
			}
		}

		const removeExpiredBubble = () => {
			if(this.bubbleDisplayed_list[0] && this.bubbleDisplayed_list[0].to <= currentTime ) {
				this.bubbleDisplayed_list.shift();
			}
		};
		removeExpiredBubble();

		const nextBubble = this.bubbles.nextBubble();		
		if(nextBubble && currentTime >= nextBubble.from) {
			this.bubbles.progressIndex++; // = nextBubble index
			let indexToInsert = 0;
			for(const bubbleAlreadyDisplayed of this.bubbleDisplayed_list) {
				if(nextBubble.to < bubbleAlreadyDisplayed.to) {
					break;
				}
				indexToInsert++;
			}
			this.bubbleDisplayed_list.splice(indexToInsert, 0, nextBubble);
		}
		removeExpiredBubble();
		this.previousTime = currentTime;	
	}
	
	/* -------------------------------------------------------------------------- */
	/*                                  handlers                                  */
	/* -------------------------------------------------------------------------- */

	togglePausePlay() {		
		if(!this.video) {
			return;
		}
		this.video.click();
	}
}
</script>

<style lang="scss">

div.v-application.v-application {
	position: relative;
	z-index: 2;
	height: 0;
	width: 0;
}
</style>
