import { createApp } from 'vue';
import AppPopUp from './AppPopUp.vue';

console.log('gboDebug: init pop-up script');
const appPopUp = createApp(AppPopUp);
appPopUp.mount('#app');
