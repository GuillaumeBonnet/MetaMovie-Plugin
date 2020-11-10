<template>
	<div
		class="touchable PlayerControls--control-element nfp-popup-control"
		@mouseenter="enterMenuIcon()"
		@mouseleave="leaveMenuIcon()"
	>
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
				<md-switch @change="handleSwitchToggling()" v-model="areBubblesHidden"
					>Hide bubbles</md-switch
				>
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
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import BubbleStore from '../store/BubbleStore';
@Component({
	components: {
		// sub-components
	},
})
export default class Menu extends Vue {
	handleSwitchToggling() {
		this.bubbleStore.toggleBubbleVisibility();
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
	private bubbleStore = getModule(BubbleStore, this.$store);
	private areBubblesHidden = !this.bubbleStore.areBubbleDisplayed;
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
