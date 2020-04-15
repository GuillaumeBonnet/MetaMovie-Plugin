<template>
  <div class="overlay-container">
    RootOverlay RootOverlay RootOverlay RootOverlay RootOverlay RootOverlay RootOverlay RootOverlay RootOverlay 
    <HelloWorld msg="Welcome to [RootOverlay] Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import HelloWorld from './HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class RootOverlay extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .overlay-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9000;

    border: 5px red solid;
    display: flex;
    align-content: center;
    align-items: center;
  }
</style>
