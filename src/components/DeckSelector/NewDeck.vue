<template>
	<div class="">
		<button
			class="bg-gray-600 hover:bg-gray-800 mt-2 p-3 w-full rounded-md border border-solid border-gray-800"
			@click="newDeckPopup()"
		>
			Create Deck
		</button>
		<MatPopup id="popup-new-deck" ref="popup-new-deck" title="New Deck pop-up">
			Deck has unsaved modifications
			<MatTextField id="text-field-deck-name"></MatTextField> todo
			<input v-model="newDeck.name" placeholder="Name" />
			<p>Message is: {{ newDeck.name }}</p>
			<input v-model="newDeck.languageTag" placeholder="Language" />
			<template v-slot:actions>
				<button
					type="button"
					class="mdc-button mdc-button--outlined mdc-dialog__button"
					data-mdc-dialog-action="cancel"
				>
					<div class="mdc-button__ripple"></div>
					<span class="mdc-button__label">Cancel</span>
				</button>
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
import { DeckData } from '@/models/DeckData';
@Options({
	components: { MatPopup, MatTextField },
})
export default class NewDeck extends Vue {
	newDeck: Pick<DeckData, 'languageTag' | 'name'> = {
		languageTag: '',
		name: '',
	};
	newDeckPopup() {
		(this.$refs['popup-new-deck'] as MatPopup).open();
	}
}
</script>

<style scoped lang="scss"></style>
