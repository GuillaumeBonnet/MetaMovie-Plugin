<template>
	<div
		class="z-1000050 absolute group touchable PlayerControls--control-element nfp-popup-control block"
		:class="{ ['hidden']: !isDisplayed }"
		:style="position"
		@click.stop
	>
		<div class="h-auto m-auto relative mm-netflix-button-padding">
			<div class="relative">
				<div
					class="transform -translate-x-1/2 absolute bottom-2 z-1000010 text-3xl font-extralight text-gray-200 py-2 bg-gray-700 text-transparent rounded-md"
					style="min-width: 20vw"
					:class="{
						['block']: isMenuOppened,
						['hidden group-hover:block']: !isMenuOppened,
					}"
				>
					<DeckSelector
						class="px-5 pt-5"
						:isDeckSelectionShown="isDeckSelectionShown"
						@deck-selector-close="isDeckSelectionShown = false"
						:decksSource="originDeck"
					></DeckSelector>
					<MovieList
						:isShown="isMovieListOpenned"
						@movie-list-close="isMovieListOpenned = false"
					></MovieList>
					<CardsCurrentDeck
						v-if="currentDeck && isCardListShown"
						:isCardListShown="isCardListShown"
						@close-card-list="isCardListShown = false"
					></CardsCurrentDeck>
					<div class="p-5 mh-screen80 scrollbar overflow-y-auto">
						<template v-if="!isMoviePage">
							<MenuCard>
								<div class="flex justify-center flex-col">
									<div
										class="material-icons text-9xl text-gray-500 flex justify-center"
									>
										lightbulb
									</div>
									<div class="text-center">
										Start a movie or an episode to see if it has decks
									</div>
								</div>
							</MenuCard>
							<MenuCard class="mt-5"
								><div class="flex justify-center flex-col">
									<div
										class="material-icons text-9xl text-gray-500 flex justify-center"
									>
										view_list
									</div>
									<mcw-button class="" @click="toggleMovieList()">
										Movies with decks
									</mcw-button>
								</div>
							</MenuCard>
						</template>
						<template v-else-if="currentDeck">
							<MenuCard class="">
								<div class="font-bold">{{ currentDeck.name }}</div>
								<div class="text-gray-400 text-base text-center">
									{{ currentDeck.numberOfCards }} cards
								</div>
								<div class="flex justify-center">
									<mcw-button
										class="mt-5"
										@click="isCardListShown = !isCardListShown"
										outlined
									>
										Card list
									</mcw-button>
								</div>
								<MatSwitch
									class="my-auto mt-5"
									v-model="areCardsHidden_VueModel"
									label="Hide Cards"
								></MatSwitch>
							</MenuCard>
							<MenuCard class="mt-5">
								<div
									class="material-icons text-7xl text-gray-500 flex justify-center"
								>
									work
								</div>
								<div class="text-center">
									{{ decksCurrMovie.length }} available decks for this
									movie/episode
								</div>
								<div class="mt-5 flex justify-center">
									<mcw-button raised @click="toggleDeckSelectorMovie()">
										Select another Deck
									</mcw-button>
								</div>
							</MenuCard>
							<MenuCard class="mt-5">
								<mcw-button class="block mx-auto" @click="toggleMovieList()">
									Movies with decks
								</mcw-button>
							</MenuCard>
						</template>
						<template v-else>
							<!-- movie page but no current deck selected -->
							<template v-if="decksCurrMovie.length == 0">
								<MenuCard class="">
									<div
										class="material-icons text-7xl text-gray-500 flex justify-center"
									>
										work_off
									</div>
									<div class="text-center">
										This movie/episode doesn't have a deck yet.
									</div>
									<div class="flex justify-center">
										<mcw-button
											class="mt-5"
											:disabled="!isLogged"
											@click="createADeck()"
											raised
										>
											Create a deck
										</mcw-button>
										<NewDeck ref="create-deck-popup" class=""></NewDeck>
									</div>
								</MenuCard>
							</template>
							<template v-else>
								<MenuCard class="">
									<div
										class="material-icons text-7xl text-gray-500 flex justify-center"
									>
										work
									</div>
									<div class="text-center">
										{{ decksCurrMovie.length }} available decks for this
										movie/episode
									</div>
									<div class="mt-5 flex justify-center">
										<mcw-button raised @click="toggleDeckSelectorMovie()">
											Select A Deck
										</mcw-button>
									</div>
								</MenuCard>
							</template>
							<MenuCard class="mt-5">
								<mcw-button class="block mx-auto" @click="toggleMovieList()">
									Movies with decks
								</mcw-button>
							</MenuCard>
						</template>
						<MenuCard class="mt-5">
							<div
								class="text-center"
								v-if="!isLogged && decksCurrMovie.length == 0"
							>
								Log In to create a deck
							</div>
							<Login class="mt-5" @open-user-decks="openUserDecks()"></Login>
						</MenuCard>
					</div>
				</div>
			</div>

			<button
				class="material-icons bg-gray-700 rounded-full outline-none focus:outline-none w-16 h-16 m-auto"
				style="outline: none;"
				:class="{
					['ring ring-yellow-700']: isMenuOppened && isMoviePage,
					['ring ring-gray-500']: isMenuOppened && !isMoviePage,
					['bg-yellow-800']: isMoviePage,
				}"
				@click="menuButtonClicked()"
			>
				question_answer
			</button>
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
import CardsCurrentDeck from '@/components/CardsCurrentDeck/CardsCurrentDeck.vue';
import MatSwitch from '@/components/material/MatSwitch.vue';
import DeckSelector from '@/components/DeckSelector/DeckSelector.vue';
import Login from '@/components/User/Login.vue';
import MenuCard from '@/components/Menu/MenuCard.vue';
import axios, { AxiosResponse } from 'axios';
import { DeckApi, DeckApi_WithoutCards } from '@/models/ApiTypes';
import { defineComponent } from 'vue';
import { ActionDeck, MutationDeck } from '@/store/DeckStore';
import { fetchAllDecks, fetchMovies, userInfo } from '@/Utils/WebService';
import { ActionMain, GetterMain, MutationMain } from '@/store/Store';
import NewDeck from '../DeckSelector/NewDeck.vue';
import MovieList from '../MovieList.vue';
import {
	playerSelector,
	titleSelector,
} from '@/chrome-scripts/netflix-selectors';

