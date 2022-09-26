import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/home'
import Detail from '../views/detail'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [{
    path: '/home',
    component: Home
  }, {
    path: '/detail/:id',
    component: Detail
  }]
})