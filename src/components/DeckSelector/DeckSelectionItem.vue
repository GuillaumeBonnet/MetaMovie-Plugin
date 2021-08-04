<template>
	<div
		class="my-4 p-4 font-medium text-white bg-gray-800 border-gray-400 border-2 rounded-lg"
		:class="{
			['bg-gray-900']: isSelected,
			['hover:border-white hover:bg-gray-900 cursor-pointer']:
				isDeckCurrentMovie && !isSelected,
		}"
	>
		<div class="font-bold text-white text-4xl">{{ deck.name }}</div>
		<div class="mt-4 italic">{{ deck.movie.title }}</div>
		<div class="mt-4 flex align-middle whitespace-nowrap">
			{{ deck.numberOfCards + (deck.numberOfCards == 1 ? ' card' : ' cards') }}
			·
			<span class="italic mx-2">
				{{ countryLabel(deck.languageTag) }}
			</span>
			·
			<div class="mx-2 flex align-middle">
				<div class="material-icons text-gray-500 mr-2 flex items-center">
					account_circle
				</div>
				{{ deck.ownerName }}
			</div>
		</div>
		<div
			@click="isDescExpanded = !isDescExpanded"
			class="mt-4 text-2xl text-gray-300 hover:text-white cursor-pointer relative"
		>
			<div
				class="text-transparent"
				:class="{
					['absolute']: isDescExpanded,
				}"
			>
				Hidden text
			</div>
			<div
				class=""
				:class="{
					['absolute top-0 left-0 overflow-hidden overflow-ellipsis whitespace-nowrap w-full']: !isDescExpanded,
				}"
				:title="isDescExpanded ? 'Click to minimize' : 'Click to expand'"
			>
				{{ deck.description }}
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
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
import { ActionDeck } from '@/store/DeckStore';
import { DeckApi_WithoutCards } from '@/models/ApiTypes';
import { axiosErrorMessage } from '@/Utils/MainUtils';
import langSelectData from './langSelectData';
@Options({
	components: {},
})
export default class DeckSelectionItem extends Vue {
	@Prop()
	deck!: DeckApi_WithoutCards;
	@Prop({ default: false })
	isSelected!: boolean;
	@Prop({ default: false })
	isDeckCurrentMovie!: boolean;

	isDescExpanded = false;

	countryLabel(countryCode: string | null) {
		return (
			langSelectData.find(elem => elem.value == countryCode)?.label ||
			countryCode
		);
	}
}
</script>

<style lang="scss">
@use "src/assets/styles/global-styles" as globalStyle; // there was a namespace conflict fixed by the as rename
</style>

<style scoped lang="scss"></style>
