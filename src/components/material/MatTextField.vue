<template>
	<label :id="id" class="mdc-text-field mdc-text-field--outlined">
		<span class="mdc-notched-outline">
			<span class="mdc-notched-outline__leading"></span>
			<span class="mdc-notched-outline__notch">
				<span class="mdc-floating-label" id="my-label-id">Your Name</span>
			</span>
			<span class="mdc-notched-outline__trailing"></span>
		</span>
		<input
			type="text"
			class="mdc-text-field__input"
			aria-labelledby="my-label-id"
		/>
	</label>
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

<style scoped lang="scss">
@use "@material/floating-label/mdc-floating-label";
@use "@material/line-ripple/mdc-line-ripple";
@use "@material/notched-outline/mdc-notched-outline";
@use "@material/textfield";

@include textfield.core-styles;
</style>
