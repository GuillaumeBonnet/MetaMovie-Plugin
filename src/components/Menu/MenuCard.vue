<template>
	<div class="border-gray-500 bg-gray-800 border-2 rounded-xl p-5">
		<slot></slot>
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
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
@Options({
	components: {},
})
export default class MenuCard extends Vue {}
</script>

<style scoped lang="postcss">
.mdc-button {
	@include button.ink-color(
		(
			default: $gray-100,
			hover: white,
			focus: white,
			pressed: white,
			disabled: $gray-400
		)
	);
	&:not(.mdc-button--raised):not(.mdc-button--outlined) {
		@include button.container-fill-color(
			(
				hover: rgba($gray-100, 0.1)
			)
		);
	}
	&--raised {
	}
	&--outlined {
		@include button.outline-color(
			(
				default: $gray-200,
				hover: white,
				focus: $gray-400,
				pressed: white,
				disabled: $gray-400
			)
		);
	}
}
</style>
