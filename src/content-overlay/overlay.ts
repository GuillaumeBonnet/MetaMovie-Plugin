import Vue from 'vue'
import AppOverlay from './AppOverlay.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(AppOverlay)
}).$mount('#plugin-meta-movie')
