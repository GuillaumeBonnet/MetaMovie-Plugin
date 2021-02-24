<template>
	<ul
		class="scrollbar cursor-default max-h-96 overflow-y-auto p-0 origin-bottom-right scale-0 group-menuItem-hover:scale-100 absolute transform transition-all delay-300 group-menuItem-hover:delay-100 duration-300 -translate-x-full bottom-0 left-0 bg-gray-800 rounded-md"
	>
		<li
			class="p-5 rounded-md bg-gray-500 m-3"
			v-for="(card, index) in displayedCards"
			:key="index"
		>
			<div class="rounded-2xl border-solid border-2 border-gray-800 p-2">
				<p
					class="flex text-2xl text-gray-50 font-medium bg-transparent border-gray-900 p-2 outline-none resize-none w-full"
				>
					{{ card.text }}
				</p>
			</div>
			<div class="flex">
				<time-selector
					class="m-2 p-2 w-1/2"
					v-model="card.from"
					label="From"
					readonly="true"
				></time-selector>
				<time-selector
					class="m-2 p-2 w-1/2"
					v-model="card.to"
					label="To"
					readonly="true"
				></time-selector>
			</div>
			<div class="flex">
				<percentage-input
					class="m-2 p-2 w-1/2"
					:value="card.position.x"
					label="x: horizontal position(%)"
					@mousedown.native.stop
					readonly="true"
				></percentage-input>
				<percentage-input
					class="m-2 p-2 w-1/2"
					:value="card.position.y"
					label="y: vertical position(%)"
					@mousedown.native.stop
					readonly="true"
				></percentage-input>
			</div>
		</li>
	</ul>
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
import CardData from '@/models/CardData';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TimeSelector from '@/components/TimeSelector.vue';
import PercentageInput from '@/components/PercentageInput.vue';
import { State } from 'vuex-class';
import { IState } from '@/store/Store';
import { ICardState } from '@/store/CardStore';
@Component({
	components: {
		TimeSelector,
		PercentageInput,
	},
})
export default class CurrentDeck extends Vue {
	@State((state: IState) => state.cardModule.cards)
	displayedCards!: ICardState['displayedCards'];
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
/*                                    postcss                                    */
/* -------------------------------------------------------------------------- */
.scrollbar {
}
.scrollbar::-webkit-scrollbar {
	width: 8px;
}
.scrollbar::-webkit-scrollbar-track {
	border-radius: 8px;
}
.scrollbar::-webkit-scrollbar-thumb {
	border-radius: 8px;
	background: #757575;
}
.scrollbar::-webkit-scrollbar-button {
	display: none;
}
</style>
