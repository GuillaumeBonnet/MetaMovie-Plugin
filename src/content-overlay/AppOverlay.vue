<template>
<div class="full-screen-overlay">
	<v-app>
		<v-btn class="mx-2" fab dark small color="primary">
			<v-icon dark>mdi-close</v-icon>
		</v-btn>
	</v-app>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
	components: {
	},
})
export default class AppOverlay extends Vue {
	beforeCreate() {
		console.log("gboDebug:[in beforeCreate");
		const video: HTMLVideoElement | null = document.querySelector('video');
		console.log("gboDebug:[video]", video);
		if(video) {
			video.addEventListener("progress", (event) => {
			console.log("gboDebug:[event.timeStamp]", event.timeStamp);        
		})
		}
	}
}
</script>

<style lang="scss">
@font-face {
	font-family: materialdesignicons-webfont;
	src: url('chrome-extension://__MSG_@@extension_id__/fonts/materialdesignicons-webfont.ttf');
}
.full-screen-overlay {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
