<template>
	<div
		class="touchable PlayerControls--control-element nfp-popup-control"
		@mouseenter="enterMenuIcon()"
		@mouseleave="leaveMenuIcon()"
	>
		<!-- todo:menu should be aligned to class="touchable PlayerControls--control-element nfp-popup-control", not  inner button -->
		<md-menu
			:md-active="menuHoverState.isMenuOppened"
			md-direction="top-end"
			md-align-trigger
			@mouseenter.native.prevent="enterMenuContent()"
			@mouseleave.native.prevent="leaveMenuContent()"
		>
			<button
				class="touchable PlayerControls--control-element nfp-button-control default-control-button button-nfplayerReportAProblem"
			>
				<md-button md-menu-trigger class="md-icon-button md-raised md-accent">
					<md-icon>question_answer</md-icon>
				</md-button>
			</button>

			<md-menu-content
				class="menu-box"
				@mouseenter.native.prevent="enterMenuContent()"
				@mouseleave.native.prevent="leaveMenuContent()"
			>
				<md-switch v-model="areBubblesHidden_VModel">Hide bubbles</md-switch>
				<md-menu-item @click.native="gboDebugDisplayedBubble()"
					>displayed Bubble</md-menu-item
				>
				<md-menu-item @click.native="gboDebugBubble()">all bubble</md-menu-item>
				<md-menu-item>My Item 3</md-menu-item>
			</md-menu-content>
		</md-menu>
	</div>
</template>

<script lang="ts">
import {
	ActionBubble,
	IBubbleState,
	MutationBubble,
} from '@/store/BubbleStore';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Action, State } from 'vuex-class';
import { IState } from '@/store/Store';
import BubbleData from '@/models/BubbleData';
import { mapState } from 'vuex';
@Component({
	components: {
		// sub-components
	},
})
export default class Menu extends Vue {
	constructor() {
		super();
	}

	@Action(ActionBubble.TOGGLE_BUBBLE_VISIBILITY) handleSwitchToggling: any;

	@State((state: IState) => state.bubbleModule.bubbles)
	displayedBubbles!: IBubbleState['displayedBubbles'];

	@State((state: IState) => state.bubbleModule.bubbles)
	bubbles!: IBubbleState['bubbles'];

	@State((state: IState) => !state.bubbleModule.areBubbleBubbleDisplayed)
	areBubblesHidden!: IBubbleState['areBubbleBubbleDisplayed'];
	get areBubblesHidden_VModel() {
		return this.areBubblesHidden;
	}
	set areBubblesHidden_VModel(areBubblesHidden: boolean) {
		this.handleSwitchToggling();
	}

	enterMenuIcon() {
		this.menuHoverState.isMenuOppened = true;
	}
	leaveMenuIcon() {
		this.menuHoverState.timeOutIds.push(
			setTimeout(() => {
				if (!this.menuHoverState.isMenuContentHovered) {
					this.menuHoverState.isMenuOppened = false;
				}
			}, 200)
		);
	}
	enterMenuContent() {
		this.menuHoverState.clearTimeOutIds();
		this.menuHoverState.isMenuContentHovered = true;
	}
	leaveMenuContent() {
		this.menuHoverState.timeOutIds.push(
			setTimeout(() => {
				this.menuHoverState.isMenuContentHovered = false;
				this.menuHoverState.isMenuOppened = false;
			}, 200)
		);
	}

	gboDebugDisplayedBubble() {
		console.log('gboDebug:[this.displayedBubbles]', this.displayedBubbles);
	}
	gboDebugBubble() {
		console.log('gboDebug:[this.bubbles]', this.bubbles);
	}
	private menuHoverState = {
		isMenuOppened: false,
		isMenuContentHovered: false,
		timeOutIds: [] as number[],
		clearTimeOutIds: function() {
			this.timeOutIds.forEach(timeoutId => {
				clearTimeout(timeoutId);
			});
			this.timeOutIds = [];
		},
	};
	private fav = true;
	private menu = false;
	private message = false;
	private hints = true;
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
.menu-box::v-deep {
	border-radius: $border-radius;
	overflow: hidden;
	margin-bottom: -1px;
	& .md-list {
		padding: 0.8em;
	}
}
.menu-icon-container.menu-icon-container {
	padding: 0 0 0.6em 0;
	position: initial;
	width: 3.4em;
	height: 3.6em;
	background: unset;
	&::v-deep div {
		min-width: unset;
		min-height: unset;
		background: unset;
	}
}
</style>
