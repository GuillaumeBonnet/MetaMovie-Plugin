<template>
	<label class="mdc-text-field mdc-text-field--filled">
		<span class="mdc-text-field__ripple"></span>
		<span class="mdc-floating-label" id="my-label-id">Hint text</span>
		<input
			class="mdc-text-field__input"
			type="text"
			aria-labelledby="my-label-id"
		/>
		<span class="mdc-line-ripple"></span> </label
></template>

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
import { MDCTextField } from '@material/textfield';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: ['confirm'] })
export default class MatTextField extends Vue {
	mounted() {
		const textNode = document.querySelector(`#${this.id}`);
		if (textNode) {
			this.textField = new MDCTextField(textNode);
		} else {
			console.warn(`MatTextField node #${this.id} not found.`);
		}
	}
	beforeUnmount() {
		this.textField?.destroy();
	}
	textField?: MDCTextField;
	@Prop({ required: true })
	id!: string;
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
