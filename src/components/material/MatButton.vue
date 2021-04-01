<template>
	<button
		:id="id"
		class="mdc-button mdc-button--touch"
		:class="{
			'mdc-button--outlined': type == 'outlined',
			'mdc-button--raised': type == 'raised',
		}"
		:disabled="disabled"
	>
		<span class="mdc-button__ripple"></span>
		<span class="mdc-button__label">{{ label }}</span>
		<span class="mdc-button__touch"></span>
	</button>
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
import { MDCRipple } from '@material/ripple';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: [] })
export default class MatButton extends Vue {
	mounted() {
		const buttonRippleNode = document.querySelector(`#${this.id}`);
		if (buttonRippleNode) {
			this.buttonRipple = new MDCRipple(buttonRippleNode);
		} else {
			console.warn(`Button node #${this.id} not found.`);
		}
	}
	beforeUnmount() {
		this.buttonRipple?.destroy();
	}
	buttonRipple?: MDCRipple;
	@Prop({ required: true })
	id!: string;
	@Prop({ required: true })
	label!: string;
	@Prop()
	type!: '' | 'outlined' | 'raised';
	@Prop()
	disabled!: boolean;
}
</script>

<style scoped lang="scss">
@use "@material/button/mixins";
@include mixins.core-styles;
button.mdc-button.mdc-button {
	@apply border-gray-400;
	&:hover {
		@apply border-gray-300;
	}
	&[disabled] {
		@apply text-gray-500;
		@apply border-gray-600;
	}
}
</style>
