<template>
	<div class="">
		<MatPopup ref="popup-new-deck" title="New Deck pop-up">
			<div class="popup-new-deck">
				Start a new deck for this movie:
				<div class="p-4">
					<MatTextField
						v-model="newDeck.name"
						label="Name"
						required="true"
					></MatTextField>
				</div>
				<div class="p-4 overflow-visible">
					<mcw-select
						v-model="newDeck.languageTag"
						label="Language"
						helptext="Pick a language"
						leading-icon="language"
					>
						<mcw-list-item
							v-for="elem in langSelectData"
							:key="elem.value"
							:data-value="elem.value"
							role="option"
							icon
							>{{ elem.label }}</mcw-list-item
						>
					</mcw-select>
				</div>
				<div class="text-red-600" v-if="errorMessage">
					{{ errorMessage }}
				</div>
			</div>
			<template v-slot:actions>
				<mcw-button
					outlined
					data-mdc-dialog-action="cancel"
					class="mdc-dialog__button"
					>Cancel</mcw-button
				>
				<mcw-button
					@click="createDeck()"
					outlined
					class="mdc-dialog__button"
					:disabled="!newDeck.name"
					>Create Deck</mcw-button
				>
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
import { DeckApi_WithoutCards } from '@/models/ApiTypes';
import { axiosErrorMessage } from '@/Utils/MainUtils';
import langSelectData from './langSelectData';
@Options({
	components: { MatPopup, MatTextField },
})
export default class NewDeck extends Vue {
	newDeck: Pick<DeckApi_WithoutCards, 'languageTag' | 'name'> = {
		languageTag: 'en',
		name: '',
	};
	errorMessage = '';
	newDeckPopup() {
		(this.$refs['popup-new-deck'] as MatPopup).open();
	}
	langSelectData = langSelectData;
	async createDeck() {
		this.errorMessage = '';
		let newDeck;
		try {
			newDeck = await this.$store.dispatch(
				ActionDeck.CREATE_DECK,
				this.newDeck
			);
		} catch (e) {
			this.errorMessage = axiosErrorMessage(e);
			return;
		}
		if (
			!this.$store.state.deckModule.currentDeck ||
			!this.$store.state.deckModule.currentDeck.hasLocalModifs
		) {
			this.$store.dispatch(ActionDeck.SET_CURRENT_DECK_ACTION, newDeck);
		}
		(this.$refs['popup-new-deck'] as MatPopup)?.close();
	}
}
</script>

<style lang="scss">
@use "src/assets/styles/global-styles" as globalStyle; // there was a namespace conflict fixed by the as rename
div[aria-labelledby='New Deck pop-up'] {
	&.mdc-dialog__surface,
	& .mdc-dialog__surface > div,
	& ul.mdc-list,
	& .mdc-select,
	& .select-wrapper {
		overflow: visible !important;
	}
	& .mdc-menu-surface--open {
		max-height: 25vh !important;
	}
}
</style>

<style scoped lang="scss"></style>
