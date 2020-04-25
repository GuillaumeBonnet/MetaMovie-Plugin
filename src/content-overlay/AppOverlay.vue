<template>
<div class="full-screen-overlay">
	<v-app>
		<v-btn class="mx-2"
			@click="dialog = true"
			fab dark small
			color="primary"
		>
			<v-icon dark>mdi-close</v-icon>
		</v-btn>
	</v-app>

	<v-dialog
		v-model="dialog"
		width="500"
    >
		<template v-slot:activator="{ on }">
			<v-btn
				color="red lighten-2"
				dark
				v-on="on"
			>
				Click Me
			</v-btn>
		</template>

		<v-card>
			<v-card-title
				class="headline grey lighten-2"
				primary-title
			>
				Privacy Policy
			</v-card-title>

			<v-card-text>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="primary"
					text
					@click="dialog = false"
				>
					I accept
				</v-btn>
			</v-card-actions>
		</v-card>
    </v-dialog>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
	components: {
	},
})
export default class AppOverlay extends Vue {
	created() {
		console.log("gboDebug:[in created");
		const video: HTMLVideoElement | null = document.querySelector('video');
		console.log("gboDebug:[video]", video);
		if(video) {
			video.addEventListener("progress", (event) => {
				console.log("gboDebug:[event.timeStamp]", event.timeStamp);        
			});
		}
	}

	

	@Prop()
	private dialog = false;
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
	z-index: 2;
}

div.v-application.v-application {
	background-color: transparent;
}
</style>
