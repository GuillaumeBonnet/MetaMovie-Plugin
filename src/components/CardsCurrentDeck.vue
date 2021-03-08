<template>
	<ul
		class="scrollbar cursor-default max-h-96 overflow-y-auto p-0 origin-bottom-right absolute transform transition-all delay-300 group-menuItem-hover:delay-100 duration-300 -translate-x-full bottom-0 left-0 bg-gray-800 rounded-md"
		:class="
			forceDisplayDeckCards ? '' : 'scale-0 group-menuItem-hover:scale-100'
		"
	>
		<li
			class="p-5 rounded-md bg-gray-500 m-3"
			v-for="(card, index) in cards"
			:key="index"
		>
			<div class="">
				<div
					class="material-icons text-4xl text-gray-300 hover:text-white cursor-pointer"
					@click="goToCard(card)"
				>
					remove_red_eye
				</div>
				<div
					class="material-icons text-4xl text-gray-300 hover:text-white cursor-pointer ml-4"
					@click="editCard(card)"
				>
					edit
				</div>
			</div>
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
					:modelValue="card.position.x"
					label="x: horizontal position(%)"
					@mousedown.stop
					readonly="true"
				></percentage-input>
				<percentage-input
					class="m-2 p-2 w-1/2"
					:modelValue="card.position.y"
					label="y: vertical position(%)"
					@mousedown.stop
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
import { Prop, Watch } from 'vue-property-decorator';
import TimeSelector from '@/components/TimeSelector.vue';
import PercentageInput from '@/components/PercentageInput.vue';
import { Options, Vue } from 'vue-class-component';
import { ActionMain, MutationMain } from '@/store/Store';
@Options({
	components: {
		TimeSelector,
		PercentageInput,
	},
})
export default class CardsCurrentDeck extends Vue {
	@Prop({ required: true, default: false })
	forceDisplayDeckCards!: boolean;
	get cards() {
		return this.$store.state.cardModule.cards;
	}

	goToCard(card: CardData) {
		this.$store.state.video?.pause();
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			(card.fromInSeconds() + card.toInSeconds()) / 2
		);
	}

	editCard(card: CardData) {
		this.$store.state.video?.pause();
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			(card.fromInSeconds() + card.toInSeconds()) / 2
		);
		this.$store.dispatch(ActionMain.TOGGLE_CARD_EDITED, card);
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
