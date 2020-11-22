<template>
	<md-dialog :md-active="isBubbleListDisplayed" :md-backdrop="false">
		<md-dialog-title>Current Fact List</md-dialog-title>
		<md-dialog-content>
			<md-card v-for="(bubble, index) in bubbles" :key="index">
				<md-card-header>
					<div class="md-title">{{ bubble.text }}</div>
				</md-card-header>
				<md-divider />

				<md-card-expand>
					<md-card-actions
						md-alignment="space-between"
						@click.native="onExpandLineClick($event)"
					>
						<div>
							<md-icon>more_horiz</md-icon>
						</div>
						<md-card-expand-trigger>
							<md-button class="md-icon-button">
								<md-icon>keyboard_arrow_down</md-icon>
							</md-button>
						</md-card-expand-trigger>
					</md-card-actions>

					<md-card-expand-content>
						<md-card-content>
							<div class="md-layout md-gutter">
								<div class="md-layout-item">
									<md-field>
										<label>Text</label>
										<md-textarea v-model="bubble.text" readonly></md-textarea>
									</md-field>
								</div>
							</div>
							<div class="md-layout md-gutter">
								<div class="md-layout-item">
									<md-field>
										<label>From</label>
										<md-input v-model="bubble.from" readonly></md-input>
									</md-field>
								</div>
								<div class="md-layout-item">
									<md-field>
										<label>To</label>
										<md-input v-model="bubble.to" readonly></md-input>
									</md-field>
								</div>
							</div>
							<div class="md-layout md-gutter">
								<div class="md-layout-item">
									<md-field>
										<label>Horizontal</label>
										<md-input v-model="bubble.x" readonly></md-input>
									</md-field>
								</div>
								<div class="md-layout-item">
									<md-field>
										<label>Vertical</label>
										<md-input v-model="bubble.y" readonly></md-input>
									</md-field>
								</div>
							</div>
						</md-card-content>
					</md-card-expand-content>
				</md-card-expand>
			</md-card>
		</md-dialog-content>
		<md-dialog-actions>
			<md-button class="md-primary" @click="$emit('close-bubble-list')"
				>Close</md-button
			></md-dialog-actions
		>
	</md-dialog>
</template>

<script lang="ts">
import BubbleData from '@/models/BubbleData';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		// sub-components
	},
})
export default class BubbleDetailsList extends Vue {
	@Prop()
	isBubbleListDisplayed = false;
	@Prop()
	bubbles!: BubbleData[];

	onExpandLineClick(event: Event) {
		((event.target as HTMLElement)?.querySelector(
			'.md-button'
		) as HTMLElement)?.click();
	}

	form = {
		firstName: null,
	};
}
</script>

<style scoped lang="scss">
$padding-card: 20px;
.md-card {
	margin: 20px;
	padding: $padding-card;
	background-color: #212121 !important;
	& .md-title {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	& .md-divider {
		margin-left: -$padding-card;
		margin-right: -$padding-card;
	}
	& .md-card-actions {
		background-color: inherit !important;
	}
}
.md-dialog-content {
	width: 50vw;
	max-height: 50vh;
	overflow-y: scroll;
	$width-scrollbar: 12px;
	&::-webkit-scrollbar {
		width: $width-scrollbar;
	}
	&::-webkit-scrollbar-track {
		background: md-get-palette-color(green, 200);
		border-radius: $width-scrollbar;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: $width-scrollbar;
		background: #757575;
	}
	&::-webkit-scrollbar-button {
		display: none;
	}
}
</style>
