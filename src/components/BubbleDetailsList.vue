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
							<!-- this next div mysteriously fix the bug where 1 or 2 sides of
								the text areas are not displayed after rendering -->
							<div class="md-layout md-gutter" style="opacity:0;">
								<div class="md-layout-item">{{ bubble.text }}</div>
							</div>
							<div class="md-layout md-gutter">
								<div class="md-layout-item">
									<md-field class="textarea-field">
										<label>Text</label>
										<md-textarea v-model="bubble.text" disabled></md-textarea>
									</md-field>
								</div>
							</div>
							<div class="md-layout md-gutter" style="margin-top: 10px:">
								<div class="md-layout-item">
									<div>
										<time-selector
											v-model="bubble.from"
											label="From"
											readonly="true"
										></time-selector>
									</div>
								</div>
								<div class="md-layout-item">
									<div>
										<time-selector
											v-model="bubble.to"
											label="To"
											readonly="true"
										></time-selector>
									</div>
								</div>
							</div>
							<div class="md-layout md-gutter">
								<div class="md-layout-item">
									<md-field>
										<md-icon>place</md-icon>
										<label>Horizontal</label>
										<md-input v-model="bubble.formatedX" readonly></md-input>
									</md-field>
								</div>
								<div class="md-layout-item">
									<md-field>
										<md-icon>place</md-icon>
										<label>Vertical</label>
										<md-input v-model="bubble.formatedY" readonly></md-input>
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
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                     TS                                     */
/* -------------------------------------------------------------------------- */
import BubbleData from '@/models/BubbleData';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TimeSelector from '@/components/TimeSelector.vue';

type formatedBubble = BubbleData & {
	formatedX: string;
	formatedY: string;
};

@Component({
	components: {
		TimeSelector,
	},
})
export default class BubbleDetailsList extends Vue {
	@Prop()
	isBubbleListDisplayed = false;
	@Prop()
	bubbles!: Array<formatedBubble>;

	@Watch('bubbles')
	onBubblesChanged(newBubblesValue: Array<formatedBubble>) {
		for (const bubble of newBubblesValue) {
			bubble.formatedX = bubble.x + '%';
			bubble.formatedY = bubble.y + '%';
		}
	}

	public readableTime(timeInSeconds: number) {
		const hours = Math.floor(timeInSeconds / 3600);
		timeInSeconds -= hours * 3600;
		const minutes = Math.floor(timeInSeconds / 60);
		timeInSeconds -= minutes * 60;
		return `${hours}:${minutes
			.toString()
			.padStart(2, '0')}:${timeInSeconds.toString().padStart(2, '0')}`;
	}

	onExpandLineClick(event: Event) {
		((event.target as HTMLElement)?.querySelector(
			'.md-button'
		) as HTMLElement)?.click();
	}
}
</script>

<style scoped lang="scss">
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    SCSS                                    */
/* -------------------------------------------------------------------------- */
@import '~@/styles/variables-and-mixins.scss';

$padding-card: 20px;
.md-dialog-container {
	& > * {
		background-color: #424242;
	}
}
.md-dialog-content {
	width: 50vw;
	max-height: 50vh;
	@include scrollbar;
}

.md-card {
	margin: 10px;
	padding: 0 $padding-card 0 $padding-card;
	background-color: #616161 !important;

	& .md-card-header {
		padding: 0;
		display: flex;
		align-items: center;
	}

	& textarea {
		@include scrollbar;
		resize: none !important;
	}
	& .md-title {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		font-size: 18px;
	}
	& .md-divider {
		margin-left: -$padding-card;
		margin-right: -$padding-card;
	}
	& .md-card-actions {
		background-color: inherit !important;
		padding: 0;
	}
}
</style>
