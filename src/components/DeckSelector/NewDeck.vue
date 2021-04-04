<template>
	<div class="">
		<button
			class="bg-gray-600 hover:bg-gray-800 mt-2 p-3 w-full rounded-md border border-solid border-gray-800"
			@click="newDeckPopup()"
		>
			Create Deck
		</button>
		<MatPopup ref="popup-new-deck" title="New Deck pop-up">
			Start a new deck for this movie:
			<div class="p-4">
				<MatTextField
					v-model="newDeck.name"
					label="Name"
					required="true"
				></MatTextField>
			</div>
			<div class="p-4">
				<MatTextField
					v-model="newDeck.languageTag"
					label="Language"
				></MatTextField>
			</div>
			<template v-slot:actions>
				<MatButton
					label="Cancel"
					type="outlined"
					data-mdc-dialog-action="cancel"
					class="mdc-dialog__button"
				></MatButton>
				<MatButton
					label="Create Deck"
					type="outlined"
					@click="createDeck()"
					class="mdc-dialog__button"
					:disabled="!newDeck.name"
				></MatButton>
			</template>
		</MatPopup>
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
import MatTextField from '@/components/material/MatTextField.vue';
import MatButton from '@/components/material/MatButton.vue';
import { DeckData } from '@/models/DeckData';
@Options({
	components: { MatPopup, MatTextField, MatButton },
})
export default class NewDeck extends Vue {
	newDeck: Pick<DeckData, 'languageTag' | 'name'> = {
		languageTag: '',
		name: '',
	};
	newDeckPopup() {
		(this.$refs['popup-new-deck'] as MatPopup).open();
	}
	async createDeck() {
		const newDeck = await this.$store.dispatch(
			ActionDeck.CREATE_DECK,
			this.newDeck
		);
		if (
			!this.$store.state.deckModule.currentDeck ||
			!this.$store.state.deckModule.currentDeck.hasLocalModifs
		) {
			this.$store.dispatch(ActionDeck.SET_CURRENT_DECK_ACTION, newDeck);
		}
		(this.$refs['popup-new-deck'] as MatPopup).close();
	}
}
</script>

<style scoped lang="scss">
@use "@material/dialog";
@include dialog.core-styles;
</style>
