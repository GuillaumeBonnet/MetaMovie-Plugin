<template>
	<button
		@click="handleMenuButton()"
		class="touchable PlayerControls--control-element nfp-button-control default-control-button button-nfplayerReportAProblem"
	>
		<md-button class="md-icon-button md-raised md-accent">
			<md-icon>question_answer</md-icon>
		</md-button>
	</button>

	<!-- <v-menu
    class="menu-icon-container PlayerControls--control-element touchable nfp-popup-control"
    v-model="menu"
    offset-y
    close-on-click>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            class="menu-icon touchable PlayerControls--control-element nfp-button-control default-control-button"
            text dark small
            v-bind="attrs"
            v-on="on"
            color="primary">
                <v-icon dark>mdi-comment-text-multiple</v-icon>
            </v-btn>
        </template>

        <v-list>
            <v-list-item>
                <v-list-item-title>toto</v-list-item-title>
            </v-list-item>
            <v-list-item>
                <v-list-item-title>titi</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import BubbleModule from '../store/BubbleModule';
@Component({
	components: {
		// sub-components
	},
})
export default class Menu extends Vue {
	public created() {
		console.log('gboDebug:[this.bubbleModule]', this.bubbleModule);
		console.log(
			'gboDebug:[this.bubbleModule.countGetter]',
			this.bubbleModule.countGetter
		);
		console.log('gboDebug:[this.$store]', this.$store);
	}
	handleMenuButton() {
		this.bubbleModule.increment(1);
		console.log(
			'gboDebug:[this.bubbleModule.countGetter]',
			this.bubbleModule.countGetter
		);
	}

	private bubbleModule = getModule(BubbleModule, this.$store);
	private fav = true;
	private menu = false;
	private message = false;
	private hints = true;
}
</script>

<style scoped lang="scss">
md-button {
}
.menu-icon-container.menu-icon-container {
	padding: 0 0 0.6em 0;
	position: initial;
	width: 3.4em;
	height: 3.6em;
	background: unset;
	&::v-deep div {
		min-width: unset;
		min-height: unset;
		background: unset;
	}
}
</style>
