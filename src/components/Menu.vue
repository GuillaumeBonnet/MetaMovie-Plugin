<template>
	<div
		class="group touchable PlayerControls--control-element nfp-popup-control relative block"
	>
		<div class="h-auto m-auto relative bottom-5">
			<button
				class="material-icons rounded-full bg-yellow-800 outline-none w-16 h-16 m-auto"
				:class="isMenuOppened ? 'ring ring-yellow-700' : ''"
				@click="menuButtonClicked()"
			>
				question_answer
			</button>

			<div
				class="z-1000010 text-3xl font-extralight text-gray-200 py-2 absolute bottom-20 -left-40 bg-gray-700 text-transparent h-auto w-max rounded-md"
				:class="isMenuOppened ? 'block' : 'hidden group-hover:block'"
			>
				<DeckSelector
					class="px-5 pt-5"
					:isDeckSelectionShown="isDeckSelectionShown"
					@deck-selector-button-clicked="deckSelectorButtonClicked()"
					@deck-selector-close="isDeckSelectionShown = false"
				></DeckSelector>
				<ul class="">
					<li class="h-14 px-5 flex content-center">
						<MdcSwitch
							class="my-auto"
							v-model="areCardsHidden_VueModel"
							label="Hide Cards"
						></MdcSwitch>
					</li>
					<MenuItem label="cards"></MenuItem>
					<MenuItem label="Fact lists library"></MenuItem>
					<MenuItem
						label="Detail current list"
						@click="forceDisplayDeckCards = !forceDisplayDeckCards"
						class="relative group-menuItem"
						:isActive="forceDisplayDeckCards"
					>
						<CurrentDeck
							class=""
							:forceDisplayDeckCards="forceDisplayDeckCards"
							@click.stop
						></CurrentDeck>
					</MenuItem>
					<MenuItem
						label="displayed Card"
						@click="gboDebugDisplayedCard()"
					></MenuItem>
					<MenuItem label="all card" @click="gboDebugCard()"></MenuItem>
					<MenuItem label="add a new card at this time"></MenuItem>
				</ul>
			</div>
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
import DeckSelector from '@/components/DeckSelector.vue';
import axios, { AxiosResponse } from 'axios';
import { DeckApi, DeckApi_WithoutCards } from '@/models/ApiTypes';
import { defineComponent } from 'vue';
import { MutationDeck } from '@/store/DeckStore';

const MenuItem = defineComponent({
	template: `
		<li
			class=" h-14 flex cursor-pointer px-5"
			:class="isActive ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'"
		>
			<p class="my-auto">{{ label }}</p>
			<slot></slot>
		</li>
	`,
	props: {
		label: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	components: {},
});

@Options({
	components: {
		MenuItem,
		CurrentDeck,
		MdcSwitch,
		DeckSelector,
	},
})
export default class Menu extends Vue {
	created() {
		console.log(
			'gboDebug:menu[this.$store.state.cardModule]',
			this.$store.state.cardModule
		);
		console.log(
			'gboDebug:menu[this.$store.state.deckModule]',
			this.$store.state.deckModule
		);
		const errorCB = (error: any) => {
			console.error('error', error);
		};
		axios
			.get(`${process.env.VUE_APP_API_URL}/decks`)
			.then((decks: AxiosResponse<DeckApi_WithoutCards[]>) => {
				this.$store.commit(MutationDeck.SET_DECKS, decks.data);
			})
			.catch(errorCB);
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
		return !this.$store.state.cardModule.areCardCardDisplayed;
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
	isMenuForcedOpen = false;
	isDeckSelectionShown = false;
	get isMenuOppened() {
		return (
			this.isMenuForcedOpen ||
			this.isDeckSelectionShown ||
			this.forceDisplayDeckCards
		);
	}
	deckSelectorButtonClicked() {
		this.isDeckSelectionShown = !this.isDeckSelectionShown;
	}
	menuButtonClicked() {
		if (this.isMenuOppened) {
			this.isMenuForcedOpen = false;
			this.isDeckSelectionShown = false;
			this.forceDisplayDeckCards = false;
		} else {
			this.isMenuForcedOpen = true;
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                               internal logic                               */
	/* -------------------------------------------------------------------------- */

	forceDisplayDeckCards = false;

	seeCurrentFactList() {
		console.log('gboDebug:[seeCurrentFactList]');
	}

	gboDebugDisplayedCard() {
		console.log('gboDebug:[this.displayedCards]', this.displayedCards);
	}
	gboDebugCard() {
		console.log('gboDebug:[this.cards]', this.cards);
	}
}
</script>

<style scoped lang="postcss"></style>
