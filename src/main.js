import Vue from 'vue';
import App from './app';
import router from './router'
import './common/stylus/index.styl'

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
