<template>
	<ul
		class="shadow-xl scrollbar cursor-default max-h-96 overflow-y-auto p-0 origin-bottom-right absolute transform transition-all delay-300 group-menuItem-hover:delay-100 duration-300 -translate-x-full bottom-0 left-0 bg-gray-800 rounded-md"
		:class="
			forceDisplayDeckCards ? '' : 'scale-0 group-menuItem-hover:scale-100'
		"
	>
		<li class="custo-min-with-li flex" v-if="currentDeck">
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
				<MatTooltip id="tooltip-backup" label="Save modifications"></MatTooltip>
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
import DeleteDeckConfirmation from '@/components/CardsCurrentDeck/DeleteDeckConfirmation.vue';
import MatTooltip from '@/components/material/MatTooltip.vue';
import MatPopup from '@/components/material/MatPopup.vue';
import { ActionDeck, MutationDeck } from '@/store/DeckStore';
import { MDCDialog } from '@material/dialog';
@Options({
	components: {
		CardDetail,
		MatTooltip,
		MatPopup,
		DeleteDeckConfirmation,
	},
})
export default class CardsCurrentDeck extends Vue {
	@Prop({ required: true, default: false })
	forceDisplayDeckCards!: boolean;

	get cards() {
		return this.$store.state.cardModule.cards;
	}
	get currentDeck() {
		return this.$store.state.deckModule.currentDeck;
	}

	addNewCard() {
		this.$store.commit(MutationDeck.CURRENT_DECK_MODIFIED);
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

<style scoped lang="scss">
.custo-min-with-li {
	min-width: 200px;
}
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
