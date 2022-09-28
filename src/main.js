import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';
import App from './app';
import router from './router';
import loadingImg from './common/images/default.png';
import './common/stylus/index.styl';

Vue.use(VueLazyLoad, {
  loading: loadingImg
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
