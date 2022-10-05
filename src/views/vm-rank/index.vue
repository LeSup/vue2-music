<template>
  <div class="vm-rank">
    <base-scroll class="vm-rank-view" :data="topList">
      <ul class="rank-ul">
        <li class="rank-li" @click="handleClick(item)" v-for="item in topList" :key="item.id">
          <div class="img-wrapper">
            <img class="img" v-lazy="item.pic" :alt="item.name" />
          </div>
          <ul class="singer-ul">
            <li class="singer-li" v-for="(singer, index) in item.songList" :key="index">
              <span>{{index + 1}}. </span>
              <span>{{singer.singerName}}-{{singer.songName}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </base-scroll>
    <template v-if="!topList.length">
      <base-loading></base-loading>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import BaseScroll from '@/components/base-scroll';
import BaseLoading from '@/components/base-loading';
import { getTopList } from '@/services/top-list';
import { mapMutations } from 'vuex';

export default {
  name: 'vmRank',
  data() {
    return {
      topList: []
    };
  },
  mounted() {
    this.getTopList();
  },
  methods: {
    async getTopList() {
      const { topList } = await getTopList();
      this.topList = topList;
    },
    handleClick(item) {
      this.setRank(item);
      this.$router.push({
        path: `/rank/${item.id}`
      });
    },
    ...mapMutations([
      'setRank'
    ])
  },
  components: {
    BaseScroll,
    BaseLoading
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/mixin'

  .vm-rank
    position relative
    height: calc(100vh - 5rem)
  .vm-rank-view
    height: 100%
    overflow: hidden
    .rank-li
      display: flex
      margin: 0 1.25rem
      padding-top: 1.25rem
      &:last-child
        padding-bottom: 1.25rem
      .img-wrapper
        flex: 0 0 6.25rem
        height: 6.25rem
        .img
          width: 100%
          height: 100%
      .singer-ul
        flex: 1
        min-width: 0
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 1.25rem
        font-size: var(--font-size-small)
        line-height: 1.5rem
        color: var(--color-text-d)
        background: var(--color-highlight-background)
      .singer-li
        ellipsis()
</style>
