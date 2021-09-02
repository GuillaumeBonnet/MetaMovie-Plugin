<template>
	<div
		class="border-1 flex items-center text-sm border-solid rounded-lg bg-gray-900"
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
				class="text-xs font-medium whitespace-nowrap flex items-start justify-start mt-0 -mb-1.5"
				>{{ label }}</label
			>
			<input
				ref="input"
				v-model="inputText.value"
				class="w-20 h-8 bg-transparent text-lg font-extrabold border-none focus:outline-none"
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
function isModelValueGood(modelValue: string) {
	if (
		/^\d+((\.|,)\d{0,2})?$/.test(
			modelValue
		) /* number decimal, 2 decimal digit max, coma or point*/
	) {
		const modelValueAsNumber = Number.parseFloat(modelValue.replace(',', '.'));
		if (modelValueAsNumber >= 0 && modelValueAsNumber <= 200) {
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
import { Prop, Watch } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
@Options({
	components: {
		// sub-components
	},
	emits: ['update:modelValue'],
})
export default class PercentageInput extends Vue {
	@Prop({ default: 0 })
	modelValue!: number;
	@Prop()
	label!: string;
	@Prop({ default: false })
	readonly!: boolean;
	@Prop()
	iconCallback!: Function;

	@Watch('modelValue')
	onModelValueChange(newModelValue: number, oldModelValue: number) {
		const decPrecis = 2;
		const roundedModelValue =
			Math.round(newModelValue * Math.pow(10, decPrecis)) /
			Math.pow(10, decPrecis);
		this.$emit('update:modelValue', roundedModelValue);
		this.inputText.value = roundedModelValue.toString();
	}
	isFocused = false;
	inputText = {
		cmpRef: this,
		_value: '' + this.modelValue,
		get value() {
			return this._value;
		},
		set value(value) {
			if (value == '') {
				this._value = value;
			} else if (isModelValueGood(value)) {
				this._value = value;
			}
		},
	};

	handleIconClick() {
		if (this.iconCallback) {
			this.iconCallback();
		} else {
			(this.$refs.input as HTMLInputElement).focus();
		}
	}

	handleBlur(event: Event) {
		this.isFocused = false;
		if (this.inputText.value == '') {
			this.inputText.value = '50';
		}
		if (isModelValueGood(this.inputText.value)) {
			this.$emit('update:modelValue', this.inputText.value);
		}
	}
	handleFocus(event: Event) {
		this.isFocused = true;
	}
}
</script>

<style scoped lang="scss"></style>
