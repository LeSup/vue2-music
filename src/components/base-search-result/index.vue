<template>
  <base-scroll class="search-result" ref="scroll" :data="data">
    <ul class="list">
      <li class="item" v-for="item in data" :key="item.id">
        <i class="icon" :class="getIconCls(item)"></i>
        <span class="name">{{item.name}}</span>
      </li>
    </ul>
    <base-no-result v-show="!data.length" text="抱歉，暂无搜索结果"></base-no-result>
    <base-loading v-show="loading && !data.length"></base-loading>
  </base-scroll>
</template>

<script>
import BaseScroll from '@/components/base-scroll';
import BaseNoResult from '@/components/base-no-result';
import BaseLoading from '@/components/base-loading';
import { search } from '@/services/search';
import { processSongs } from '@/services/song';

export default {
  name: 'baseSearchResult',
  props: {
    value: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      page: 1,
      data: [],
      loading: false
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const result = await search(this.value, this.page, this.showSinger);
      const songs = await processSongs(result.songs);
      if (result.singer) {
        songs.unshift(result.singer);
      }
      this.data = songs;
      this.loading = false;
    },
    getIconCls(item) {
      return item.singer ? 'icon-music' : 'icon-mine';
    }
  },
  components: {
    BaseScroll,
    BaseNoResult,
    BaseLoading
  }
}
</script>

<style lang="stylus">
  .search-result
    position: relative
    height: 100%
    overflow: hidden
    .list
      padding: 0 1.25rem 0.75rem
      .item
        font-size: var(--font-size-medium)
        line-height: 1.5rem
        color: var(--color-text-l)
        &:not(:first-child)
          margin-top: 0.75rem
        .name
          margin-left: 0.5rem
</style>
