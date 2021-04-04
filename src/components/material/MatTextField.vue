<template>
	<label
		ref="mdc-text-field"
		class="mdc-text-field mdc-text-field--outlined"
		:class="disabled ? 'mdc-text-field--disabled' : ''"
	>
		<span class="mdc-notched-outline" :class="disabled ? 'toto' : 'titi'">
			<span class="mdc-notched-outline__leading"></span>
			<span class="mdc-notched-outline__notch">
				<span class="mdc-floating-label" :id="uIlabelId">{{ label }}</span>
			</span>
			<span class="mdc-notched-outline__trailing"></span>
		</span>
		<input
			type="text"
			class="mdc-text-field__input"
			:aria-labelledby="uIlabelId"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
			:required="required"
			:invalid="invalid"
		/>
	</label>
	<div class="mdc-text-field-helper-line">
		<div class="mdc-text-field-helper-text" aria-hidden="true">
			{{ helperText }}
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
import { MDCTextField } from '@material/textfield';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: ['update:modelValue'] })
export default class MatTextField extends Vue {
	uIlabelId!: string;
	created() {
		this.uIlabelId = 'mat-text-field-ui-label-' + Date.now();
	}
	mounted() {
		const textNode = this.$refs['mdc-text-field'] as HTMLElement;
		if (textNode) {
			this.textField = new MDCTextField(textNode);
			if (this.textField) {
				this.textField.disabled = this.disabled;
				this.textField.valid = !this.invalid;
				this.textField.useNativeValidation = !this.ignoreNativeValidation;
			}
		}
	}
	beforeUnmount() {
		this.textField?.destroy();
	}
	textField?: MDCTextField;
	@Prop({ required: true })
	label!: string;
	@Prop({ required: false })
	helperText!: string;
	@Prop({ required: true })
	modelValue!: string;
	@Prop({ required: false, default: false })
	disabled!: boolean;
	@Prop({ required: false, default: false })
	required!: boolean;
	@Prop({ required: false, default: false })
	invalid!: boolean;
	@Prop({ required: false, default: false })
	ignoreNativeValidation!: boolean;
}
</script>

<style scoped lang="scss">
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                                    style                                   */
/* -------------------------------------------------------------------------- */

@use "@material/floating-label/mdc-floating-label";
@use "@material/line-ripple/mdc-line-ripple";
@use "@material/notched-outline/mdc-notched-outline";
@use "@material/textfield";

@include textfield.core-styles;
.mdc-text-field {
	--mdc-theme-error: rgba(127, 29, 29);
	// --mdc-theme-error @apply text-red-900;
	@include textfield.ink-color(white);
	--mdc-typography-subtitle1-font-size: 1.75rem;
	&--outlined {
		& .mdc-floating-label {
			overflow: revert;
		}
		&.mdc-text-field--focused .mdc-notched-outline__notch {
			border-left: none;
			border-right: none;
		}
		&:not(.mdc-text-field--label-floating):not(.mdc-text-field--focused)
			.mdc-floating-label,
		.mdc-text-field__input {
			font-size: 20px;
		}
		&:not(.mdc-text-field--disabled) {
			&:not(.mdc-text-field--focused):not(.mdc-text-field--invalid) {
				& .mdc-floating-label {
					@apply text-yellow-600;
				}
			}
			&:not(.mdc-text-field--invalid).mdc-text-field--focused
				.mdc-floating-label {
				@apply text-yellow-700;
			}
			& + .mdc-text-field-helper-line .mdc-text-field-helper-text {
				@apply text-white;
			}
		}
		&.mdc-text-field--disabled .mdc-floating-label {
			@apply text-gray-400;
		}
		& .mdc-notched-outline .mdc-notched-outline {
			&__leading,
			&__notch,
			&__trailing {
				@apply border-gray-500;
			}
		}
		&:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover
			.mdc-notched-outline
			.mdc-notched-outline {
			&__leading,
			&__notch,
			&__trailing {
				@apply border-yellow-600;
			}
		}
		&:not(.mdc-text-field--disabled).mdc-text-field--focused
			.mdc-notched-outline
			.mdc-notched-outline {
			&__leading,
			&__notch,
			&__trailing {
				@apply border-yellow-700;
			}
		}
	}
}
</style>
