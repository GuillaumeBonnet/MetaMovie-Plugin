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
			<card-details-list
				:isCardListDisplayed="isCardListDisplayed"
				:cards="displayedCards"
				@close-card-list="isCardListDisplayed = false"
			></card-details-list>
			<md-menu-content
				class="menu-box"
				@mouseenter.native.prevent="menu.enterMenuContent()"
				@mouseleave.native.prevent="menu.leaveMenuContent()"
			>
				<md-menu-item
					><md-switch v-model="areCardsHidden_VModel"
						>Hide cards</md-switch
					></md-menu-item
				>
				<md-menu-item>Fact lists library</md-menu-item>
				<md-menu-item
					@click.native.prevent
					@click.prevent="isCardListDisplayed = !isCardListDisplayed"
					>Detail current list</md-menu-item
				>
				<md-menu-item @click.native="gboDebugDisplayedCard()"
					>displayed Card</md-menu-item
				>
				<md-menu-item @click.native="gboDebugCard()">all card</md-menu-item>
				<md-menu-item>add a new card at this time</md-menu-item>
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
import { ActionCard, ICardState, MutationCard } from '@/store/CardStore';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Action, State } from 'vuex-class';
import { IState } from '@/store/Store';
import CardData from '@/models/CardData';
import { mapState } from 'vuex';
import CardDetailsList from '@/components/CardDetailsList.vue';

@Component({
	components: {
		CardDetailsList,
	},
})
export default class Menu extends Vue {
	constructor() {
		super();
	}

	/* -------------------------------------------------------------------------- */
	/*                         store methods & properties                         */
	/* -------------------------------------------------------------------------- */

	@Action(ActionCard.TOGGLE_CARD_VISIBILITY) handleSwitchToggling: any;

	@State((state: IState) => state.cardModule.cards)
	displayedCards!: ICardState['displayedCards'];

	@State((state: IState) => state.cardModule.cards)
	cards!: ICardState['cards'];

	@State((state: IState) => !state.cardModule.areCardCardDisplayed)
	areCardsHidden!: ICardState['areCardCardDisplayed'];
	get areCardsHidden_VModel() {
		return this.areCardsHidden;
	}
	set areCardsHidden_VModel(areCardsHidden: boolean) {
		this.handleSwitchToggling();
	}

	/* -------------------------------------------------------------------------- */
	/*                               internal logic                               */
	/* -------------------------------------------------------------------------- */

	isCardListDisplayed = false;

	seeCurrentFactList() {
		console.log('gboDebug:[seeCurrentFactList]');
	}

	gboDebugDisplayedCard() {
		console.log('gboDebug:[this.displayedCards]', this.displayedCards);
	}
	gboDebugCard() {
		console.log('gboDebug:[this.cards]', this.cards);
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
