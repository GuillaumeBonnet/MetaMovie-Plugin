<template>
	<div class="flex justify-between w-full">
		<label for="basic-switch" class="flex-grow">{{ label }}</label>
		<div>
			<div
				class="mdc-switch"
				:class="{
					'mdc-switch--checked': modelValue,
					'mdc-switch--disabled': disabled,
				}"
				@click="switchTogle()"
			>
				<div class="mdc-switch__track"></div>
				<div class="mdc-switch__thumb-underlay">
					<div class="mdc-switch__thumb">
						<input
							type="checkbox"
							id="basic-switch"
							class="mdc-switch__native-control"
							role="switch"
							:value="modelValue"
							:disabled="disabled"
						/>
					</div>
				</div>
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
import { MDCSwitch } from '@material/switch';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: ['update:modelValue'] })
export default class MatSwitch extends Vue {
	mounted() {
		const switchNode = this.$el.querySelector('.mdc-switch');
		if (switchNode) {
			this.switchControl = new MDCSwitch(switchNode);
		}
	}
	switchControl?: MDCSwitch;
	beforeUnmount() {
		this.switchControl?.destroy();
	}
	@Prop({ default: false })
	modelValue!: boolean;
	@Prop({ default: false })
	disabled!: boolean;
	@Prop({ default: false })
	label!: string;
	switchTogle() {
		this.$emit('update:modelValue', !this.modelValue);
	}
}
</script>

<style scoped lang="scss">
@use "@material/switch";
@include switch.core-styles;
.mdc-switch {
	--mdc-theme-secondary: rgb(217, 119, 6);
}
</style>
