<template>
	<div class="border-4 border-solid border-gray-900 rounded-md m-4 p-3">
		<div class="underline">
			Current deck:
		</div>
		<div class="px-2">
			<button
				class="bg-gray-600 hover:bg-gray-800 mt-2 p-3 w-full rounded-md border border-solid border-gray-800"
				@click="handleButtonClick()"
			>
				<template v-if="!currentDeck">Select a deck</template>
				<template v-else>{{ currentDeck?.name }}</template>
			</button>
		</div>
		<div
			v-if="isDeckSelectionShown"
			class="p-6 absolute transform custom-translate-list rounded-md bg-gray-700"
		>
			<button
				class="block ml-auto material-icons rounded-md w-12 h-12 text-3xl  hover:shadow-sm outline-none focus:outline-none bg-gray-600 hover:bg-gray-800 border-1 border-solid border-gray-900 hover:shadow transform transition-transform duration-300 ease-in-out"
				@click="closeButton()"
				@mousedown.stop
			>
				close
			</button>
			<div class="underline mb-4">Available decks:</div>
			<table class="text-3xl table-auto border-1 border-black">
				<thead class="text-gray-900 bg-gray-500 border-b-1 border-black">
					<tr>
						<th class="px-4 py-2 font-extrabold">Title</th>
						<th class="px-4 py-2 font-extrabold">Language</th>
					</tr>
				</thead>
				<tbody class="text-center text-gray-200">
					<tr
						class="border-b-1 border-black font-medium"
						v-for="(deck, index) in decks"
						:class="
							currentDeck?.id == deck.id
								? 'bg-gray-700 hover:bg-gray-800'
								: 'bg-gray-500 hover:bg-gray-600'
						"
						:key="deck.id"
						@click="rowClicked(index)"
					>
						<td class="px-4 py-2 border-r-0">
							{{ deck.name }}
						</td>
						<td class="px-4 py-2 border-l-0">
							{{ deck.languageTag }}
						</td>
					</tr>
				</tbody>
			</table>
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
import { MutationDeck } from '@/store/DeckStore';
import axios, { AxiosResponse } from 'axios';
import { DeckApi } from '@/models/ApiTypes';
import CardData from '@/models/CardData';
import { MutationCard } from '@/store/CardStore';
@Options({
	components: {},
	emits: ['deck-selector-button-clicked', 'deck-selector-close'],
})
export default class DeckSelector extends Vue {
	get decks() {
		return this.$store.state.deckModule.decks;
	}
	get currentDeck() {
		return this.$store.state.deckModule.currentDeck;
	}
	@Prop()
	isDeckSelectionShown!: boolean;

	handleButtonClick() {
		this.$emit('deck-selector-button-clicked');
	}
	closeButton() {
		this.$emit('deck-selector-close');
	}
	rowClicked(index: number) {
		if (this.currentDeck && this.currentDeck.hasLocalModifs) {
			alert('Discard modifications ?');
		} else {
			this.$store.commit(MutationDeck.SET_CURRENT_DECK, this.decks[index]);
			axios
				.get(`${process.env.VUE_APP_API_URL}/decks/${this.decks[index].id}`)
				.then((deck: AxiosResponse<DeckApi>) => {
					const cards: CardData[] = deck.data.cards.map(card => {
						return new CardData({
							fromStamp: card.from,
							toStamp: card.to,
							x: card.position.x,
							y: card.position.y,
							text: card.text,
							id: card.id,
						});
					});
					this.$store.commit(MutationCard.SET_CARDS, cards);
					this.$store.commit(MutationCard.SET_DISPLAYED_CARDS, []);
				});
		}
	}
}
</script>

<style scoped lang="postcss">
.custom-translate-list {
	transform: translateX(-120%);
}
</style>
