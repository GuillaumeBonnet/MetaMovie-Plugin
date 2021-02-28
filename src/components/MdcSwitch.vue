<template>
	<div class="flex justify-between w-full">
		<label for="basic-switch" class="flex-grow">{{ label }}</label>
		<div>
			<div
				class="mdc-switch"
				:class="{
					'mdc-switch--checked': value,
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
							:value="value"
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

@Options({ components: {} })
export default class MdcSwitch extends Vue {
	constructor() {
		super();
	}
	// mounted() {
	// 	const switchNode = this.$el.querySelector('.mdc-switch');
	// 	if (switchNode) {
	// 		const switchControl = new MDCSwitch(switchNode);
	// 	}
	// }
	@Prop({ default: false })
	value!: boolean;
	@Prop({ default: false })
	disabled!: boolean;
	@Prop({ default: false })
	label!: string;
	switchTogle() {
		console.log('gboDebug: switchTogle');
		console.log('gboDebug:[!this.value]', !this.value);
		this.$emit('input', !this.value);
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
.mdc-switch {
	--mdc-theme-secondary: rgb(217, 119, 6);
}
</style>
