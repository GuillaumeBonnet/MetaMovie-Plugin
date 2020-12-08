<template>
	<div
		class="touchable PlayerControls--control-element nfp-popup-control"
		@mouseenter="menu.enterMenuIcon()"
		@mouseleave="menu.leaveMenuIcon()"
	>
		<!-- todo:menu should be aligned to class="touchable PlayerControls--control-element nfp-popup-control", not  inner button -->
		<md-menu
			:md-active="menu.menuHoverState.isMenuOppened"
			md-direction="top-end"
			md-align-trigger
			@mouseenter.native.prevent="menu.enterMenuContent()"
			@mouseleave.native.prevent="menu.leaveMenuContent()"
		>
			<button
				class="touchable PlayerControls--control-element nfp-button-control default-control-button button-nfplayerReportAProblem"
			>
				<md-button md-menu-trigger class="md-icon-button md-raised md-accent">
					<md-icon>question_answer</md-icon>
				</md-button>
			</button>
			<bubble-details-list
				:isBubbleListDisplayed="isBubbleListDisplayed"
				:bubbles="displayedBubbles"
				@close-bubble-list="isBubbleListDisplayed = false"
			></bubble-details-list>
			<md-menu-content
				class="menu-box"
				@mouseenter.native.prevent="menu.enterMenuContent()"
				@mouseleave.native.prevent="menu.leaveMenuContent()"
			>
				<md-menu-item
					><md-switch v-model="areBubblesHidden_VModel"
						>Hide bubbles</md-switch
					></md-menu-item
				>
				<md-menu-item>Fact lists library</md-menu-item>
				<md-menu-item
					@click.native.prevent
					@click.prevent="isBubbleListDisplayed = !isBubbleListDisplayed"
					>Detail current list</md-menu-item
				>
				<md-menu-item @click.native="gboDebugDisplayedBubble()"
					>displayed Bubble</md-menu-item
				>
				<md-menu-item @click.native="gboDebugBubble()">all bubble</md-menu-item>
				<md-menu-item>add a new bubble at this time</md-menu-item>
			</md-menu-content>
		</md-menu>
	</div>
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
import BubbleDetailsList from '@/components/BubbleDetailsList.vue';

@Component({
	components: {
		BubbleDetailsList,
	},
})
export default class Menu extends Vue {
	constructor() {
		super();
	}

	/* -------------------------------------------------------------------------- */
	/*                         store methods & properties                         */
	/* -------------------------------------------------------------------------- */

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

	/* -------------------------------------------------------------------------- */
	/*                               internal logic                               */
	/* -------------------------------------------------------------------------- */

	isBubbleListDisplayed = false;

	seeCurrentFactList() {
		console.log('gboDebug:[seeCurrentFactList]');
	}

	gboDebugDisplayedBubble() {
		console.log('gboDebug:[this.displayedBubbles]', this.displayedBubbles);
	}
	gboDebugBubble() {
		console.log('gboDebug:[this.bubbles]', this.bubbles);
	}

	/* -------------------------------------------------------------------------- */
	/*                           display menu behaviour                           */
	/* -------------------------------------------------------------------------- */

	menu = {
		enterMenuIcon: () => {
			this.menu.menuHoverState.isMenuOppened = true;
		},
		leaveMenuIcon: () => {
			this.menu.menuHoverState.timeOutIds.push(
				setTimeout(() => {
					if (!this.menu.menuHoverState.isMenuContentHovered) {
						this.menu.menuHoverState.isMenuOppened = false;
					}
				}, 200)
			);
		},
		enterMenuContent: () => {
			this.menu.menuHoverState.clearTimeOutIds();
			this.menu.menuHoverState.isMenuContentHovered = true;
		},
		leaveMenuContent: () => {
			this.menu.menuHoverState.timeOutIds.push(
				setTimeout(() => {
					this.menu.menuHoverState.isMenuContentHovered = false;
					this.menu.menuHoverState.isMenuOppened = false;
				}, 200)
			);
		},
		menuHoverState: {
			isMenuOppened: false,
			isMenuContentHovered: false,
			timeOutIds: [] as number[],
			clearTimeOutIds: function() {
				this.timeOutIds.forEach(timeoutId => {
					clearTimeout(timeoutId);
				});
				this.timeOutIds = [];
			},
		},
	};
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
@import '@/styles/variables-and-mixins.scss';

.md-menu-item:hover {
	background-color: rgb(73, 79, 82);
	color: rgb(232, 230, 227);
}

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
