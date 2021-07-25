<template>
	<div class="">
		<MatPopup
			ref="popup-deck-selector-modifications"
			title="Deck has unsaved modifications."
		>
			<div>
				Deck <span class="italic">{{ currentDeck?.name }}</span> has unsaved
				modifications
			</div>
			<template v-slot:actions>
				<mcw-button
					outlined
					data-mdc-dialog-action="cancel"
					class="mdc-dialog__button m-2"
					>Cancel</mcw-button
				>
				<mcw-button
					outlined
					data-mdc-dialog-action="discard"
					class="mdc-dialog__button m-2"
					>Discard ?</mcw-button
				>
				<mcw-button
					outlined
					data-mdc-dialog-action="save"
					class="mdc-dialog__button m-2"
					>Save ?</mcw-button
				>
			</template>
		</MatPopup>
		<div
			v-if="isDeckSelectionShown"
			class="min-width-deck-selector p-6 absolute bottom-0 transform custom-translate-list rounded-md bg-gray-700"
		>
			<button
				class="block ml-auto material-icons rounded-md w-12 h-12 text-3xl  hover:shadow-sm outline-none focus:outline-none bg-gray-600 hover:bg-gray-800 border-1 border-solid border-gray-900 hover:shadow transform transition-transform duration-300 ease-in-out"
				@click="closeButton()"
				@mousedown.stop
			>
				close
			</button>
			<button
				class="bg-gray-600 hover:bg-gray-800 mt-2 p-3 w-full rounded-md border border-solid border-gray-800"
				@click="newDeckPopup()"
			>
				Create Deck
			</button>
			<NewDeck
				ref="new-deck-popup"
				v-if="canCreateDecks"
				class="my-8"
			></NewDeck>
			<template v-if="isMoviePage || decksSource == 'CURRENT_USER'">
				<div class="underline mb-4 mt-8">
					<template v-if="decksSource == 'CURRENT_MOVIE'">
						Decks for the current movie:
					</template>
					<template v-else-if="decksSource == 'CURRENT_USER'">
						Your decks:
					</template>
				</div>
				<table class=" w-full text-3xl table-auto border-1 border-black">
					<thead class="text-gray-900 bg-gray-500 border-b-1 border-black">
						<tr>
							<th class="px-4 py-2 font-extrabold">Title</th>
							<th class="px-4 py-2 font-extrabold">Language</th>
							<th class="px-4 py-2 font-extrabold">Number of cards</th>
							<th
								v-if="decksSource == 'CURRENT_USER'"
								class="px-4 py-2 font-extrabold"
							>
								Movie
							</th>
							<th
								v-if="decksSource == 'CURRENT_MOVIE'"
								class="px-4 py-2 font-extrabold"
							>
								Author
							</th>
						</tr>
					</thead>
					<tbody class="text-center text-gray-200">
						<tr
							class="border-b-1 border-black font-medium bg-gray-500"
							v-for="(deck, index) in decks"
							:class="{
								['bg-gray-700 hover:bg-gray-800']:
									currentDeck?.id == deck.id && isDeckCurrentMovie(deck),
								['hover:bg-gray-600']:
									currentDeck?.id != deck.id && isDeckCurrentMovie(deck),
								['cursor-pointer']: isDeckCurrentMovie(deck),
								['text-gray-800 ']: !isDeckCurrentMovie(deck),
							}"
							:key="deck.id"
							@click="rowClicked(index)"
						>
							<td class="px-4 py-2 border-r-0">
								{{ deck.name }}
							</td>
							<td class="px-4 py-2 border-l-0">
								{{ countryLabel(deck.languageTag) }}
							</td>
							<td class="px-4 py-2 border-l-0">
								{{ deck.numberOfCards }}
							</td>
							<td
								class="px-4 py-2 border-l-0"
								v-if="decksSource == 'CURRENT_MOVIE'"
							>
								{{ deck.ownerName }}
							</td>
							<td
								class="px-4 py-2 border-l-0"
								v-if="decksSource == 'CURRENT_USER'"
							>
								<a
									class="underline text-white"
									:href="`${rootUrl}/watch/${deck.movie.id}`"
									>{{ deck.movie.title }}</a
								>
							</td>
						</tr>
					</tbody>
				</table>
			</template>
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
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { ActionDeck } from '@/store/DeckStore';
import MatPopup from '@/components/material/MatPopup.vue';
import NewDeck from '@/components/DeckSelector/NewDeck.vue';
import { GetterMain } from '@/store/Store';
import langSelectData from './langSelectData';
import { DeckApi_WithoutCards } from '@/models/ApiTypes';
@Options({
	components: { MatPopup, NewDeck },
	emits: ['deck-selector-close'],
})
export default class DeckSelector extends Vue {
	get decksCurrMovie() {
		return this.$store.state.deckModule.decksCurrMovie;
	}
	get decksCurrUser() {
		return this.$store.state.deckModule.decksCurrUser;
	}
	get decks() {
		if (this.decksSource == 'CURRENT_MOVIE') {
			return this.decksCurrMovie;
		} else {
			return this.decksCurrUser;
		}
	}
	get currentDeck() {
		return this.$store.state.deckModule.currentDeck;
	}
	get canCreateDecks() {
		return this.$store.getters[GetterMain.IS_LOGGED];
	}

	get isMoviePage() {
		return this.$store.getters[GetterMain.IS_MOVIE_PAGE];
	}

	get rootUrl() {
		return window.location.origin;
	}

	@Prop()
	isDeckSelectionShown!: boolean;
	@Prop()
	decksSource: 'CURRENT_MOVIE' | 'CURRENT_USER' = 'CURRENT_MOVIE';

	closeButton() {
		this.$emit('deck-selector-close');
	}
	newDeckPopup() {
		(this.$refs['new-deck-popup'] as NewDeck).newDeckPopup();
	}
	countryLabel(countryCode: string | null) {
		return (
			langSelectData.find(elem => elem.value == countryCode)?.label ||
			countryCode
		);
	}

	isDeckCurrentMovie(deck: DeckApi_WithoutCards) {
		return deck.movie.id == this.$store.state.movieId;
	}
	async rowClicked(index: number) {
		if (
			(this.decks && this.currentDeck?.id == this.decks[index].id) ||
			!this.isDeckCurrentMovie(this.decks[index])
		) {
			return;
		}
		if (this.currentDeck && this.currentDeck.hasLocalModifs) {
			(this.$refs['popup-deck-selector-modifications'] as MatPopup).open(
				async (eventName: 'close' | 'discard' | 'save') => {
					if (eventName == 'discard') {
						await this.$store.dispatch(ActionDeck.REFRESH_CURRENT_DECK);
						await this.$store.dispatch(
							ActionDeck.SET_CURRENT_DECK_ACTION,
							this.decks[index]
						);
					} else if (eventName == 'save') {
						await this.$store.dispatch(ActionDeck.SAVE_CURRENT_DECK);
						await this.$store.dispatch(
							ActionDeck.SET_CURRENT_DECK_ACTION,
							this.decks[index]
						);
					}
				}
			);
		} else {
			this.$store.dispatch(
				ActionDeck.SET_CURRENT_DECK_ACTION,
				this.decks[index]
			);
		}
	}
}
</script>

<style scoped lang="scss">
.custom-translate-list {
	transform: translateX(-110%);
}
.min-width-deck-selector {
	min-width: 150%;
}
</style>
