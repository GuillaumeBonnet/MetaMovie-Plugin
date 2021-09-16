<template>
	<teleport :to="videoWrapperSelector">
		<div class="mdc-dialog" ref="popup">
			<div class="mdc-dialog__container">
				<div
					class="mdc-dialog__surface overflow-visible"
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
import { videoWrapperSelector } from '@/chrome-scripts/netflix-selectors';
import { MDCDialog, MDCDialogCloseEvent } from '@material/dialog';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: [] })
export default class MatPopup extends Vue {
	confirmCallback?: CallableFunction;
	id!: string;
	videoWrapperSelector = videoWrapperSelector;
	created() {
		this.id = 'MatPopup-' + Date.now();
	}
	mounted() {
		const dialogNode = this.$refs.popup as Element;
		if (dialogNode) {
			this.dialog = new MDCDialog(dialogNode);
			this.dialog?.listen<MDCDialogCloseEvent>('MDCDialog:closing', event => {
				this.confirmCallback && this.confirmCallback(event.detail.action);
			});
		}
	}
	open(confirmCallback?: CallableFunction) {
		this.confirmCallback = confirmCallback;
		this.dialog?.open();
	}
	close() {
		this.dialog?.close();
	}
	beforeUnmount() {
		this.dialog?.destroy();
	}
	dialog?: MDCDialog;
	@Prop({ required: true })
	title!: string;
}
</script>

<style scoped lang="scss">
@use "@material/dialog";
@include dialog.core-styles;
.mdc-dialog {
	--mdc-theme-surface: rgb(24, 26, 27);
	--mdc-theme-primary: rgb(229, 231, 235);
	--mdc-theme-text-primary-on-background: white;
}
</style>
