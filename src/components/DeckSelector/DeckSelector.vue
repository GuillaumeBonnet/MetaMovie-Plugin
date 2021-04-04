<template>
	<div class="border-4 border-solid border-gray-900 rounded-md m-4 p-3">
		<MatPopup
			ref="popup-deck-selector-modifications"
			title="Deck has unsaved modifications."
		>
			Deck has unsaved modifications
			<template v-slot:actions>
				<MatButton
					label="Cancel"
					type="outlined"
					data-mdc-dialog-action="cancel"
					class="mdc-dialog__button m-2"
				></MatButton>
				<MatButton
					label="Discard ?"
					type="outlined"
					data-mdc-dialog-action="discard"
					class="mdc-dialog__button m-2"
				></MatButton>
				<MatButton
					label="Save ?"
					type="outlined"
					data-mdc-dialog-action="save"
					class="mdc-dialog__button m-2"
				></MatButton>
			</template>
		</MatPopup>
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
			class="width-deck-selector p-6 absolute bottom-0 transform custom-translate-list rounded-md bg-gray-700"
		>
			<button
				class="block ml-auto material-icons rounded-md w-12 h-12 text-3xl  hover:shadow-sm outline-none focus:outline-none bg-gray-600 hover:bg-gray-800 border-1 border-solid border-gray-900 hover:shadow transform transition-transform duration-300 ease-in-out"
				@click="closeButton()"
				@mousedown.stop
			>
				close
			</button>
			<NewDeck class="my-8"></NewDeck>
			<div class="underline mb-4 mt-8">Available decks:</div>
			<MatPopup
				ref="popup-deck-selector-modifications"
				title="Deck has unsaved modifications."
			>
				Deck has unsaved modifications
				<template v-slot:actions>
					<button
						type="button"
						class="mdc-button mdc-button--outlined mdc-dialog__button"
						data-mdc-dialog-action="cancel"
					>
						<div class="mdc-button__ripple"></div>
						<span class="mdc-button__label">Cancel</span>
					</button>
					<button
						type="button"
						class="mdc-button mdc-button--outlined mdc-dialog__button"
						data-mdc-dialog-action="discard"
					>
						<div class="mdc-button__ripple"></div>
						<span class="mdc-button__label">Discard ?</span>
					</button>
					<button
						type="button"
						class="mdc-button mdc-button--outlined mdc-dialog__button"
						data-mdc-dialog-action="save"
					>
						<div class="mdc-button__ripple"></div>
						<span class="mdc-button__label">Save ?</span>
					</button>
				</template>
			</MatPopup>
			<table class=" w-full text-3xl table-auto border-1 border-black">
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
import { ActionDeck } from '@/store/DeckStore';
import MatPopup from '@/components/material/MatPopup.vue';
import MatButton from '@/components/material/MatButton.vue';
import NewDeck from '@/components/DeckSelector/NewDeck.vue';
@Options({
	components: { MatPopup, NewDeck, MatButton },
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
	async rowClicked(index: number) {
		if (this.decks && this.currentDeck?.id == this.decks[index].id) {
			return;
		}
		if (this.currentDeck && this.currentDeck.hasLocalModifs) {
			(this.$refs['popup-deck-selector-modifications'] as MatPopup).open(
				async (eventName: 'close' | 'discard' | 'save') => {
					console.log('gboDebug:[eventName]', eventName);
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
.width-deck-selector {
	width: 150%;
}
</style>