const MenuItem = defineComponent({
	template: `
		<li
			class=" h-14 flex px-5"
			:class="disabled ? 'text-gray-400' : isActive ? 'bg-white bg-opacity-20 cursor-pointer' : 'hover:bg-white hover:bg-opacity-10 cursor-pointer'"
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
		disabled: {
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
		MenuCard,
		CardsCurrentDeck,
		MatSwitch,
		DeckSelector,
		Login,
		NewDeck,
		MovieList,
	},
})
export default class Menu extends Vue {
	async created() {
		const player = document.querySelector(playerSelector);
		if (!player || !(player instanceof HTMLElement)) {
			throw Error('no player node or unexpected type');
		}
		if (player.classList.contains('active')) {
			this.placeButtonOnPlaceHolder();
			this.isDisplayed = true;
		}
		this.listenToPlayerChanges();
		await this.$store.dispatch(ActionMain.FETCH_USER);
		this.$store.dispatch(ActionDeck.FETCH_DECKS_CURRENT_MOVIE);
	}

	/* -------------------------------------------------------------------------- */
	/*                                store methods                               */
	/* -------------------------------------------------------------------------- */

	get isMoviePage() {
		return this.$store.getters[GetterMain.IS_MOVIE_PAGE];
	}
	get isLogged() {
		return this.$store.getters[GetterMain.IS_LOGGED];
	}
	get userInfo() {
		return this.$store.state.user.info;
	}
	get displayedCards() {
		return this.$store.state.cardModule.displayedCards;
	}

	get currentDeck() {
		return this.$store.state.deckModule.currentDeck;
	}

	get decksCurrMovie() {
		return this.$store.state.deckModule.decksCurrMovie;
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
	isMovieListOpenned = false;
	get isMenuOppened() {
		return (
			this.isMenuForcedOpen ||
			this.isDeckSelectionShown ||
			this.isMovieListOpenned ||
			this.isCardListShown
		);
	}
	async toggleMovieList() {
		this.isMovieListOpenned = !this.isMovieListOpenned;
	}
	toggleDeckSelectorMovie() {
		if (this.originDeck == 'CURRENT_MOVIE') {
			this.isDeckSelectionShown = !this.isDeckSelectionShown;
		} else {
			this.originDeck = 'CURRENT_MOVIE';
			this.$store.dispatch(ActionDeck.FETCH_DECKS_CURRENT_MOVIE);
			this.isDeckSelectionShown = true;
		}
	}
	openUserDecks() {
		if (this.originDeck == 'CURRENT_USER') {
			this.isDeckSelectionShown = !this.isDeckSelectionShown;
		} else {
			this.originDeck = 'CURRENT_USER';
			this.$store.dispatch(ActionDeck.FETCH_DECKS_CURRENT_USER);
			this.isDeckSelectionShown = true;
		}
	}
	menuButtonClicked() {
		if (this.isMenuOppened) {
			this.isMenuForcedOpen = false;
			this.isDeckSelectionShown = false;
			this.isCardListShown = false;
		} else {
			this.isMenuForcedOpen = true;
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                               internal logic                               */
	/* -------------------------------------------------------------------------- */

	isCardListShown = false;
	originDeck: 'CURRENT_USER' | 'CURRENT_MOVIE' = 'CURRENT_MOVIE';
	isDisplayed = false;

	createADeck() {
		(this.$refs['create-deck-popup'] as NewDeck).newDeckPopup();
	}
	/* -------------------------------------------------------------------------- */
	/*                         interaction with host page                         */
	/* -------------------------------------------------------------------------- */
	position = { top: '0px', left: '0px' };

	placeButtonOnPlaceHolder() {
		let menuButtonPlaceHolder = document.querySelector(
			'#meta-movie-menu-button-placeholder'
		);
		if (!menuButtonPlaceHolder) {
			menuButtonPlaceHolder = document.createElement('div');
			if (!(menuButtonPlaceHolder instanceof HTMLElement)) {
				throw new Error('Type error, not HTMLElement');
			}
			menuButtonPlaceHolder.style.height = '52px';
			menuButtonPlaceHolder.style.width = '52px';
			menuButtonPlaceHolder.id = 'meta-movie-menu-button-placeholder';
			if (
				document.querySelector(titleSelector) &&
				document.querySelector<any>(titleSelector).parentNode &&
				document.querySelector<any>(titleSelector).parentNode.nextSibling
			) {
				const rightButtonGroup = document.querySelector<any>(titleSelector)
					.parentNode.nextSibling;
				if (!(rightButtonGroup instanceof HTMLElement)) {
					throw new Error('Type error, not HTMLElement');
				}
				rightButtonGroup?.prepend(menuButtonPlaceHolder);
			}
		}
		const placeHolderPos = menuButtonPlaceHolder.getBoundingClientRect();
		if (placeHolderPos) {
			this.position = {
				top: placeHolderPos.top + 'px',
				left: placeHolderPos.left + 'px',
			};
		}
	}
	listenToPlayerChanges() {
		const player = document.querySelector(playerSelector);
		if (!player) {
			throw Error('no player ' + playerSelector);
		}
		const playerObserver = new MutationObserver(mutationRecords => {
			mutationRecords.forEach(mutationRecord => {
				if (mutationRecord.attributeName == 'class') {
					if (!(mutationRecord.target instanceof HTMLElement)) {
						throw new Error(
							`Expected mutationRecord.target to be an HTMLElement`
						);
					}
					const isPlayerActive = mutationRecord.target.classList.contains(
						'active'
					);
					this.isDisplayed = isPlayerActive;
					if (isPlayerActive) {
						this.placeButtonOnPlaceHolder();
					}
				}
			});
		});
		playerObserver.observe(player, {
			attributes: true,
			attributeOldValue: true,
		});
	}
}
</script>

<style lang="scss">
@use "src/assets/styles/global-styles" as globalStyle; // there was a namespace conflict fixed by the as rename
</style>
<style lang="scss">
@use "src/assets/styles/global-styles" as globalStyle; // there was a namespace conflict fixed by the as rename
</style>
<style scoped lang="scss">
.mm-netflix-button-padding {
	padding-bottom: 0.6em;
}
</style>
