<template>
	<li class="p-5 rounded-md bg-gray-500 m-3">
		<div class="">
			<div
				class="material-icons text-4xl text-gray-300 hover:text-white cursor-pointer"
				:class="animate ? 'animate-bounce' : ''"
				@click="goToCard()"
				:aria-describedby="'tooltip-go-card' + index"
			>
				<MatTooltip
					:id="'tooltip-go-card' + index"
					label="Show card"
				></MatTooltip>
				remove_red_eye
			</div>
			<div
				class="material-icons text-4xl text-gray-300 hover:text-white cursor-pointer ml-4"
				:class="animate ? 'animate-bounce' : ''"
				@click="editCard()"
				:aria-describedby="'tooltip-edit-card' + index"
			>
				<MatTooltip
					:id="'tooltip-edit-card' + index"
					label="Edit card"
				></MatTooltip>
				edit
			</div>
			<div
				class="material-icons text-4xl text-gray-300 hover:text-white cursor-pointer ml-4"
				:class="animate ? 'animate-bounce' : ''"
				@click="deleteCard()"
				:aria-describedby="'tooltip-delete-card' + index"
			>
				<MatTooltip
					:id="'tooltip-delete-card' + index"
					label="Delete card"
				></MatTooltip>
				delete
			</div>
		</div>
		<div class="rounded-2xl border-solid border-2 border-gray-800 p-2">
			<p
				class="flex text-2xl text-gray-50 font-medium bg-transparent border-gray-900 p-2 outline-none resize-none w-full"
				@click="makeIconsBounce()"
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
				@click="makeIconsBounce()"
			></time-selector>
			<time-selector
				class="m-2 p-2 w-1/2"
				v-model="card.to"
				label="To"
				readonly="true"
				@click="makeIconsBounce()"
			></time-selector>
		</div>
		<div class="flex">
			<percentage-input
				class="m-2 p-2 w-1/2"
				:modelValue="card.position.x"
				label="x: horizontal position(%)"
				@mousedown.stop
				readonly="true"
				@click="makeIconsBounce()"
			></percentage-input>
			<percentage-input
				class="m-2 p-2 w-1/2"
				:modelValue="card.position.y"
				label="y: vertical position(%)"
				@mousedown.stop
				readonly="true"
				@click="makeIconsBounce()"
			></percentage-input>
		</div>
	</li>
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
import CardData from '@/models/CardData';
import TimeSelector from '@/components/TimeSelector.vue';
import MatTooltip from '@/components/material/MatTooltip.vue';
import PercentageInput from '@/components/PercentageInput.vue';
import { ActionMain, MutationMain } from '@/store/Store';
import { MutationCard } from '@/store/CardStore';
import { MutationDeck } from '@/store/DeckStore';
@Options({
	components: { TimeSelector, PercentageInput, MatTooltip },
	props: {},
})
export default class CardDetail extends Vue {
	@Prop({ required: true })
	card!: CardData;
	@Prop({ required: true })
	index!: number;
	animate = false;

	goToCard() {
		this.$store.state.video?.pause();
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			(this.card.fromInSeconds() + this.card.toInSeconds()) / 2
		);
	}

	editCard() {
		this.$store.state.video?.pause();
		this.$store.commit(MutationDeck.CURRENT_DECK_MODIFIED);
		this.$store.commit(
			MutationMain.SET_VIDEO_CURRENT_TIME_S,
			(this.card.fromInSeconds() + this.card.toInSeconds()) / 2
		);
		this.$store.dispatch(ActionMain.TOGGLE_CARD_EDITED, this.card);
	}
	deleteCard() {
		this.$store.commit(MutationDeck.CURRENT_DECK_MODIFIED);
		this.$store.commit(MutationCard.DELETE_CARD, this.card);
	}
	makeIconsBounce() {
		this.animate = true;
		setTimeout(() => {
			this.animate = false;
		}, 500);
	}
}
</script>

<style scoped lang="scss"></style>
