import {createApp} from 'vue';
import LatteMagusVue from '@/latte-magus-vue';
import {appConfig} from "@/configs/appConfig";
import router from '@/routes';
import App from '@/App.vue';

const app = createApp(App);

/* 加载组件 */
app.use(LatteMagusVue, appConfig);

/* 加载路由 */
app.use(router);

/* 挂载app */
app.mount('#app');
