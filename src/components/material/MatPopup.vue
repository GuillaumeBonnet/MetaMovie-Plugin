<template>
	<teleport to=".sizing-wrapper">
		<div class="mdc-dialog" :id="id">
			<div class="mdc-dialog__container">
				<div
					class="mdc-dialog__surface"
					role="alertdialog"
					aria-modal="true"
					:aria-labelledby="title"
					:aria-describedby="id + '-content'"
				>
					<div class="p-10 text-2xl" :id="id + '-content'">
						<slot></slot>
					</div>
					<div class="mdc-dialog__actions">
						<slot name="actions">
							<button
								type="button"
								class="mdc-button mdc-button--outlined mdc-dialog__button"
								data-mdc-dialog-action="close"
							>
								<div class="mdc-button__ripple"></div>
								<span class="mdc-button__label">Cancel</span>
							</button>
							<button
								type="button"
								class="mdc-button mdc-button--outlined mdc-dialog__button "
								data-mdc-dialog-action="confirm"
							>
								<div class="mdc-button__ripple"></div>
								<span class="mdc-button__label">Confirm</span>
							</button>
						</slot>
					</div>
				</div>
			</div>
			<div class="mdc-dialog__scrim"></div>
		</div>
	</teleport>
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
import { MDCDialog, MDCDialogCloseEvent } from '@material/dialog';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: ['confirm'] })
export default class MatPopup extends Vue {
	confirmCallback?: CallableFunction;
	mounted() {
		const dialogNode = document.querySelector(`#${this.id}`);
		if (dialogNode) {
			this.dialog = new MDCDialog(dialogNode);
			this.dialog?.listen<MDCDialogCloseEvent>('MDCDialog:closing', event => {
				this.confirmCallback && this.confirmCallback(event.detail.action);
			});
		} else {
			console.warn(`Popup node #${this.id} not found.`);
		}
	}
	open(confirmCallback?: CallableFunction) {
		this.confirmCallback = confirmCallback;
		this.dialog?.open();
	}
	beforeUnmount() {
		this.dialog?.destroy();
	}
	dialog?: MDCDialog;
	@Prop({ required: true })
	id!: string;
	@Prop({ required: true })
	title!: string;
}
</script>

<style scoped lang="postcss">
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                    postcss                                 */
/* -------------------------------------------------------------------------- */
.mdc-dialog {
	--mdc-theme-surface: rgb(107, 114, 128);
	--mdc-theme-primary: rgb(229, 231, 235);
	--mdc-theme-text-primary-on-background: white;
}
</style>
