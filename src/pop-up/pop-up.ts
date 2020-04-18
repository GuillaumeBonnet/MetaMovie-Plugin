import Vue from 'vue'
import AppPopUp from './AppPopUp.vue'
import vuetify from '../plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(AppPopUp)
}).$mount('#app')
