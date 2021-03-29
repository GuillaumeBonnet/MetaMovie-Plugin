<template>
	<div class="">
		<button
			class="bg-gray-600 hover:bg-gray-800 mt-2 p-3 w-full rounded-md border border-solid border-gray-800"
			@click="newDeckPopup()"
		>
			Create Deck
		</button>
		<MatPopup id="popup-new-deck" ref="popup-new-deck" title="New Deck pop-up">
			Start a new deck for this movie:
			<div class="p-4">
				<MatTextField
					v-model="newDeck.name"
					id="text-field-deck-name"
					label="Name"
					required="true"
				></MatTextField>
			</div>
			<div class="p-4">
				<MatTextField
					v-model="newDeck.languageTag"
					id="text-field-deck-language"
					label="Language"
				></MatTextField>
			</div>
			<template v-slot:actions>
				<MatButton
					id="button-validate-new-deck"
					label="Create Deck"
					type="outlined"
					@click="createDeck()"
					class="mdc-dialog__button"
					:disabled="!newDeck.name"
				></MatButton>
				<MatButton
					id="button-cancel-new-deck"
					label="Cancel"
					type="outlined"
					data-mdc-dialog-action="cancel"
					class="mdc-dialog__button"
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
	createDeck() {
		if (!this.newDeck.name) {
			console.log('Name is required');
		}
		console.log('gboDebug:[this.newDeck]', this.newDeck);
	}
}
</script>

<style scoped lang="scss">
@use "@material/dialog";
@include dialog.core-styles;
</style>
