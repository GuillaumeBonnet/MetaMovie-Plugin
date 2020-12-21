<template>
	<div
		:class="[
			{ readonly: readonly },
			isFocused ? 'percentage--focused' : 'percentage',
		]"
	>
		<md-icon @click.native="handleIconClick()">place</md-icon>
		<div class="non-icon-part">
			<label>{{ label }}</label>
			<input
				ref="input"
				v-model="inputText.value"
				class=""
				type="text"
				:disabled="readonly"
				@blur="handleBlur($event)"
				@focus="handleFocus($event)"
			/>
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
	components: {
		// sub-components
	},
})
export default class PercentageInput extends Vue {
	@Prop({ default: 0 })
	value!: number;
	@Prop()
	label!: string;
	@Prop({ default: false })
	readonly!: boolean;

	@Watch('value')
	onValueChange(newValue: string, oldValue: string) {
		this.inputText.value = parseFloat(newValue)
			.toFixed(2)
			.toString();
	}
	created() {
		this.onValueChange(this.value.toString(), '');
	}

	isFocused = false;
	inputText = {
		cmpRef: this,
		_value: '' + this.value || '0',
		get value() {
			return this._value;
		},
		set value(value) {
			if (value == '') {
				this._value = value;
			} else if (
				/^\d+((\.|,)\d{0,2})?$/.test(
					value
				) /* number decimal, 2 decimal digit max, coma or point*/
			) {
				const valueAsNumber = Number.parseFloat(value.replace(',', '.'));
				if (valueAsNumber >= 0 && valueAsNumber <= 200) {
					this._value = value;
					this.cmpRef.$emit('input', valueAsNumber);
				}
			}
		},
	};

	handleIconClick() {
		(this.$refs.input as HTMLInputElement).focus();
	}

	handleBlur(event: Event) {
		this.isFocused = false;
		if (this.inputText.value == '') {
			this.inputText.value = '50';
		}
	}
	handleFocus(event: Event) {
		this.isFocused = true;
	}
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
/*                                    SCSS                                    */
/* -------------------------------------------------------------------------- */
@import '~@/styles/variables-and-mixins.scss';
@include input('.percentage');
input {
	width: 4em;
}
</style>
