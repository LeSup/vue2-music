import Vue from 'vue';
import VueRouter from 'vue-router';
import Recommend from '@/views/vm-recommend';
import Singer from '@/views/vm-singer';
import Rank from '@/views/vm-rank';
import Search from '@/views/vm-search';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend
  }, {
    path: '/singer',
    component: Singer
  }, {
    path: '/rank',
    component: Rank
  }, {
    path: '/search',
    component: Search
  }]
})
