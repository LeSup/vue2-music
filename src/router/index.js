import Vue from 'vue';
import VueRouter from 'vue-router';
import Recommend from '@/views/vm-recommend';
import RecommendDetail from '@/views/vm-recommend-detail';
import Singer from '@/views/vm-singer';
import SingerDetail from '@/views/vm-singer-detail';
import Rank from '@/views/vm-rank';
import RankDetail from '@/views/vm-rank-detail';
import Search from '@/views/vm-search';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: RecommendDetail
    }]
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  }, {
    path: '/rank',
    component: Rank,
    children: [{
      path: ':id',
      component: RankDetail
    }]
  }, {
    path: '/search',
    component: Search
  }]
})
