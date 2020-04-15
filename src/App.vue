<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <RootOverlay/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RootOverlay from './components/RootOverlay.vue';

@Component({
  components: {
    RootOverlay,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  position: top;
  top: 0;
}
</style>
