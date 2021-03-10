<template>
	<ul
		class="scrollbar cursor-default max-h-96 overflow-y-auto p-0 origin-bottom-right absolute transform transition-all delay-300 group-menuItem-hover:delay-100 duration-300 -translate-x-full bottom-0 left-0 bg-gray-800 rounded-md"
		:class="
			forceDisplayDeckCards ? '' : 'scale-0 group-menuItem-hover:scale-100'
		"
	>
		<li
			class="group-deckListNewCard cursor-pointer p-5 rounded-md bg-gray-500 m-3 flex align-middle justify-center"
			@click="addNewCard()"
		>
			<div
				class="material-icons text-gray-300 group-deckListNewCard-hover:text-white "
			>
				note_add
			</div>
		</li>
		<CardDetail
			v-for="(card, index) in cards"
			:key="index"
			:card="card"
		></CardDetail>
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
import { Options, Vue } from 'vue-class-component';
import { ActionMain, MutationMain } from '@/store/Store';
import { MutationCard } from '@/store/CardStore';
import CardDetail from '@/components/CardsCurrentDeck/CardDetail.vue';
@Options({
	components: {
		CardDetail,
	},
})
export default class CardsCurrentDeck extends Vue {
	@Prop({ required: true, default: false })
	forceDisplayDeckCards!: boolean;
	get cards() {
		return this.$store.state.cardModule.cards;
	}

	addNewCard() {
		this.$store.commit(
			MutationCard.ADD_CARD,
			new CardData({
				fromStamp: '0:00:00',
				toStamp: '0:00:30',
				x: 50,
				y: 50,
				text: 'New Card',
			})
		);
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
