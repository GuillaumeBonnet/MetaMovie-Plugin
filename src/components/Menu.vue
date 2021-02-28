<template>
	<div
		class="group touchable PlayerControls--control-element nfp-popup-control relative block"
		@mouseenter="menu.enterMenuIcon()"
		@mouseleave="menu.leaveMenuIcon()"
	>
		<div class="h-auto m-auto relative bottom-5">
			<button
				class="material-icons rounded-full bg-yellow-800 outline-none w-16 h-16 m-auto"
			>
				question_answer
			</button>
			<ul
				class="z-1000010 group-hover:block hidden text-3xl font-extralight text-gray-200 py-2 absolute bottom-20 -left-40 bg-gray-700 text-transparent h-auto w-max rounded-md"
			>
				<li class="h-14 px-5 flex content-center">
					<MdcSwitch
						class="my-auto"
						v-model="areCardsHidden_VueModel"
						label="Hide Cards"
					></MdcSwitch>
				</li>
				<MenuItem label="cards"></MenuItem>
				<MenuItem label="Fact lists library"></MenuItem>
				{{
					isDeckDisplayed
				}}
				<MenuItem
					label="Detail current list"
					@click="isDeckDisplayed = !isDeckDisplayed"
					class="relative group-menuItem"
					><current-deck class="" @click.stop></current-deck
				></MenuItem>
				<MenuItem
					label="displayed Card"
					@click="gboDebugDisplayedCard()"
				></MenuItem>
				<MenuItem label="all card" @click="gboDebugCard()"></MenuItem>
				<MenuItem label="add a new card at this time"></MenuItem>
			</ul>
		</div>
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
import { ActionCard, MutationCard } from '@/store/CardStore';
import { Options, Vue } from 'vue-class-component';
import CardData from '@/models/CardData';
import CurrentDeck from '@/components/CurrentDeck.vue';
import MdcSwitch from '@/components/MdcSwitch.vue';
import axios, { AxiosResponse } from 'axios';
import { DeckApi, DeckApi_WithoutCards } from '@/models/ApiTypes';
import { defineComponent } from 'vue';

const MenuItem = defineComponent({
	template: `
		<li
			class="hover:bg-white hover:bg-opacity-10 h-14 flex cursor-pointer px-5"
		>
			<p class="my-auto">{{ label }}</p>
			<slot></slot>
		</li>
	`,
	data() {
		return {
			label: '',
		};
	},
	components: {},
});

@Options({
	components: {
		MenuItem,
		CurrentDeck,
		MdcSwitch,
	},
})
export default class Menu extends Vue {
	constructor() {
		super();
		// const errorCB = (error: any) => {
		// 	console.error('error', error);
		// };
		// axios
		// 	.get(`${process.env.VUE_APP_API_URL}/decks/7093`)
		// 	.then((deck: AxiosResponse<DeckApi>) => {
		// 		const cards: CardData[] = deck.data.cards.map(card => {
		// 			return new CardData({
		// 				fromStamp: card.from,
		// 				toStamp: card.to,
		// 				x: card.position.x,
		// 				y: card.position.y,
		// 				text: card.text,
		// 			});
		// 		});
		// 		console.log('gboDebug:[cards]', cards);
		// 		this.$store.commit(MutationCard.SET_CARDS, cards);
		// 	});
		// axios
		// 	.get(`${process.env.VUE_APP_API_URL}/decks`)
		// 	.then((decks: AxiosResponse<DeckApi_WithoutCards[]>) => {
		// 		console.log('gboDebug:[decks]', decks);
		// 	})
		// 	.catch(errorCB);
	}

	/* -------------------------------------------------------------------------- */
	/*                         store methods & properties                         */
	/* -------------------------------------------------------------------------- */

	get displayedCards() {
		return this.$store.state.cardModule.displayedCards;
	}

	get cards() {
		return this.$store.state.cardModule.cards;
	}

	get areCardsHidden() {
		return this.$store.state.cardModule.areCardCardDisplayed;
	}

	get areCardsHidden_VueModel() {
		return this.areCardsHidden;
	}
	set areCardsHidden_VueModel(areCardsHidden: boolean) {
		this.$store.dispatch(ActionCard.TOGGLE_CARD_VISIBILITY);
	}

	/* -------------------------------------------------------------------------- */
	/*                                 menu state                                 */
	/* -------------------------------------------------------------------------- */
	movie?: string = '';

	/* -------------------------------------------------------------------------- */
	/*                               internal logic                               */
	/* -------------------------------------------------------------------------- */

	isDeckDisplayed = false;

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

<style scoped lang="postcss">
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    SCSS                                    */
/* -------------------------------------------------------------------------- */
/* @import '@/styles/variables-and-mixins.scss';

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
} */
</style>
