// import '@/assets/styles/styles.css';
import { createApp } from 'vue';
import AppPopUp from './AppPopUp.vue';
/* eslint-disable */
//@ts-ignore
import VueMaterialAdapter from 'vue-material-adapter';

const appPopUp = createApp(AppPopUp);
appPopUp.use(VueMaterialAdapter);
appPopUp.mount('#app');
