<template>
	<div
		v-if="currentDeck"
		class="cursor-pointer group-currentDeckAction flex-grow p-5 rounded-md bg-gray-500 m-3 flex align-middle justify-center h-full"
		@click="deleteDeck()"
		aria-describedby="tooltip-delete-deck"
	>
		<MatTooltip
			id="tooltip-delete-deck"
			label="Delete current deck"
		></MatTooltip>
		<MatPopup ref="popup-delete-deck" title="Confirm deck supression">
			<div class="text-center text-3xl mb-8 select-text">
				Delete deck: <span class="italic">{{ currentDeck.name }}</span>
			</div>
			<div class="select-text">Type "{{ currentDeck.name }}" to confirm:</div>
			<div class="flex justify-center content-end mt-10 -mb-10">
				<div class="">
					<MatTextField
						v-model="confirmationInput"
						label="Confirmation"
					></MatTextField>
				</div>
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
					:disabled="confirmationInput != currentDeck.name"
					data-mdc-dialog-action="confirm"
					class="mdc-dialog__button m-2"
					>Confirm</mcw-button
				>
			</template>
		</MatPopup>
		<div
			class="material-icons text-gray-300 group-currentDeckAction-hover:text-white "
		>
			delete
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
import MatTooltip from '@/components/material/MatTooltip.vue';
import MatPopup from '@/components/material/MatPopup.vue';
import MatTextField from '@/components/material/MatTextField.vue';
import { ActionDeck } from '@/store/DeckStore';
@Options({
	components: { MatTooltip, MatPopup, MatTextField },
})
export default class DeleteDeckConfirmation extends Vue {
	get currentDeck() {
		return this.$store.state.deckModule.currentDeck;
	}

	confirmationInput = '';

	deleteDeck() {
		if (!this.currentDeck) {
			return;
		}
		this.confirmationInput = '';
		(this.$refs['popup-delete-deck'] as MatPopup).open(
			(actionName: 'confirm' | 'close' | 'cancel') => {
				if (actionName == 'confirm') {
					this.$store.dispatch(ActionDeck.DELETE_CURRENT_DECK);
				}
			}
		);
	}
}
</script>

<style scoped lang="postcss"></style>
