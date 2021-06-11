<template>
	<label
		ref="mdc-text-field"
		class="mdc-text-field mdc-text-field--outlined w-full"
		:class="{
			'mdc-text-field--disabled': disabled,
			'mdc-text-field--with-leading-icon': leadingIcon,
			'mdc-text-field--with-trailing-icon': _trailingIcon,
		}"
	>
		<span class="mdc-notched-outline" :class="disabled ? 'toto' : 'titi'">
			<span class="mdc-notched-outline__leading"></span>
			<span class="mdc-notched-outline__notch">
				<span class="mdc-floating-label" :id="labelId">{{ label }}</span>
			</span>
			<span class="mdc-notched-outline__trailing"></span>
		</span>
		<i
			ref="mdc-text-leading-icon"
			v-if="leadingIcon"
			class="material-icons mdc-text-field__icon mdc-text-field__icon--leading"
			>{{ leadingIcon }}</i
		>
		<input
			:type="InnerType"
			class="mdc-text-field__input"
			:aria-labelledby="labelId"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
			:required="required"
			:invalid="invalid"
		/>
		<i
			ref="mdc-text-trailing-icon"
			v-if="_trailingIcon"
			class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
			tabindex="0"
			role="button"
			@mousedown="showPassword()"
			@mouseup="hidePassword()"
			@mouseout="hidePassword()"
			>{{ _trailingIcon }}</i
		>
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
import { MDCTextField, MDCTextFieldIcon } from '@material/textfield';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: ['update:modelValue'] })
export default class MatTextField extends Vue {
	labelId!: string;
	InnerType = '';
	created() {
		this.labelId = 'mat-text-field-ui-label-' + Date.now();
		this.InnerType = this.type;
	}

	get _trailingIcon() {
		if (this.trailingIcon) {
			return this.trailingIcon;
		} else if (this.type == 'password') {
			return 'visibility';
		} else {
			return null;
		}
	}

	showPassword() {
		if (this.type == 'password') {
			this.InnerType = 'text';
		}
	}
	hidePassword() {
		if (this.type == 'password') {
			this.InnerType = 'password';
		}
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

		const leadingIconNode = this.$refs['mdc-text-leading-icon'] as HTMLElement;
		if (leadingIconNode) {
			new MDCTextFieldIcon(leadingIconNode);
		}

		const trailingIconNode = this.$refs[
			'mdc-text-trailing-icon'
		] as HTMLElement;
		if (trailingIconNode) {
			new MDCTextFieldIcon(trailingIconNode);
		}
	}
	beforeUnmount() {
		this.textField?.destroy();
	}
	textField?: MDCTextField;
	@Prop({ required: true, default: 'text' })
	type!: 'text' | 'password';
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
	@Prop({ required: false, default: false })
	leadingIcon!: string;
	@Prop({ required: false, default: false })
	trailingIcon!: string;
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
@use "@material/textfield/icon";

@include textfield.core-styles;
@include icon.icon-core-styles;
.mdc-text-field {
	&.mdc-text-field.mdc-text-field i {
		@apply text-white;
	}
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
