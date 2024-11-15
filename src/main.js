import { createApp } from 'vue'
import router from './router'
import home from './home.vue'
import store from './store/vuex'

const app = createApp(home);
app.use(router);
app.use(store);
app.mount('#app');
