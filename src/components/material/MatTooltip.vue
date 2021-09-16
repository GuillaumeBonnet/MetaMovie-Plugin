<template>
	<teleport :to="videoWrapperSelector">
		<div
			:id="id"
			ref="tooltip"
			class="mdc-tooltip z-1000010"
			role="tooltip"
			aria-hidden="true"
		>
			<div class="mdc-tooltip__surface">
				{{ label }}
			</div>
		</div>
	</teleport>
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
import { videoWrapperSelector } from '@/chrome-scripts/netflix-selectors';
import { MDCTooltip } from '@material/tooltip';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({ components: {}, emits: [] })
export default class MatTooltip extends Vue {
	videoWrapperSelector = videoWrapperSelector;
	mounted() {
		const tooltipNode = this.$refs.tooltip as Element;
		if (tooltipNode) {
			this.tooltip = new MDCTooltip(tooltipNode);
		}
	}
	tooltip?: MDCTooltip;
	beforeUnmount() {
		this.tooltip?.destroy();
	}
	@Prop({ required: true })
	id!: string;
	@Prop({ required: true })
	label!: string;
}
</script>

<style scoped lang="scss">
@use "@material/tooltip/styles";
.mdc-switch {
	--mdc-theme-secondary: rgb(217, 119, 6);
}
</style>
