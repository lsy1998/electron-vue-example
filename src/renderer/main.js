import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';  // 新添加
import 'element-ui/lib/theme-chalk/index.css';  //新添加
import './css/main.css'; 
import App from './App'
import router from './router'
import store from './store'
import ellipsis from '@hyjiacan/vue-ellipsis'
import {db} from './datastore'

Vue.use(ellipsis)
Vue.use(ElementUI);  

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$db = db

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
