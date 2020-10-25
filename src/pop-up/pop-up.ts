import Vue from 'vue'
import AppPopUp from './AppPopUp.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(AppPopUp)
}).$mount('#app')
