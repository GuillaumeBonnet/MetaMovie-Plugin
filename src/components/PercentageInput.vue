<template>
	<div
		class="border-1 flex items-center text-sm border-solid rounded-lg overflow-hidden bg-gray-900"
		:class="
			readonly ? 'border-gray-500' : 'border-gray-500 hover:border-yellow-600'
		"
	>
		<button
			@click="handleIconClick()"
			class="material-icons focus:outline-none text-xl px-1 pt-1"
			:class="readonly ? 'cursor-default' : ''"
		>
			place
		</button>
		<div
			class="flex-grow inline-flex flex-col px-2 border-solid border-gray-500 border-l-1"
		>
			<label
				class="text-xs whitespace-nowrap flex items-start justify-start mt-0 -mb-1.5"
				>{{ label }}</label
			>
			<input
				ref="input"
				v-model="inputText.value"
				class="w-20 h-8 -mb-2 bg-transparent text-lg font-extrabold border-none focus:outline-none"
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
/*                                    UTILS                                   */
/* -------------------------------------------------------------------------- */
function isValueGood(value: string) {
	if (
		/^\d+((\.|,)\d{0,2})?$/.test(
			value
		) /* number decimal, 2 decimal digit max, coma or point*/
	) {
		const valueAsNumber = Number.parseFloat(value.replace(',', '.'));
		if (valueAsNumber >= 0 && valueAsNumber <= 200) {
			return true;
		}
	}
	return false;
}
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
	onValueChange(newValue: number, oldValue: number) {
		const decPrecis = 2;
		const roundedValue =
			Math.round(this.value * Math.pow(10, decPrecis)) /
			Math.pow(10, decPrecis);
		this.$emit('input', roundedValue);
		this.inputText.value = roundedValue.toString();
	}
	created() {
		this.onValueChange(this.value, this.value);
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
			} else if (isValueGood(value)) {
				this._value = value;
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
		if (isValueGood(this.inputText._value)) {
			this.$emit('input', this.inputText._value);
		}
	}
	handleFocus(event: Event) {
		this.isFocused = true;
	}
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
/*                                    SCSS                                    */
/* -------------------------------------------------------------------------- */
/* @import '~@/styles/variables-and-mixins.scss';
@include input('.percentage');
input {
	width: 4em;
} */
</style>
