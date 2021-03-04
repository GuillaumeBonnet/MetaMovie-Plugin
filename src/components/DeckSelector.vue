<template>
	<li>DeckSelector {{ decks }}</li>
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
export default class DeckSelector extends Vue {
	get decks() {
		return this.$store.state.deckModule.decks[0]?.name;
	}
}
</script>

<style scoped lang="postcss"></style>
