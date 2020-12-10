<template>
	<div
		:class="[
			{
				readonly: readonly,
			},
			timeInputs.isOneOrMoreFocused ? 'container--focused' : 'container',
		]"
	>
		<md-icon @click.native="handleIconClick()">schedule</md-icon>
		<div class="non-icon-part">
			<label>{{ label }}</label>
			<div class="digit-container">
				<input
					@click="digitClicked($event)"
					@blur="handleBlur($event, 'hours')"
					@focus="handleFocus($event, 'hours')"
					v-model="timeInputs.hours.value"
					ref="hours"
					class="digit--hour"
					type="text"
					:disabled="readonly"
				/>
				<div class="separator">:</div>
				<input
					@click="digitClicked($event)"
					@blur="handleBlur($event, 'minutes')"
					@focus="handleFocus($event, 'minutes')"
					v-model="timeInputs.minutes.value"
					class="digit--minute"
					type="text"
					:disabled="readonly"
				/>
				<div class="separator">:</div>
				<input
					@click="digitClicked($event)"
					@blur="handleBlur($event, 'seconds')"
					@focus="handleFocus($event, 'seconds')"
					v-model="timeInputs.seconds.value"
					class="digit--second"
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
.container:hover:not(.readonly),
.container--focused {
	border-width: 2px !important;
	margin: 3px !important;
}
.container {
	&--focused {
		@extend .container;
		border-color: #ff6f00;
	}
	display: flex;
	align-items: center;
	font-size: 14px;
	border: solid #616161 1px;
	margin: 4px;
	border-radius: 0.6em;
	overflow: hidden;
	background-color: #212121;
	& i {
		margin-left: 4px;
		padding-right: 4px;
		font-size: 20px !important;
	}
	& .non-icon-part {
		flex-grow: 1;
		border-left: solid #616161 1px;
		& label {
			display: block;
			margin-left: 4px;
			margin-top: 4px;
			margin-bottom: -4px;
			font-size: 0.5em;
			line-height: 0.8em;
		}
		& .digit-container {
			display: flex;
		}
	}
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
}
</style>
