<template>
	<md-menu md-direction="top-start" md-align-trigger>
		<button
			class="touchable PlayerControls--control-element nfp-button-control default-control-button button-nfplayerReportAProblem"
		>
			<md-button md-menu-trigger class="md-icon-button md-raised md-accent">
				<md-icon>question_answer</md-icon>
			</md-button>
		</button>

		<md-menu-content class="menu-box">
			<md-switch @change="handleSwitchToggling()" v-model="areBubblesHidden"
				>Hide bubbles</md-switch
			>
			<md-menu-item>My Item 1</md-menu-item>
			<md-menu-item>My Item 2</md-menu-item>
			<md-menu-item>My Item 3</md-menu-item>
		</md-menu-content>
	</md-menu>

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
	handleSwitchToggling() {
		this.bubbleModule.toggleAreBubleHidden();
	}

	private bubbleModule = getModule(BubbleModule, this.$store);
	private areBubblesHidden = !this.bubbleModule.areBubbleDisplayed;
	private fav = true;
	private menu = false;
	private message = false;
	private hints = true;
}
</script>

<style scoped lang="scss">
.menu-box::v-deep .md-list {
	padding: 0.8em;
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
