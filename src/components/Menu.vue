<template>
    <v-menu
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
    </v-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        // sub-components
    },
})
export default class Menu extends Vue {
    handleMenuButton() {
        console.log("gboDebug:[button clicked]");        
    }

    private fav = true;
    private menu = false;
    private message = false;
    private hints = true;
}
</script>

<style scoped lang="scss">
    .menu-icon.menu-icon {
        height: 100%;
        width: 100%;
        padding: 0px;
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
