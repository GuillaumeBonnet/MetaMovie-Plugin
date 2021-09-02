<template>
	<div
		class="border-1 flex items-center text-sm border-solid rounded-lg bg-gray-900"
		:class="
			timeInputs.isOneOrMoreFocused
				? 'border-yellow-600'
				: readonly
				? 'border-gray-500'
				: 'border-gray-500 hover:border-yellow-600'
		"
	>
		<button
			@click="handleIconClick()"
			class="material-icons focus:outline-none text-xl px-1 pt-1"
			:class="readonly ? 'cursor-default' : ''"
		>
			schedule
		</button>
		<div class="flex-grow pr-1 border-solid border-gray-500 border-l-1">
			<label class="text-xs font-medium flex items-start ml-1 mt-0 -mb-1.5">{{
				label
			}}</label>
			<div class="flex">
				<input
					@click="digitClicked($event)"
					@blur="handleBlur($event, 'hours')"
					@focus="handleFocus($event, 'hours')"
					v-model="timeInputs.hours.value"
					ref="hours"
					class="text-center w-6 h-8 bg-transparent text-lg font-extrabold border-none focus:outline-none"
					type="text"
					:disabled="readonly"
				/>
				<div class="flex items-center text-2xl">:</div>
				<input
					@click="digitClicked($event)"
					@blur="handleBlur($event, 'minutes')"
					@focus="handleFocus($event, 'minutes')"
					v-model="timeInputs.minutes.value"
					class="text-center w-8 h-8 bg-transparent text-lg font-extrabold border-none focus:outline-none"
					type="text"
					:disabled="readonly"
				/>
				<div class="flex items-center text-2xl">:</div>
				<input
					@click="digitClicked($event)"
					@blur="handleBlur($event, 'seconds')"
					@focus="handleFocus($event, 'seconds')"
					v-model="timeInputs.seconds.value"
					class="text-center w-8 h-8 bg-transparent text-lg font-extrabold border-none focus:outline-none"
					type="text"
					:disabled="readonly"
				/>
			</div>
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
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
	components: {
		// sub-components
	},
	emits: ['update:modelValue'],
})
export default class TimeSelector extends Vue {
	created() {
		this.onModelValueChange(this.modelValue, '');
	}
	@Prop()
	label!: string;
	@Prop()
	modelValue!: string;
	@Prop({ default: false })
	readonly!: boolean;
	@Prop()
	iconCallback!: Function;
	@Watch('modelValue')
	onModelValueChange(newModelValue: string, oldModelValue: string) {
		if (/\d+:\d+:\d+/.test(newModelValue)) {
			// Destructuring assignment
			const [hours, minutes, seconds] = newModelValue.split(':');
			this.timeInputs.hours.setNoEmit(hours);
			this.timeInputs.minutes.setNoEmit(minutes);
			this.timeInputs.seconds.setNoEmit(seconds);
		} else {
			console.warn(
				`TimeSelector input modelvalue is wrong: (${newModelValue})`
			);
		}
	}

	emit() {
		const emitModelValue = `${this.timeInputs.hours.value}:${this.timeInputs.minutes.value}:${this.timeInputs.seconds.value}`;
		if (/\d:\d\d:\d\d/.test(emitModelValue)) {
			this.$emit('update:modelValue', emitModelValue);
		}
	}

	digitClicked(event: MouseEvent) {
		(event.target as HTMLInputElement).select();
	}
	timeInputs = {
		isOneOrMoreFocused: false,
		hours: {
			isFocused: false,
			cmpRef: this,
			_value: '0',
			isValid(value: string) {
				return (
					value == '' ||
					(value.length <= 1 &&
						!Number.isNaN(Number.parseInt(value)) &&
						Number.parseInt(value) >= 0 &&
						Number.parseInt(value) <= 9)
				);
			},
			get value() {
				return this._value;
			},
			set value(value) {
				if (this.isValid(value)) {
					this._value = value;
					this.cmpRef.emit();
				}
			},
			setNoEmit(value: string) {
				if (this.isValid(value)) {
					this._value = value;
				}
			},
		},
		minutes: {
			isFocused: false,
			cmpRef: this,
			_value: '00',
			isValid(value: string) {
				return (
					value == '' ||
					(value.length <= 2 &&
						!Number.isNaN(Number.parseInt(value)) &&
						Number.parseInt(value) >= 0 &&
						Number.parseInt(value) <= 59)
				);
			},
			get value() {
				return this._value;
			},
			set value(value) {
				if (this.isValid(value)) {
					this._value = value;
					this.cmpRef.emit();
				}
			},
			setNoEmit(value: string) {
				if (this.isValid(value)) {
					this._value = value;
				}
			},
		},
		seconds: {
			isFocused: false,
			cmpRef: this,
			_value: '00',
			isValid(value: string) {
				return (
					value == '' ||
					(value.length <= 2 &&
						!Number.isNaN(Number.parseInt(value)) &&
						Number.parseInt(value) >= 0 &&
						Number.parseInt(value) <= 59)
				);
			},
			get value() {
				return this._value;
			},
			set value(value) {
				if (this.isValid(value)) {
					this._value = value;
					this.cmpRef.emit();
				}
			},
			setNoEmit(value: string) {
				if (this.isValid(value)) {
					this._value = value;
				}
			},
		},
	};
	handleBlur(event: Event, inputType: 'hours' | 'minutes' | 'seconds') {
		const input = event.target as HTMLInputElement;
		if (!input.value) {
			if (inputType == 'hours') {
				this.timeInputs.hours.value = '0';
			} else if (inputType == 'minutes') {
				this.timeInputs.minutes.value = '00';
			} else if (inputType == 'seconds') {
				this.timeInputs.seconds.value = '00';
			}
			this.emit();
		} else if (
			input.value.length == 1 &&
			(inputType == 'minutes' || inputType == 'seconds') &&
			Number.parseInt(input.value) >= 0 &&
			Number.parseInt(input.value) <= 9
		) {
			this.timeInputs[inputType].value = '0' + this.timeInputs[inputType].value;
			this.emit();
		}
		this.timeInputs[inputType].isFocused = false;
		this.timeInputs.isOneOrMoreFocused = false;
	}
	handleFocus(event: Event, inputType: 'hours' | 'minutes' | 'seconds') {
		this.timeInputs[inputType].isFocused = true;
		this.timeInputs.isOneOrMoreFocused = true;
	}
	handleIconClick() {
		if (this.iconCallback) {
			this.iconCallback();
		} else {
			(this.$refs.hours as HTMLInputElement).focus();
		}
	}
}
</script>

<style scoped lang="scss"></style>
