<template>
	<div
		class="border-1 flex items-center text-sm border-solid rounded-lg overflow-hidden bg-gray-900"
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
			<label class="text-xs flex items-start ml-1 mt-0 -mb-1.5">{{
				label
			}}</label>
			<div class="flex -mb-2">
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
	components: {
		// sub-components
	},
})
export default class TimeSelector extends Vue {
	created() {
		this.onValueChange(this.value, '');
	}
	@Prop()
	label!: string;
	@Prop()
	value!: string;
	@Prop({ default: false })
	readonly!: boolean;
	@Watch('value')
	onValueChange(newValue: string, oldValue: string) {
		if (/\d+:\d+:\d+/.test(newValue)) {
			// Destructuring assignment
			[
				this.timeInputs.hours.value,
				this.timeInputs.minutes.value,
				this.timeInputs.seconds.value,
			] = newValue.split(':');
		} else {
			console.warn('TimeSelector input value is wrong.');
		}
	}

	emit() {
		const emitValue = `${this.timeInputs.hours.value}:${this.timeInputs.minutes.value}:${this.timeInputs.seconds.value}`;
		if (/\d:\d\d:\d\d/.test(emitValue)) {
			this.$emit('input', emitValue);
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
			get value() {
				return this._value;
			},
			set value(value) {
				if (
					value == '' ||
					(value.length <= 1 &&
						!Number.isNaN(Number.parseInt(value)) &&
						Number.parseInt(value) >= 0 &&
						Number.parseInt(value) <= 9)
				) {
					this._value = value;
					this.cmpRef.emit();
				}
			},
		},
		minutes: {
			isFocused: false,
			cmpRef: this,
			_value: '00',
			get value() {
				return this._value;
			},
			set value(value) {
				if (
					value == '' ||
					(value.length <= 2 &&
						!Number.isNaN(Number.parseInt(value)) &&
						Number.parseInt(value) >= 0 &&
						Number.parseInt(value) <= 59)
				) {
					this._value = value;
					this.cmpRef.emit();
				}
			},
		},
		seconds: {
			isFocused: false,
			cmpRef: this,
			_value: '00',
			get value() {
				return this._value;
			},
			set value(value) {
				if (
					value == '' ||
					(value.length <= 2 &&
						!Number.isNaN(Number.parseInt(value)) &&
						Number.parseInt(value) >= 0 &&
						Number.parseInt(value) <= 59)
				) {
					this._value = value;
					this.cmpRef.emit();
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
		(this.$refs.hours as HTMLElement).focus();
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
@include input('.container'); */

/* .digit-container {
	display: flex;
}
.separator {
	display: flex;
	align-items: center;
	font-size: 1.5em;
	$side-margin-separator: -4 px;
	margin-left: $side-margin-separator;
	margin-right: $side-margin-separator;
}
.digit {
	text-align: center;
	width: 2em;
	height: 2em;
	margin-top: -1px;
	margin-bottom: -1px;
	background-color: transparent;
	font-size: 1.1em;
	font-weight: 800;
	border: none;
	&:focus {
		outline: none;
	}
	&--hour {
		@extend .digit;
		width: 1.5em;
	}
	&--minute {
		@extend .digit;
	}
	&--second {
		@extend .digit;
	}
} */
</style>
