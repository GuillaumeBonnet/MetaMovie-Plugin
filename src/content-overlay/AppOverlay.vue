<template>
	<v-app class="full-screen-overlay">
		<template v-if="videoDimensions">
			<Bubble
			v-for="(bubble, index) in bubbleDisplayed_list"
			:key="index"
			:text="bubble.text"
			:x="bubble.x"
			:y="bubble.y"
			:videoDimensions="videoDimensions"
			@click="togglePausePlay"
			></Bubble>
		</template>
	</v-app>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator';
import Bubble from '../components/Bubble.vue';

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
		Bubble
	},
})
export default class AppOverlay extends Vue {
	created() {
		const videoEvent = () => {
			this.video = document.querySelector('video');
			if(this.video) {
				this.video.addEventListener("timeupdate", (event) => {
					const currentTime = this.video && this.video.currentTime;
					if(!currentTime) return;
					this.handleVideoProgression(currentTime);
				});
				
				const videoContainer = document.querySelector('div.VideoContainer');
				const bottomController = document.querySelector('div.PlayerControlsNeo__bottom-controls');
				if(!videoContainer || !bottomController) {
					return;
				}
				this.videoDimensions = {
					x: videoContainer.clientWidth,
					y: videoContainer.clientHeight - bottomController.clientHeight
				};
			} else {
				console.error('no video found.');
				setTimeout(videoEvent, 200);
			}
		};
		videoEvent();
	}

	// TODO
	//  To learn when other code has toggled full-screen mode on and off,
	//  you should establish listeners for the fullscreenchange event on the Document.
	//  It's also important to listen for fullscreenchange to be aware when, for example,
	//  the user manually toggles full-screen mode, or when the user switches applications, 
	//  causing your application to temporarily exit full-screen mode.

	private video!: HTMLVideoElement | null;
	private videoDimensions!: {x: number; y: number}; //in px


	private Utils = UtilsConst;

	private bubbleTable = [
		new BubbleData({
			fromStamp:'0'
			, toStamp:'3'
			, x:0
			, y:0
		}),
		new BubbleData({
			fromStamp:'0'
			, toStamp:'3'
			, x:0
			, y:100
		}),
		new BubbleData({
			fromStamp:'0'
			, toStamp:'3'
			, x:100
			, y:0
		}),
		new BubbleData({
			fromStamp:'0'
			, toStamp:'3'
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
	private bubbleDisplayed_list: BubbleData[] = [];
	private nextInfoTime = this.bubbleTable[0].from;


	/* -------------------------------------------------------------------------- */
	/*                                   methods                                  */
	/* -------------------------------------------------------------------------- */
	handleVideoProgression(currentTime: number) {		
		if(this.bubbleDisplayed_list[0] && currentTime >= this.bubbleDisplayed_list[0].to) {
			this.bubbleDisplayed_list.shift();
		}

		if(this.bubbleTable[0] && currentTime >= this.bubbleTable[0].from) {
			const bubbleToDisplay = this.bubbleTable.shift();
			if(bubbleToDisplay) {
				let indexToInsert = 0;
				for(const bubbleDisplayed of this.bubbleDisplayed_list) {
					if(bubbleToDisplay.to < bubbleDisplayed.to) {
						break;
					}
					indexToInsert++;
				}
				this.bubbleDisplayed_list.splice(indexToInsert, 0, bubbleToDisplay);
			}
		}		
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
@font-face {
	font-family: materialdesignicons-webfont;
	src: url('chrome-extension://__MSG_@@extension_id__/fonts/materialdesignicons-webfont.ttf');
}

div.v-application.v-application {
	position: relative;
	z-index: 2;
	height: 0;
	width: 0;
}
</style>
