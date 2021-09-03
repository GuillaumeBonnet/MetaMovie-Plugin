<template>
	<div
		class="cursor-default bg-gray-800 rounded-md border-black border-1 shadow-xl p-0 origin-top-right absolute transform transition-all delay-300 group-menuItem-hover:delay-100 duration-300 -translate-x-full top-0 left-0"
		:class="isCardListShown ? '' : 'scale-0 group-menuItem-hover:scale-100'"
	>
		<button
			class="m-6 block ml-auto material-icons rounded-md w-12 h-12 text-3xl  hover:shadow-sm outline-none focus:outline-none bg-gray-600 hover:bg-gray-800 border-1 border-solid border-gray-900 transform transition-transform duration-300 ease-in-out"
			@click="closeButton()"
			@mousedown.stop
		>
			close
		</button>
		<ul class="scrollbar overflow-y-auto mh-screen50 ">
			<li
				class="custo-min-with-li flex"
				v-if="currentDeck && canEditCurrentDeck"
			>
				<div
					class="flex-grow p-5 group-currentDeckAction cursor-pointer rounded-md bg-gray-500 m-3 flex align-middle justify-center h-full"
					@click="addNewCard()"
					aria-describedby="tooltip-new-card"
				>
					<MatTooltip id="tooltip-new-card" label="New Card"></MatTooltip>
					<div
						class="material-icons text-gray-300 group-currentDeckAction-hover:text-white"
					>
						note_add
					</div>
				</div>
				<div
					class="flex-grow p-5 rounded-md bg-gray-500 m-3 flex align-middle justify-center h-full"
					:class="
						currentDeck.hasLocalModifs
							? 'cursor-pointer group-currentDeckAction'
							: ''
					"
					@click="updateDeck()"
					aria-describedby="tooltip-backup"
				>
					<MatTooltip
						id="tooltip-backup"
						label="Save modifications"
					></MatTooltip>
					<MatPopup
						ref="popup-update-current-deck"
						title="Save deck confirmation"
					>
						Save deck modifications ?
					</MatPopup>
					<div
						class="material-icons  group-currentDeckAction-hover:text-white "
						:class="
							currentDeck.hasLocalModifs ? 'text-gray-300' : 'text-gray-400'
						"
					>
						backup
					</div>
				</div>
				<div
					class="flex-grow p-5 rounded-md bg-gray-500 m-3 flex align-middle justify-center h-full"
					:class="
						currentDeck.hasLocalModifs
							? 'cursor-pointer group-currentDeckAction'
							: ''
					"
					@click="restoreDeck()"
					aria-describedby="tooltip-restore"
				>
					<MatTooltip
						id="tooltip-restore"
						label="Discard modifications"
					></MatTooltip>
					<MatPopup ref="popup-discard" title="Confirm deck discarded">
						Discard deck modifications ?
					</MatPopup>
					<div
						class="material-icons group-currentDeckAction-hover:text-white "
						:class="
							currentDeck.hasLocalModifs ? 'text-gray-300' : 'text-gray-400'
						"
					>
						restore
					</div>
				</div>
				<DeleteDeckConfirmation></DeleteDeckConfirmation>
			</li>
			<CardDetail
				v-for="(card, index) in cards"
				:key="index"
				:card="card"
				:index="index"
			></CardDetail>
		</ul>
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
import CardData from '@/models/CardData';
import { Prop, Watch } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { ActionMain, MutationMain } from '@/store/Store';
import { MutationCard } from '@/store/CardStore';
import CardDetail from '@/components/CardsCurrentDeck/CardDetail.vue';
import DeleteDeckConfirmation from '@/components/CardsCurrentDeck/DeleteDeckConfirmation.vue';
import MatTooltip from '@/components/material/MatTooltip.vue';
import MatPopup from '@/components/material/MatPopup.vue';
import { ActionDeck, GetterDeck, MutationDeck } from '@/store/DeckStore';
import { readableTime } from '@/Utils/CardUtils';
@Options({
	components: {
		CardDetail,
		MatTooltip,
		MatPopup,
		DeleteDeckConfirmation,
	},
	emits: ['close-card-list'],
})
export default class CardsCurrentDeck extends Vue {
	@Prop({ required: true, default: false })
	isCardListShown!: boolean;

	get cards() {
		return this.$store.state.cardModule.cards;
	}
	get currentDeck() {
		return this.$store.state.deckModule.currentDeck;
	}
	get canEditCurrentDeck() {
		return this.$store.getters[GetterDeck.CAN_EDIT_CURRENT_DECK];
	}

	closeButton() {
		this.$emit('close-card-list');
	}
	async addNewCard() {
		this.$store.commit(MutationDeck.CURRENT_DECK_MODIFIED);
		await this.$store.dispatch(
			ActionMain.TOGGLE_CARD_EDITED,
			new CardData({
				fromStamp: readableTime(this.$store.state.aboutVideo.currentTime),
				toStamp: readableTime(this.$store.state.aboutVideo.currentTime + 10),
				x: 50,
				y: 75,
				text: 'Add Information',
			})
		);
	}
	updateDeck() {
		if (this.currentDeck && !this.currentDeck.hasLocalModifs) {
			return;
		}
		(this.$refs['popup-update-current-deck'] as MatPopup).open(
			(actionName: 'confirm' | 'close') => {
				if (actionName == 'confirm') {
					this.$store.dispatch(ActionDeck.SAVE_CURRENT_DECK);
				}
			}
		);
	}
	restoreDeck() {
		if (this.currentDeck && !this.currentDeck.hasLocalModifs) {
			return;
		}
		(this.$refs['popup-discard'] as MatPopup).open(
			(actionName: 'confirm' | 'close') => {
				if (actionName == 'confirm') {
					this.$store.dispatch(ActionDeck.REFRESH_CURRENT_DECK);
				}
			}
		);
	}
}
</script>

<style lang="scss">
@use "src/assets/styles/global-styles" as globalStyle; // there was a namespace conflict fixed by the as rename
</style>
<style scoped lang="scss">
.custo-min-with-li {
	min-width: 200px;
}
</style>
